'use client';
import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import './FullCalendarWithViews.css';

interface MyCalendarProps {
  onDateSelect: (date: string) => void; // Callback function passed from the parent
}

const MyCalendar: React.FC<MyCalendarProps> = ({ onDateSelect }) => {
  const calendarRef = useRef<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasks = await response.json();
        const formattedEvents = tasks.map((task: any) => ({
          id: task.id,
          title: task.title,
          start: task.dueDate,
          end: task.dueDate,
          color: task.priority.color,
          extendedProps: {
            description: task.description,
            status: task.status,
            category: task.category.name,
          },
        }));
        setEvents(formattedEvents);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to load tasks.");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Update calendar size on window resize
  useEffect(() => {
    const handleResize = () => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.updateSize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleViewChange = (view: string) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  };

  const handleDateClick = (info: any) => {
    onDateSelect(info.dateStr);
  };

  return (
    <div>
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
