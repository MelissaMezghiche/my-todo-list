import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFetchTasks } from '../hooks/useFetchTasks';

const TaskStatsChart = () => {
  const { pendingTasks, progressTasks, completedTasks } = useFetchTasks();
  const [chartData, setChartData] = useState<any[]>([]);

  // Formate la date en "Jour Semaine Jour"
  const formatDayLabel = (date: string | Date) => {
    const taskDate = new Date(date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric' };
    return taskDate.toLocaleDateString('en-US', options); // "Mon 25" en anglais
  };

  // Retourne les 7 derniers jours incluant aujourd'hui
  const getWeekDates = () => {
    const weekDates: string[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      weekDates.unshift(day.toISOString().slice(0, 10)); 
    }

    return weekDates;
  };

  useEffect(() => {
    const weekDates = getWeekDates();

    const calculateStats = () => {
      const stats = weekDates.map((day) => {
        const pendingStats = pendingTasks.filter((task) => day === task.dueDate.slice(0, 10)).length;
        const progressStats = progressTasks.filter((task) => day === task.dueDate.slice(0, 10)).length;
        const completedStats = completedTasks.filter((task) => day === task.dueDate.slice(0, 10)).length;

        return {
          day: formatDayLabel(day),
          pending: pendingStats,
          completed: completedStats,
          progress: progressStats,
        };
      });

      setChartData(stats);
    };

    calculateStats();
  }, [pendingTasks, progressTasks, completedTasks]);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <XAxis dataKey="day" />
        <Tooltip contentStyle={{ backgroundColor: '#fff', fontSize: '12px' }} cursor={{ fill: '#f0f0f0' }} />
        <Legend />
        <Bar dataKey="pending" fill="#e07a5f" barSize={30} radius={[10, 10, 0, 0]} legendType="circle" />
        <Bar dataKey="progress" fill="#f6bd60" barSize={30} radius={[10, 10, 0, 0]} legendType="circle" />
        <Bar dataKey="completed" fill="#81b29a" barSize={30} radius={[10, 10, 0, 0]} legendType="circle" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TaskStatsChart;
