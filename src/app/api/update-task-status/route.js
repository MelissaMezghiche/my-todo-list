import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const { taskId, status } = await request.json();

        if (!taskId || status === undefined) {
            return new Response(JSON.stringify({ error: 'Invalid input' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        // Determine the completed date if status is 'completed'
        let completedDate = null;
        if (status === "completed") {
            completedDate = new Date(); // Set current date and time for completion
        }
        
        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: { status, completedDate },
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