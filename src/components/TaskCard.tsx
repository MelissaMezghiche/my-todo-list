import './TaskCard.css';

interface Task {
  id: string;
  title: string;
  description: string;
  category: { name: string , color: string};
  status: string;
  priority: { color: string };
  startDate: string; // ISO string format (DateTime from Prisma)
}

interface TaskCardProps {
  tasks: Task[];
  onTaskStatusChange: (updatedTask: Task) => void; // Callback for status change
}

const TaskCard: React.FC<TaskCardProps> = ({ tasks, onTaskStatusChange }) => {

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

    } catch (error) {
      
      console.error('Error updating task status:', error);
    
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="task-card">
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li className='Task-info' key={task.id} style={{ borderLeft: `5px solid ${task.priority.color}` }} >
              <div className='check-task-name'>
                <input
                  type="checkbox"
                  checked={task.status === "completed"}// Check if the status is "completed"
                  onChange={() => handleStatusChange(task.id, task.status)}
                  id={`task-${task.id}`}
                />
                <label htmlFor={`task-${task.id}`}></label>  {/* Custom label for the checkbox */}
                <h3>{task.title}</h3>
              </div>
              <div className='cat-time'>
                <p className='cat' style={{ color: `${task.category.color}`}}>{task.category.name}</p>
                <p className='time'>{formatTime(task.startDate)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for this date.</p>
      )}
    </div>
  );
};

export default TaskCard;
