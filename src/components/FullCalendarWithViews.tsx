'use client';
import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import './FullCalendarWithViews.css';

interface MyCalendarProps {
  onDateSelect: (date: string) => void;  // Callback function passed from the parent
}

const MyCalendar: React.FC<MyCalendarProps> = ({ onDateSelect }) => {
  const calendarRef = useRef<any>(null);
  const [events, setEvents] = useState<any[]>([]);  // Type the state as array of events
  const [loading, setLoading] = useState<boolean>(true);  // For loading state
  const [error, setError] = useState<string | null>(null);  // For error handling

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch("/api/tasks");
        
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const tasks = await response.json();
        const formattedEvents = tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          start: task.dueDate, // only changed this in this page from startDate to dueDate
          end: task.dueDate,
          color: task.priority.color,
          extendedProps: {
            description: task.description,
            status: task.status,
            category: task.category.name,
          },
        }));

        setEvents(formattedEvents);
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks."); // Set error message
        setLoading(false); // Stop loading
      }
    };

    fetchTasks();
  }, []); // Empty dependency array to only run once on mount

  const handleViewChange = (view: string) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  const handleDateClick = (info: any) => {
    onDateSelect(info.dateStr);  // Pass the selected date (ISO string)
  };


  return (
    <div>
      {/* Display loading or error message */}
      {loading && <div className="loader"></div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "customButton1,customButton2,customButton3",
        }}
        customButtons={{
          customButton1: {
            text: "Month",
            click: () => handleViewChange("dayGridMonth"),
          },
          customButton2: {
            text: "Week",
            click: () => handleViewChange("timeGridWeek"),
          },
          customButton3: {
            text: "Day",
            click: () => handleViewChange("timeGridDay"),
          },
        }}
        height="auto"
        contentHeight="auto"
        fixedWeekCount={false}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default MyCalendar;
