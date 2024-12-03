import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter') || 'week';

    const now = new Date();
    let startDate, endDate;

    if (filter === 'week') {
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (filter === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    } else {
      throw new Error('Invalid filter value');
    }

    let completedTasksData, expiredTasksData;

    if (filter === 'week') {
      // Pour la semaine, compter les tâches par jour
      completedTasksData = await prisma.task.findMany({
        where: {
          status: 'completed',
          completedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          completedDate: true,
        },
      });

      expiredTasksData = await prisma.task.findMany({
        where: {
          status: 'expired',
          dueDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          dueDate: true,
        },
      });
    } else if (filter === 'year') {
      // Pour l'année, récupérer toutes les tâches accomplies et échues
      completedTasksData = await prisma.task.findMany({
        where: {
          status: 'completed',
          completedDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          completedDate: true,
        },
      });

      expiredTasksData = await prisma.task.findMany({
        where: {
          status: 'expired',
          dueDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          dueDate: true,
        },
      });
    }

    // Préparer les données pour le graphique
    const labels = filter === 'year'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Transformer les données récupérées
    const completedData = labels.map((_, index) => {
      if (filter === 'week') {
        const dayData = completedTasksData.filter((task) =>
          new Date(task.completedDate).getDay() === index + 1
        );
        return dayData.length;
      } else if (filter === 'year') {
        const monthData = completedTasksData.filter((task) =>
          new Date(task.completedDate).getMonth() === index
        );
        return monthData.length;
      }
    });

    const expiredData = labels.map((_, index) => {
      if (filter === 'week') {
        const dayData = expiredTasksData.filter((task) =>
          new Date(task.dueDate).getDay() === index + 1
        );
        return dayData.length;
      } else if (filter === 'year') {
        const monthData = expiredTasksData.filter((task) =>
          new Date(task.dueDate).getMonth() === index
        );
        return monthData.length;
      }
    });

    return new Response(
      JSON.stringify({
        filter,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        datasets: [
          {
            label: 'Tâches accomplies',
            data: completedData,
            borderColor: '#347064',
            backgroundColor: 'rgba(0, 112, 243, 0.1)',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'Tâches échues',
            data: expiredData,
            borderColor: '#ABCDBB',
            backgroundColor: 'rgba(0, 112, 243, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
        labels: labels,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
        details: error.toString(),
      }),
      { status: 500 }
    );
  }
}
