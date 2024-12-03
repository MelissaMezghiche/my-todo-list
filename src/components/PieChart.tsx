'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import style from './PieChart.module.css';

const PieChart = () => {
  // Données pour le graphique
  

  const data = {
    labels: ['Accomplies', 'En cours', 'Échues', 'À venir'],
    datasets: [
      {
        data: [7, 5, 3, 2], // Nombre de tâches
        backgroundColor: ['#f4c724', '#437A6F', '#e63946', '#f1e0b0'], // Couleurs
        hoverBackgroundColor: ['#f5d94c', '#5a9983', '#f16465', '#f7e5bf'], // Couleurs au survol
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
        display: false, // Masquer la légende intégrée
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div className={style.container}>
      <Doughnut data={data} options={options}/>
      {/* Centre du graphique */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          fontSize: '16px',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '40px', marginTop:'25px' }}>17</div>
        <div style={{ fontSize: '14px', color: '#666' }}>Tâches totales</div>
      </div>

      {/* Légende */}
      <div className={style.legend}>
          <div className={style.item}> <div className={style.accomplies}></div>Accomplies</div>
         
          <div className={style.item}> <div className={style.encours}></div>En cours</div>
         
          <div className={style.item}><div className={style.echues}> </div>Échues</div>
 
          <div className={style.item}><div className={style.avenir}></div>À venir</div>
    </div>
    </div>
  );
};

export default PieChart;
