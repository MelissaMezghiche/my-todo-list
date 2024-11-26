import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
  // Données vides par défaut
  const data = {
    labels: [], // Aucune étiquette par défaut
    datasets: [
      {
        label: 'Work',
        data: [], // Pas de données pour le moment
        borderColor: '#437A6F',
        backgroundColor: '#437A6F',
        tension: 0.3,
      },
      {
        label: 'Personal',
        data: [], // Pas de données pour le moment
        borderColor: '#dcb233',
        backgroundColor: '#dcb233',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
          color: '#ebebebb0', // Couleur des lignes du grid
          lineWidth: 0.5, // Épaisseur des lignes
        },
      },
    },
  };

  return <Line data={data} options={options}  height={60} />;
};

export default LineChart;
