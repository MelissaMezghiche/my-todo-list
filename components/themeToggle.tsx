'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { TbBellRinging } from 'react-icons/tb';
import { useFetchTasks } from '../src/hooks/useFetchTasks';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour gérer le dropdown
  const { todaysTasks } = useFetchTasks();

  // Fonction pour basculer entre les thèmes
  function toggleTheme(selectedTheme: string) {
    setTheme(selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Notification pour les tâches du jour
  useEffect(() => {
    todaysTasks.forEach(task => {
      const taskTime = new Date(task.dueDate).getTime();
      const now = new Date().getTime();

      if (taskTime >= now && taskTime - now <= 60000) { // Notification si la tâche commence dans une minute
        new Notification(`Tâche imminente : ${task.title}`, {
          body: `La tâche '${task.title}' est prévue pour aujourd'hui.`,
          icon: '/path/to/notification-icon.png',
        });
      }
    });
  }, [todaysTasks]);

  // Fonction pour afficher l'heure formatée d'une tâche
  const formatTime = (date: string) => {
    const taskDate = new Date(date);
    return `${taskDate.getHours()}:${taskDate.getMinutes() < 10 ? '0' : ''}${taskDate.getMinutes()}`;
  };

  // Filtrer les tâches "pending" du jour
  const pendingTasksToday = todaysTasks.filter(task => task.status === 'in-progress');

  return (
    <div className="Notif-L-D-mode">
      <div className="notification-icon" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <TbBellRinging className="Icons" />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <h3>Tâches en attente</h3>
          {pendingTasksToday.length === 0 ? (
            <p>Aucune tâche en attente pour aujourd'hui.</p>
          ) : (
            pendingTasksToday.map((task) => (
              <div key={task.id} className="task-item">
                <p>{task.title}</p>
                <span>{formatTime(task.dueDate)}</span>
              </div>
            ))
          )}
        </div>
      )}

      <FiMoon
        className={`Icons ${theme === 'dark' ? 'active' : ''}`}
        onClick={() => toggleTheme('dark')}
      />
      <FiSun
        className={`Icons ${theme === 'light' ? 'active' : ''}`}
        onClick={() => toggleTheme('light')}
      />
    </div>
  );
}
