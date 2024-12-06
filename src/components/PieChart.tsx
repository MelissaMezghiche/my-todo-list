'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
{/*import style from './PieChart.module.css';*/}



interface ChartDataItem {
  label: string;
  value: number;
  backgroundColor: string;
  hoverBackgroundColor: string;
}

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataItem[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/stats/pie');
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data: ChartDataItem[] = await response.json();
        setChartData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  const data = {
    labels: chartData.map((item) => item.label),
    datasets: [
      {
        data: chartData.map((item) => item.value),
        backgroundColor: chartData.map((item) => item.backgroundColor),
        hoverBackgroundColor: chartData.map((item) => item.hoverBackgroundColor),
        borderWidth: 0,
        cutout: '87%', // Trou au centre
        rotation: -90, // Rotation pour demi-cercle
        circumference: 180, 
        borderRadius: 10,
      },
    ],
  };

  // Options pour styliser le graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 16,
          },
          padding: 15,
          boxWidth: 20,
          color: 'var(--legend-stat)',
        },
        align: 'center',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  /*  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true, 
        position: 'bottom',
        labels: {
          boxWidth: 20, 
          padding: 10, 
        },
        
      },
      tooltip: {
        enabled: true,
      },
    },
  };*/
  const totalTasks = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{position:'relative', width: '100%', maxWidth: '400px', height: '250px', margin: 'auto' }}>
      <Doughnut data={data} options={options} />
       {/* Centre du graphique */}
       <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
        <div style={{ fontWeight: 'bold', fontSize: '40px', top:'-15px', color: 'var(--legend-stat)' }}>{totalTasks}</div>
        <div style={{ fontSize: '14px', color: 'var(--legend-stat)' }}>Tâches totales</div>
      </div>
    </div>
  );
};

export default PieChart;
