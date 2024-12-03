import './TaskCard.css';
import { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

interface Task {
  id: string;
  title: string;
  description: string;
  category: { name: string , color: string};
  status: string;
  priority: { color: string };
  dueDate: string; // ISO string format (DateTime from Prisma)
}

interface TaskCardProps {
  tasks: Task[];
  onTaskStatusChange: (updatedTask: Task) => void; // Callback for status change
}

const TaskCard: React.FC<TaskCardProps> = ({ tasks, onTaskStatusChange }) => {

  const [notif_completed, setNotif_completed] = useState<string | null>(null); // Notification state

  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    
    try {
      // Toggle the status between "pending" and "completed"
      const newStatus = currentStatus === "pending" ? "completed" : "pending";

      const response = await fetch('/api/update-task-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus }), 
      });

      if (!response.ok) { 
        const error = await response.json();
        console.error("Update failed:", error);
        return;
      }

      const updatedTask = await response.json();
      console.log("Task updated successfully:", updatedTask);

      // Notify the parent of the updated task
      onTaskStatusChange({ ...updatedTask, status: newStatus });


       // Show notification
       if (newStatus === "completed") {
        setNotif_completed("Task completed"); // Set notification message
        setTimeout(() => setNotif_completed(null), 5000); // Hide notification after 3 seconds
      }


    } catch (error) {
      
      console.error('Error updating task status:', error);
    
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
  
    // Extract UTC hours and minutes
    const hours = d.getUTCHours().toString().padStart(2, '0');
    const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`; // Return the time in UTC
  };
  

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  return (
    <div className="task-card">
      {/* Notification Section */}
      {notif_completed && (
        <div className="notification_completed">
          <span>{notif_completed}</span>
          <IoCloseSharp
            className='close-notif'
            onClick={() => setNotif_completed(null)} // Close notification on button click
          />
        </div>
      )}
      {tasks.length > 0 ? (
        <ul>
          {sortedTasks.map((task) => (
            <li className='Task-info' key={task.id} style={{ borderLeft: `5px solid ${task.priority.color}` }} >
              <div className='check-task-name'>
                <input
                  type="checkbox"
                  checked={task.status === "completed"}// Check if the status is "completed"
                  onChange={() => handleStatusChange(task.id, task.status)}
                  id={`task-${task.id}`}
                />
                <label htmlFor={`task-${task.id}`}></label>  {/* Custom label for the checkbox */}
                <p className='task-title'>{task.title}</p>
              </div>
              <div className='cat-time'>
                <p className='cat' style={{ color: `${task.category.color}`}}>{task.category.name}</p>
                <p className='time'>{formatTime(task.dueDate)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className='noTasks-case'>No tasks for this date.</p>
      )}

    </div>
  );
};

export default TaskCard;
