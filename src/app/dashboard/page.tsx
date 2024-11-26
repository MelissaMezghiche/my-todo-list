'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider } from '@mui/material/styles';
import LineChart from '../../components/LineChart';
import styles from '/styles/dashboard.module.css';
import theme from '../../../styles/theme';

interface Task {
  id: number;
  title: string;
  category: 'Work' | 'Personal';
  dueDate: string;
  status: 'pending' | 'completed' | 'in-progress';
  priority: 1 | 2 | 3; // 3 is the most urgent
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [progressTasks, setProgressTasks] = useState<Task[]>([]);
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

          // Trier les tâches "pending" par priorité décroissante
          const sortedPending = pending.sort((a, b) => b.priority - a.priority);

          const progress = data.filter(task => task.status === 'in-progress');

          // Trier les tâches "pending" par priorité décroissante
          const sortedProgress = progress.sort((a, b) => b.priority - a.priority);

          // Filtrer les tâches "pending" pour aujourd'hui
          const todayTasks = pending.filter(task => {
            const taskDate = new Date(task.dueDate);
            return taskDate.toISOString().slice(0, 10) === today.slice(0, 10);
          });

          setTasks(data); // Toutes les tâches
          setPendingTasks(sortedPending); // Tâches triées par priorité
          setProgressTasks(sortedProgress); // Tâches triées par priorité
          setTodaysTasks(todayTasks); // Tâches pour aujourd'hui
        } else {
          console.error('Error fetching tasks:', response.status);
        }
      } catch (error) {
        console.error('Error connecting to API:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.dashbody}>
        <div className={styles.dashright}>
          <div className={styles.dashchart}>
            <h2>Dashboard</h2>
            <LineChart />
          </div>

          <h2 className={styles.taskshead}>Categories</h2>
          <div className={styles.dashcategory}>
            <div className={styles.dashwork}>
              <h3>Work</h3>
            </div>
            <div className={styles.dashpersonal}>
              <h3>Personal</h3>
            </div>
          </div>

          <h2 className={styles.taskshead}>Today's Tasks</h2>
          <div className={styles.todaystasks}>
            {todaysTasks.length > 0 ? (
              todaysTasks.map(task => (
                <div key={task.id} className={styles.task}>
                  <h3>{task.title}</h3>
                  <p> {task.category.name}</p>
                  <p> {task.priority.level}</p>
                  <p className={styles.duedate}>
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No pending tasks for today.</p>
            )}
          </div>
        </div>

        <div className={styles.dashleft}>
          <div className={styles.calendarside}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>


          <div className={styles.upcomingside}>
            <p>À VENIR</p>
            <div className={styles.scrollable}>
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div>{task.title}</div>
                  </div>
                ))
              ) : (
                <p>No pending tasks available.</p>
              )}
            </div>
          </div>

          <div className={styles.upcomingside}>
            <p>EN COURS</p>
            <div className={styles.scrollable}>
              <div>Faire à manger</div>
              <div>Boire du lait</div>
              <div>Lire un livre</div>
              <div>Aller à la salle de sport</div>
              <div>Appeler un ami</div>
              <div>Préparer une présentation</div>
              <div>Faire du shopping</div>
              <div>Regarder un film</div>
            </div>
          </div>

         

          <div className={styles.upcomingside}>
            <p>EFFECTUEES</p>
            <div className={styles.scrollable}>
              {progressTasks.length > 0 ? (
                progressTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div>{task.title}</div>
                  </div>
                ))
              ) : (
                <p>No completed tasks available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}
