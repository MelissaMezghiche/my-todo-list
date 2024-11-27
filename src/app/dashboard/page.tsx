'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { ThemeProvider } from '@mui/material/styles';
import LineChart from '../../components/LineChart';
import styles from '/styles/dashboard.module.css';
import theme from '../../../styles/theme';
import { useFetchTasks } from '../../hooks/useFetchTasks';




export default function Dashboard() {

  
  const { tasks, pendingTasks, progressTasks, completedTasks, todaysTasks, categories } = useFetchTasks(); // hooks directory




  return (
    <ThemeProvider theme={theme}>
      <main className={styles.dashbody}>
        <div className={styles.dashright}>
          <div className={styles.dashchart}>
            <h2>Dashboard</h2>
            <LineChart />
          </div>

          <h2 className={styles.taskshead}>Categories</h2>
          <div className={styles.dashcategory}>
      
            {categories.map(category => (
              <div className={styles.dashwork} key={category.id}>
                <h4>{category.name}</h4>
              </div>
            ))}
            
          </div>

          <h2 className={styles.taskshead}>Today's Tasks</h2>
          <div className={styles.todaystasks}>
            {todaysTasks.length > 0 ? (
              todaysTasks.map(task => (
                <div key={task.id} className={styles.task}>
                  <h3>{task.title}</h3>
                  <p className={styles.catname}> {task.category.name}</p>
                  <p className={styles.priolevel}> {task.priority.level}</p>
                  <p className={styles.duedate}>
                  {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <p>No pending tasks for today.</p>
            )}
          </div>
        </div>

        <div className={styles.dashleft}>
          <div className={styles.calendarside}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>


          <div className={styles.upcomingside}>
            <p className={styles.leftTitles}>À VENIR</p>
            <div className={styles.scrollable}>
              {pendingTasks.length > 0 ? (
                pendingTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div>{task.title}</div>
                  </div>
                ))
              ) : (
                <p>No pending tasks.</p>
              )}
            </div>
          </div>

          <div className={styles.upcomingside}>
            <p className={styles.leftTitles}>EN COURS</p>
            <div className={styles.scrollable}>
              {progressTasks.length > 0 ? (
                  progressTasks.map(task => (
                    <div key={task.id} className={styles.sidetasks}>
                      <div>{task.title}</div>
                    </div>
                  ))
                ) : (
                <p>No in-progress tasks.</p>
              )}
            </div>
          </div>

         

          <div className={styles.upcomingside}>
            <p className={styles.leftTitles}>EFFECTUEES</p>
            <div className={styles.scrollable}>
             {completedTasks.length > 0 ? (
                completedTasks.map(task => (
                  <div key={task.id} className={styles.sidetasks}>
                    <div>{task.title}</div>
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
