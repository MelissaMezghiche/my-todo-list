'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ['Completed', 'In Progress', 'Upcoming'],
    datasets: [
      {
        label: 'Task Status',
        data: [30, 50, 20],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        hoverOffset: 4,
      },
    ],
  };

  return <Pie data={data} />;
};
{/* trying somethingg !!!!!*/}
export default PieChart;
