'use client';
import './calendarpage.css';
import { useState, useEffect } from 'react';
import MyCalendar from '../../components/FullCalendarWithViews';
import TaskCard from '../../components/TaskCard';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<any[]>([]);
  const [allTasks, setAllTasks] = useState<any[]>([]); // To store all tasks

  // Fetch all tasks when the component mounts
  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const response = await fetch('/api/tasks'); // Fetch all tasks
        const tasks = await response.json();
        setAllTasks(tasks);
      } catch (error) {
        console.error('Error fetching all tasks:', error);
      }
    };

    fetchAllTasks();
  }, []);

  // Handle the date selection from MyCalendar
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // Filter tasks for the selected date
  useEffect(() => {
    if (selectedDate) {
      const filteredTasks = allTasks.filter((task) => {
        const taskDueDate = new Date(task.dueDate).toISOString().split('T')[0];
        const selectedDateISO = new Date(selectedDate).toISOString().split('T')[0];
        return taskDueDate === selectedDateISO;
      });
      setTasksForSelectedDate(filteredTasks);
    }
  }, [selectedDate, allTasks]);

  // Handle task status change
  const handleTaskStatusChange = (updatedTask: any) => {
    setTasksForSelectedDate((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, status: updatedTask.status } : task
      )
    );
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString(undefined, options); // e.g., "Monday, December 1, 2024"
  };

  return (
    <div className="main-content">
      <div className="bigCalendar">
        <MyCalendar onDateSelect={handleDateSelect} />
      </div>
      <div className="Day">
         <h2>{selectedDate ? formatDate(selectedDate) : 'Select a Date'}</h2> {/* Display the formatted selected date */}
         <TaskCard tasks={tasksForSelectedDate} onTaskStatusChange={handleTaskStatusChange} />
      </div>
    </div>
  );
}
