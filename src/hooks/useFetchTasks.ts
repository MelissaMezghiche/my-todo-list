import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: { level: number; color: string };
  category: { name: string; id: number };
}

interface Category {
  id: number;
  name: string;
}

export function useFetchTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [progressTasks, setProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Formater la date d'aujourd'hui
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().slice(0, 10); // Format 'YYYY-MM-DD'
  };

  // Fonction pour trier les tâches par priorité
  const sortedTasks = (tasks: Task[]) =>
    tasks.sort((a, b) => b.priority.level - a.priority.level);

  // Fonction pour trier les tâches du jour par heure croissante
  const sortTasksByTime = (tasks: Task[]) =>
    tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Fonction pour compter les tâches par statut dans chaque catégorie
  const countTasksByCategory = (categoryId: number) => {
    const pendingCount = pendingTasks.filter(task => task.category.id === categoryId).length;
    const progressCount = progressTasks.filter(task => task.category.id === categoryId).length;
    const completedCount = completedTasks.filter(task => task.category.id === categoryId).length;
    return { pendingCount, progressCount, completedCount };
  };

  useEffect(() => {
    const today = getTodayDate();

    // Fonction pour récupérer les tâches
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data: Task[] = await response.json();

          const pending = sortedTasks(data.filter(task => task.status === 'pending'));
          const progress = sortedTasks(data.filter(task => task.status === 'in-progress'));
          const completed = sortedTasks(data.filter(task => task.status === 'completed'));

          // Filtrer les tâches dont la date d'échéance est aujourd'hui
          const todayTasks = sortTasksByTime(
            data.filter(
              task => task.dueDate.slice(0, 10) === today && task.status !== 'completed'
            )
          );

          setTasks(data);
          setPendingTasks(pending);
          setProgressTasks(progress);
          setCompletedTasks(completed);
          setTodaysTasks(todayTasks);
        } else {
          console.error('Error fetching tasks:', response.status);
        }
      } catch (error) {
        console.error('Error connecting to API:', error);
      }
    };

    // Fonction pour récupérer les catégories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data: Category[] = await response.json();
          setCategories(data);
        } else {
          console.error('Error fetching categories:', response.status);
        }
      } catch (error) {
        console.error('Error connecting to API:', error);
      }
    };

    // Appeler les fonctions
    fetchTasks(), 
    fetchCategories();
  }, [pendingTasks, progressTasks, completedTasks]);

  return { tasks, pendingTasks, progressTasks, completedTasks, todaysTasks, categories, countTasksByCategory };
}
