'use client';

import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider } from '@mui/material/styles';
import LineChart from '../../components/LineChart';
import styles from '/styles/dashboard.module.css';
import theme from '../../../styles/theme';
import { useFetchTasks } from '../../hooks/useFetchTasks';
import Link from 'next/link';
import './dashcalendar.css';

export default function Dashboard() {
  const { tasks, pendingTasks, progressTasks, completedTasks, todaysTasks, categories, countTasksByCategory } = useFetchTasks();

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.dashbody}>
        <div className={styles.dashleft}>
          <div className={styles.dashchart}>
            <h2>Dashboard</h2>
            <LineChart /> {/* C'est un BarChart, j'ai pas changer le nom de la fonc*/}
          </div>

          <h2 className={styles.taskshead}>Categories</h2>
          <div className={styles.dashcategory}>
            {categories.map(category => {
              const { pendingCount, progressCount, completedCount } = countTasksByCategory(category.id);
              return (
                <div className={styles.dashwork} key={category.id}>
                  <Link href={`/calendar`} className={styles.categoryLink}>
                    {category.name}
                  </Link>
                  <div className={styles.categorystats}>
                    <div className={styles.nbrstats}>
                      <p>Pending</p> 
                      <p className={styles.count}>{`${pendingCount}`}</p>
                      </div>
                    <div  className={styles.nbrstats}>
                      <p>Progress</p>
                      <p className={styles.count}>{`${progressCount}`}</p>
                    </div>
                    <div className={styles.nbrstats}>
                      <p>Completed</p>
                      <p className={styles.count}>{`${completedCount}`}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className={styles.taskshead}>Today's Tasks</h2>
          <div className={styles.todaystasks}>
            {todaysTasks.length > 0 ? (
              <table className={styles.tasksTable}>
                <tbody>
                  {todaysTasks.map(task => (
                    <tr key={task.id}>
                      <td className={styles.tasktitle}>{task.title}</td>
                      <td className={styles.duedate}>
                        {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td  className={styles.catname}>{task.category.name}</td>
                      <td>
                        <p 
                          className={styles.priolevel}  
                          style={{ 
                            backgroundColor: task.priority.color, 
                            borderRadius: '8px',
                            paddingInline: '5px',
                          }}
                        >
                          {task.priority.level}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pending tasks for today.</p>
            )}
          </div> 

        </div>

        <div className={styles.dashright}>
          <div className={styles.calendarside}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>

          <div className={styles.upcomingside}>
            <p className={styles.rightTitles}>À VENIR</p>
            <div className={styles.scrollable}>
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div className={styles.dashstatus}>
                      <p className={styles.statustitle}>{task.title}</p>
                      <p className={styles.statuscategory}>{task.category.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No pending tasks.</p>
              )}
            </div>
          </div>

          <div className={styles.upcomingside}>
            <p className={styles.rightTitles}>EN COURS</p>
            <div className={styles.scrollable}>
              {progressTasks.length > 0 ? (
                progressTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div className={styles.dashstatus}>
                      <p className={styles.statustitle}>{task.title}</p>
                      <p className={styles.statuscategory}>{task.category.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No in-progress tasks.</p>
              )}
            </div>
          </div>

          <div className={styles.upcomingside}>
            <p className={styles.rightTitles}>EFFECTUEES</p>
            <div className={styles.scrollable}>
              {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div className={styles.dashstatus}>
                      <p className={styles.statustitle}>{task.title}</p>
                      <p className={styles.statuscategory}>{task.category.name}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No completed tasks.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </ThemeProvider>
  );
}