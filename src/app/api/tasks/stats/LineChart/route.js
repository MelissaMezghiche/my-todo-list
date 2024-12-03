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
    } else if (filter === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filter === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    } else {
      throw new Error('Invalid filter value');
    }

    let completedTasksData, expiredTasksData;

    if (filter === 'week') {
      // Pour la semaine, compter les tâches par jour
      completedTasksData = await prisma.task.groupBy({
        by: ['completedDate'],
        where: {
          status: 'completed',
          completedDate: { 
            gte: startDate, 
            lte: endDate 
          },
        },
        _count: {
          id: true
        },
      });

      expiredTasksData = await prisma.task.groupBy({
        by: ['dueDate'],
        where: {
          status: 'expired',
          dueDate: { 
            gte: startDate, 
            lte: endDate 
          },
        },
        _count: {
          id: true
        },
      });
    } else if (filter === 'year') {
      // Pour l'année, compter les tâches par mois
      completedTasksData = await prisma.task.groupBy({
        by: ['completedDate'],
        where: {
          status: 'completed',
          completedDate: { 
            gte: startDate, 
            lte: endDate 
          },
        },
        _count: {
          id: true
        },
      });

      expiredTasksData = await prisma.task.groupBy({
        by: ['dueDate'],
        where: {
          status: 'expired',
          dueDate: { 
            gte: startDate, 
            lte: endDate 
          },
        },
        _count: {
          id: true
        },
      });
    }

    // Préparer les données pour le graphique
    const labels = filter === 'year'
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Transformer les données pour le graphique
    const completedData = labels.map((_, index) => {
      if (filter === 'week') {
        const dayData = completedTasksData.find(item => 
          new Date(item.completedDate).getDay() === index + 1);
        return dayData ? dayData._count.id : 0;
      } else if (filter === 'year') {
        const monthData = completedTasksData.find(item => 
          new Date(item.completedDate).getMonth() === index
        );
        return monthData ? monthData._count.id : 0;
      }
    });

    const expiredData = labels.map((_, index) => {
      if (filter === 'week') {
        const dayData = expiredTasksData.find(item => 
          new Date(item.dueDate).getDay() === index + 1);
        return dayData ? dayData._count.id : 0;
      } else if (filter === 'year') {
        const monthData = expiredTasksData.find(item => 
          new Date(item.dueDate).getMonth() === index
        );
        return monthData ? monthData._count.id : 0;
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
        details: error.toString() 
      }),
      { status: 500 }
    );
  }
}