'use client';

import { useEffect, useState } from 'react';
import styles from './Tracker.module.css';

const ProductivityTracker = () => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const timeSlots = ['6h–8h', '8h–12h', '12h–14h', '14h–18h', '18h–22h', '22h–2h', '2h–6h'];

  const [productivityData, setProductivityData] = useState(() =>
    days.reduce((acc, day) => ({ ...acc, [day]: Array(7).fill('none') }), {})
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks/stats/tracker');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        setProductivityData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load productivity data.');
      }
    };

    fetchData();
  }, []);

  if (error) return <div className={styles.error}>{error}</div>;

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
          {days.map((day) => (
            <tr key={day} className={styles.tableRow}>
              <td className={styles.day}>{day}</td>
              {timeSlots.map((_, index) => (
                <td
                  key={index}
                  className={`${styles.tableCell} ${styles[productivityData[day]?.[index] || 'none']}`}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductivityTracker;
