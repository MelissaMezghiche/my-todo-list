import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const priorities = await prisma.priority.findMany();

        if (!priorities || priorities.length === 0) {
            return new Response(JSON.stringify({ error: 'No priorities found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(priorities), {
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
