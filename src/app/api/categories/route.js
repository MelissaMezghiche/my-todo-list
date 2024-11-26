import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const categories = await prisma.category.findMany();

        if (!categories || categories.length === 0) {
            return new Response(JSON.stringify({ error: 'No categories found' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 404,
            });
        }

        return new Response(JSON.stringify(categories), {
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
