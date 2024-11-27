// src/hooks/useFetchTasks.ts

import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: 1 | 2 | 3;
}

export function useFetchTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [progressTasks, setProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [todaysTasks, setTodaysTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fonction pour formater la date actuelle sans l'heure
    const getTodayDate = () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    };

    // Fonction pour fetch les tâches et préparer les données nécessaires
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
          const data: Task[] = await response.json();

          // Récupérer la date actuelle
          const today = getTodayDate();

          // Filtrer les tâches "pending"
          const pending = data.filter(task => task.status === 'pending');

          // Trier les tâches "pending" 
          const sortedPending = pending.sort((a, b) => b.priority - a.priority);

          const progress = data.filter(task => task.status === 'in-progress');

          // Trier les tâches "progress" 
          const sortedProgress = progress.sort((a, b) => b.priority - a.priority);


          // Filtrer les tâches "completed"
          const completed = data.filter(task => task.status === 'completed');

          // Trier les tâches "completed" 
          const sortedCompleted = completed.sort((a, b) => b.priority - a.priority);

          // Filtrer les tâches "pending" pour aujourd'hui
          const todayTasks = pending.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toISOString().slice(0, 10) === today.slice(0, 10);
          });

          setTasks(data); 
          setPendingTasks(sortedPending); 
          setProgressTasks(sortedProgress); 
          setCompletedTasks(sortedCompleted);
          setTodaysTasks(todayTasks); 
        } else {
          console.error('Error fetching tasks:', response.status);
        }
      } catch (error) {
        console.error('Error connecting to API:', error);
      }
    };

    fetchTasks();
  }, []);

  return { tasks, pendingTasks, progressTasks, completedTasks, todaysTasks };
}
