import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const tasks = await prisma.task.findMany({
            include: {
              category: true,
              priority: true,
            },
          });       

        // Format tasks to match the client-side expectations
        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status || 'Pending', // Add a default status if not present
            startDate: task.startDate ? task.startDate.toISOString() : null,
            dueDate: task.dueDate ? task.dueDate.toISOString() : null,
            completedDate: task.completedDate ? task.completedDate.toISOString() : null,
            category: task.category?.name || 'Unknown',
            priority: task.priority?.level || 'Unknown',
            userId: task.userId
        }));

        if (!formattedTasks.length) {
            return new Response(JSON.stringify({ error: 'No tasks found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(formattedTasks), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}

export async function POST(request) {
  try {
    const { 
      title, 
      categoryId, 
      priorityId, 
      dueDate, 
      description = '', 
      startDate = new Date().toISOString(),
      userId = 1,
      status = 'Pending'
    } = await request.json();

    if (!title || !categoryId || !priorityId || !dueDate) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        categoryId,
        priorityId,
        userId,
        status
      },
    });

    return new Response(JSON.stringify(newTask), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'), 10);

    if (!id) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    await prisma.task.delete({ where: { id } });

    return new Response(JSON.stringify({ message: 'Task deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    const {
      id,
      title,
      description,
      startDate,
      dueDate,
      categoryId,
      priorityId,
      status,
      userId,
    } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Task ID is required' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) {
      return new Response(JSON.stringify({ error: 'Task not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description || existingTask.description,
        startDate: startDate ? new Date(startDate) : existingTask.startDate,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
        categoryId: categoryId || existingTask.categoryId,
        priorityId: priorityId || existingTask.priorityId,
        status: status || existingTask.status,
        userId: userId || existingTask.userId,
      },
    });

    return new Response(JSON.stringify(updatedTask), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}