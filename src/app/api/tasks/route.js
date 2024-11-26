import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const tasks = await prisma.task.findMany({
            include: {
              category: true,
              priority: true, // Inclure les données de la catégorie
            },
          });       

        if (!tasks || tasks.length === 0) {
            return new Response(JSON.stringify({ error: 'No tasks found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(tasks), {
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
