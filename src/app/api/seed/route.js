import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        // Insérer les catégories par défaut
        const existingCategories = await prisma.category.findMany();
        if (existingCategories.length === 0) {
            await prisma.category.createMany({
                data: [
                    { name: 'work', color: '#F0F0F0' },
                    { name: 'personal', color: '#D3D3D3' },
                ],
            });
        }

        // Insérer les priorités par défaut
        const existingPriorities = await prisma.priority.findMany();
        if (existingPriorities.length === 0) {
            await prisma.priority.createMany({
                data: [
                    { level: 'Critique', color: '#e07a5f' },
                    { level: 'Important', color: '#f6bd60' },
                    { level: 'Basse', color: '#81b29a' },
                ],
            });
        }

        return new Response(JSON.stringify({ message: 'Seeding completed successfully' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Seeding failed', details: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    } finally {
        await prisma.$disconnect();
    }
}
