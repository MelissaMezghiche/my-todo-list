import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Définir les statuts et leurs couleurs associées
    const statuses = [
      { status: 'completed', label: 'Accomplies', color: '#f4c724', hoverColor: '#f5d94c' },
      { status: 'in-progress', label: 'En cours', color: '#437A6F', hoverColor: '#5a9983' },
      { status: 'expired', label: 'Échues', color: '#e63946', hoverColor: '#f16465' },
      { status: 'pending', label: 'À venir', color: '#f1e0b0', hoverColor: '#f7e5bf' },
    ];

    // Pour chaque statut, compter le nombre de tâches
    const stats = await Promise.all(
      statuses.map(async (status) => {
        const count = await prisma.task.count({ where: { status: status.status } });
        return {
          label: status.label,
          value: count,
          backgroundColor: status.color,
          hoverBackgroundColor: status.hoverColor,
        };
      })
    );

    return new Response(JSON.stringify(stats), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch task stats' }),
      { status: 500 }
    );
  }
}
