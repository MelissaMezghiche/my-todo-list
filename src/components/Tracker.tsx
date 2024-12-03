'use client';

import styles from './Tracker.module.css';

const ProductivityTracker = () => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['6h–8h', '8h–12h', '12h–14h', '14h–18h', '18h–22h', '22h–2h', '2h–6h'];

  const productivityData = [
    ['none', 'high', 'medium', 'low', 'high',  'none', 'none'], // Dimanche
    ['low', 'medium', 'high', 'medium', 'low', 'none', 'none'], // Lundi
    ['medium', 'low', 'high', 'low', 'medium',  'none', 'none'], // Mardi
    ['low', 'medium', 'high', 'medium', 'low',  'none', 'none'], // Mercredi
    ['medium', 'low', 'low', 'high', 'medium', 'low', 'none'], // Jeudi
    ['low', 'high', 'medium', 'low', 'medium', 'low', 'none'], // Vendredi
    ['none', 'medium', 'high', 'low', 'medium', 'low', 'none'], // Samedi
  ];

  // Le JSX doit être directement retourné par la fonction si aucune logique additionnelle n'est nécessaire.
  return (
    <div className={styles.container}>
  <div className={styles.legend}>
    <span className={styles.high}>Moment le plus productif</span>
    <span className={styles.medium}>Moment moyennement productif</span>
    <span className={styles.low}>Moment peu productif</span>
  </div>
  <table className={styles.table}>
    <thead>
      <tr className={styles.tableRow}>
        <th className={styles.tableHeader}></th>
        {timeSlots.map((slot) => (
          <th key={slot} className={styles.tableHeader}>
            {slot}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {days.map((day, i) => (
        <tr key={day} className={styles.tableRow}>
          <td className={styles.day}>{day}</td>
          {productivityData[i].map((level, index) => (
            <td key={index} className={`${styles.tableCell} ${styles[level]}`}></td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
};

export default ProductivityTracker;
