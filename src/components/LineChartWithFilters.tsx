'use client';

import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import style from './LineChartWithFilters.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartOptions } from 'chart.js';

// Déclarez le plugin avant de l'enregistrer
const shadowPlugin = {
  id: 'shadowPlugin',
  beforeDatasetDraw(chart, args, options) {
    const ctx = chart.ctx;
    const datasetMeta = chart.getDatasetMeta(args.index);
    if (!datasetMeta || datasetMeta.hidden) return; // Ajoutez cette vérification
    ctx.save();
    ctx.shadowColor = options.shadowColor || 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = options.shadowBlur || 10;
    ctx.shadowOffsetX = options.shadowOffsetX || 5;
    ctx.shadowOffsetY = options.shadowOffsetY || 5;
  },
  afterDatasetDraw(chart) {
    chart.ctx.restore();
  },
};

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, shadowPlugin);


const LineChartWithFilters = () => {
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('week'); // État du filtre

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
    labels:
      filter === 'year'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tâches accomplies',
        data: getData(),
        borderColor: '#347064',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Tâches en cours',
        data: getData().map((item) => item * 0.5),
        borderColor: '#ABCDBB',
        backgroundColor: 'rgba(0, 112, 243, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  const options: ChartOptions<'line'> & {
    plugins: {
      shadowPlugin: {
        shadowColor: string;
        shadowBlur: number;
        shadowOffsetX: number;
        shadowOffsetY: number;
      };
    };
  } = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      shadowPlugin: {
        shadowColor: 'rgba(52, 112, 100, 0.5)', // Couleur de l'ombre
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
      },
    },
  };

  return (
    <div className={style.container}>
      <div className="container w-100 h-50 mt-4">
        <div className={style.chartcontainer}>
          <Line data={data} options={options}/>
        </div>

        {/* Boutons pour sélectionner le filtre */}
        <div className={style.buttondiv}>
          <button
            className={filter === 'week' ? style.selectedButton : style.button}
            onClick={() => setFilter('week')}
          >
            Week
          </button>
          <button
            className={filter === 'month' ? style.selectedButton : style.button}
            onClick={() => setFilter('month')}
          >
            Month
          </button>
          <button
            className={filter === 'year' ? style.selectedButton : style.button}
            onClick={() => setFilter('year')}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineChartWithFilters;