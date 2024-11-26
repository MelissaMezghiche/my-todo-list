'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartWithFilters = () => {
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('week');

  // Données dynamiques basées sur le filtre
  const getData = () => {
    switch (filter) {
      case 'month':
        return [5, 9, 8, 7, 4, 6, 3, 2, 10, 11, 6, 7];
      case 'year':
        return [20, 30, 50, 40, 60, 70, 80, 100, 110, 95, 85, 120];
      default:
        return [2, 6, 8, 5, 7, 10, 9];
    }
  };

  const data = {
    labels: filter === 'year' ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: getData(),
        borderColor: '#0070f3',
        backgroundColor: '#0070f3',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <button onClick={() => setFilter('week')}>Week</button>
        <button onClick={() => setFilter('month')}>Month</button>
        <button onClick={() => setFilter('year')}>Year</button>
      </div>
      <Line data={data} />
    </div>
  );
};

export default LineChartWithFilters;
