import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchTasks } from '../hooks/useFetchTasks'; 

const TaskStatsChart = () => {
  const { pendingTasks, /*progressTasks,*/ completedTasks } = useFetchTasks(); 
  const [chartData, setChartData] = useState<any[]>([]);

  // Fonction pour formater la date sans l'heure
  const formatDate = (date: string) => {
    const taskDate = new Date(date);
    return taskDate.toISOString().slice(0, 10); 
  };

  // Fonction pour obtenir la date du premier jour de la semaine (lundi)
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay() || 7; // Si dimanche, retourner 7 au lieu de 0
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - day + 1); // Ajuste la date pour revenir au lundi de la semaine
    return date;
  };

  const getWeekDates = () => {
    const weekDates: string[] = [];
    const today = new Date();
    const startOfWeek = getStartOfWeek(new Date(today));
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i); // Ajoute un jour à la date de départ
      weekDates.push(formatDate(day.toISOString())); // Ajoute chaque date au tableau 
    }
    return weekDates;
  };

  // Calculer les statis des tâches par jour 
  useEffect(() => {
    const weekDates = getWeekDates(); // Récupère les dates de la semaine actuelle (lundi-dimanche)
    const calculateStats = () => {
      const stats = weekDates.map((day) => {
        const pendingStats = pendingTasks.filter(task => formatDate(task.dueDate) === day).length;
        //const progressStats = progressTasks.filter(task => formatDate(task.dueDate) === day).length;
        const completedStats = completedTasks.filter(task => formatDate(task.dueDate) === day).length;

        return {
          day, // Jour de semaine (ex : "2024-11-27")
          pending: pendingStats,
          //inProgress: progressStats,
          completed: completedStats,
        };
      });

      setChartData(stats); // MAJ
    };

    calculateStats();
  }, [pendingTasks, /*progressTasks,*/ completedTasks]);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="pending" stroke="var( --chart-pending)" activeDot={{ r: 8 } } strokeWidth={3}/>
        <Line type="monotone" dataKey="completed" stroke="var( --chart-complete)"  strokeWidth={3}/>
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TaskStatsChart;
