'use client'
import { useState,useEffect } from 'react';
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

// Déclaration du plugin avant de l'enregistrer
const shadowPlugin = {
    id: 'shadowPlugin',
    beforeDatasetDraw(chart, args, options) {
      const ctx = chart.ctx;
      const datasetMeta = chart.getDatasetMeta(args.index);
      if (!datasetMeta || datasetMeta.hidden) return; // vérification
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
  const [filter, setFilter] = useState<'week' | 'year'>('week'); // État du filtre
  const [datasets, setDatasets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tasks/stats/LineChart?filter=${filter}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        // Mettre à jour les données et les labels
        setDatasets(data.datasets);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDatasets([]);
      }
    };
  
    fetchData();
  }, [filter]);

  const data = {
    labels:
      filter === 'year'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      shadowPlugin: {
        shadowColor: 'rgba(52, 112, 100, 0.5)',
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
          <Line data={data} options={options} />
        </div>
        <div className={style.buttondiv}>
          <button
            className={filter === 'week' ? style.selectedButton : style.button}
            onClick={() => setFilter('week')}
          >
            Semaine
          </button>
          <button
            className={filter === 'year' ? style.selectedButton : style.button}
            onClick={() => setFilter('year')}
          >
            Année
          </button>
        </div>
      </div>
    </div>
  );
};

export default LineChartWithFilters;
