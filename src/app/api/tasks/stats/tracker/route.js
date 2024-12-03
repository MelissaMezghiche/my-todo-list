import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Calculer la date du début et de la fin de la semaine actuelle
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0); // Début du dimanche
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999); // Fin du samedi

    // Récupérer les tâches de la semaine
    const tasks = await prisma.task.findMany({
      where: {
        startDate: {
          gte: startOfWeek,
          lte: endOfWeek,
        },
      },
      select: {
        startDate: true,
      },
    });

    // Initialiser les données de productivité
    const productivityData = {
      Dimanche: Array(7).fill(0),
      Lundi: Array(7).fill(0),
      Mardi: Array(7).fill(0),
      Mercredi: Array(7).fill(0),
      Jeudi: Array(7).fill(0),
      Vendredi: Array(7).fill(0),
      Samedi: Array(7).fill(0),
    };

    // Calculer la productivité par jour et par créneau
    tasks.forEach((task) => {
      const taskDate = new Date(task.startDate);
      const dayOfWeek = taskDate.getDay();
      const hourOfDay = taskDate.getHours();

      const timeSlotIndex = getTimeSlotIndex(hourOfDay);
      const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][dayOfWeek];

      if (timeSlotIndex !== null) {
        productivityData[dayName][timeSlotIndex]++;
      }
    });

    // Calculer les niveaux de productivité
    const productivityLevels = calculateProductivityLevels(productivityData);

    return Response.json(productivityLevels);
  } catch (error) {
    console.error('Erreur lors de la récupération des données de productivité:', error);
    return Response.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}

// Fonction pour obtenir l'indice du créneau horaire
function getTimeSlotIndex(hour) {
  if (hour >= 5 && hour < 7) return 0;
  if (hour >= 7 && hour < 11) return 1;
  if (hour >= 11 && hour < 13) return 2;
  if (hour >= 13 && hour < 17) return 3;
  if (hour >= 17 && hour < 21) return 4;
  if (hour >= 21 || hour < 1) return 5;
  if (hour >= 1 && hour < 5) return 6;
  return null;
}

// Fonction pour calculer les niveaux de productivité
function calculateProductivityLevels(data) {
  const productivityLevels = {};

  Object.entries(data).forEach(([day, dayData]) => {
    const totalTasks = dayData.reduce((acc, count) => acc + count, 0);
    const maxTasks = Math.max(...dayData);

    if (totalTasks === 0) {
      productivityLevels[day] = Array(7).fill('none');
    } else {
      productivityLevels[day] = dayData.map((count) => {
        if (count === 0) return 'none';
        if (count > totalTasks * 0.66) return 'high';
        if (count > totalTasks * 0.33) return 'medium';
        return 'low';
      });
    }
  });

  return productivityLevels;
}