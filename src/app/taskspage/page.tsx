//app/taskspage/page.tsx

'use client'; 
import { useState, useEffect } from 'react'; 
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import styles from '/styles/tasks.module.css';
import { IoCloseSharp } from "react-icons/io5";

interface Task { 
  id: number; 
  title: string; 
  description?: string; 
  status: string; 
  startDate: string; 
  dueDate: string; 
  completedDate?: string; 
  category: string; 
  priority: string; 
  categoryId?: number;
  priorityId?: number;
  userId: number;
}

interface Category {
  id: number;
  name: string;
}

interface Priority {
  id: number;
  level: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModeActive, setIsDeleteModeActive] = useState<boolean>(false);
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);


  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    categoryId: '',
    priorityId: '',
  });

  useEffect(() => { 
    const fetchTasks = async () => { 
      try { 
        const response = await fetch('/api/add-tasks'); 
        if (!response.ok) { 
          throw new Error('Failed to fetch tasks.'); 
        } 
        const data = await response.json();

        setTasks(data); 
        setLoading(false); 
      } catch (err: any) { 
        setError(err.message); 
        setLoading(false); 
      } 
    }; 

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories.');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    const fetchPriorities = async () => {
      try {
        const response = await fetch('/api/priorities');
        if (!response.ok) {
          throw new Error('Failed to fetch priorities.');
        }
        const data = await response.json();
        setPriorities(data);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchTasks(); 
    fetchCategories();
    fetchPriorities();
  }, []);

  const handleAddTask = async () => {
    try {
        // Ensure all required fields are included
        const formattedTask = {
            title: newTask.title,
            description: newTask.description || '',
            categoryId: parseInt(newTask.categoryId),
            priorityId: parseInt(newTask.priorityId),
            startDate: newTask.startDate || new Date().toISOString(), // Add start date
            dueDate: newTask.dueDate,
        };

        // Validate required fields before sending
        if (!formattedTask.title || !formattedTask.categoryId || 
            !formattedTask.priorityId || !formattedTask.dueDate) {
            setError('Please fill in all required fields');
            return;
        }

        const response = await fetch('/api/add-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedTask),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add task');
        }

        if (response.ok) {
          setNotification(currentTask ? 'Task updated successfully' : 'Task added successfully');
          setNewTask({ title: '', description: '', startDate: '', dueDate: '', categoryId: '', priorityId: '' });
        }
        setTimeout(() => setNotification(''), 5000);
        
        const createdTask = await response.json();
        setTasks((prevTasks) => [...prevTasks, {
            ...createdTask,
            category: categories.find(c => c.id === createdTask.categoryId)?.name || 'Unknown',
            priority: priorities.find(p => p.id === createdTask.priorityId)?.level || 'Unknown'
        }]);
        
        setIsModalOpen(false);
        setNewTask({
            title: '',
            description: '',
            startDate: '',
            dueDate: '',
            categoryId: '',
            priorityId: '',
        });
        setError(null);
    } catch (err: any) {
        setNotification('Error adding task. Please try again.');
        console.error(err.message);
        setError(err.message);
    }
};

  // PUT WAS THERE

  const handleEditTask = async () => {
    try {
      if (!currentTask) return;
  
      // Validate required fields
      if (!currentTask.title || !currentTask.categoryId || 
          !currentTask.priorityId || !currentTask.dueDate) {
        setError('Please fill in all required fields');
        return;
      }
  
      const formattedTask = {
        id: currentTask.id,
        title: currentTask.title,
        description: currentTask.description || '',
        categoryId: Number(currentTask.categoryId),
        priorityId: Number(currentTask.priorityId),
        startDate: currentTask.startDate || new Date().toISOString(),
        dueDate: currentTask.dueDate,
      };
  
      const response = await fetch('/api/add-tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedTask),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
      }
  
      const updatedTask = await response.json();
  
      // MAJ de la liste des taches avec les changelemts
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task.id === updatedTask.id 
            ? {
                ...updatedTask,
                category: categories.find(c => c.id === updatedTask.categoryId)?.name || 'Unknown',
                priority: priorities.find(p => p.id === updatedTask.priorityId)?.level || 'Unknown'
              } 
            : task
        )
      );
      
      setIsModalOpen(false);
      setCurrentTask(null);
      setError(null);
    } catch (err: any) {
      console.error(err.message);
      setError(err.message);
    }
  };


  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/add-tasks?id=${taskToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task.');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      setIsDeleteConfirmOpen(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const openDeleteConfirm = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setTaskToDelete(null);
    setIsDeleteConfirmOpen(false);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks
  .filter((task) => {
    return (
      (selectedCategory === 'All' || task.category === selectedCategory) &&
      (selectedPriority === 'All' || task.priority === selectedPriority)
    );
  })
  .sort((a, b) => b.id - a.id);


  const formatDate = (datetime: string | null) => {
    if (!datetime) return '';
    return new Date(datetime).toISOString().split('T')[0];
  };


  const formatTime = (datetime: string | null) => {
    if (!datetime) return '';
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  const handleDateChange = (date: string, setTask: Function, task: any, key: string) => {
    const currentDate = new Date(task[key] || new Date());
    const [year, month, day] = date.split('-');
    currentDate.setFullYear(Number(year), Number(month) - 1, Number(day));
  
    setTask({ ...task, [key]: currentDate.toISOString() });
  };
  
  const handleTimeChange = (time: string, setTask: Function, task: any, key: string) => {
    const currentDate = new Date(task[key] || new Date());
    const [hours, minutes] = time.split(':');
    
    currentDate.setHours(Number(hours), Number(minutes), 0, 0);
  
    setTask({ ...task, [key]: currentDate.toISOString() });
  };
  
  return (
    <div className={styles.tasksContainer}>
      {notification && (
        <div className={styles.notification}>
          <span>{notification}</span>
          <IoCloseSharp
            className={styles.close_notif}
            onClick={() => setNotification(null)} // Close notification on button click
          />
        </div>
      )}
      <aside className={styles.floatingBar}>
        <button className={styles.addButton} onClick={() => {
          setCurrentTask(null);
          setIsModalOpen(true);
        }}>
          <FaPlus />
        </button>
        <button 
          className={styles.editButton} 
          onClick={() => setIsEditModeActive(!isEditModeActive)}
        >
          <FaEdit />
        </button>
        <button 
          className={styles.deleteButton} 
          onClick={() => setIsDeleteModeActive(!isDeleteModeActive)}
        >
          <FaTrash />
        </button>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.filterButtons}>
          <select 
            className={styles.filterSelect}
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select 
            className={styles.filterSelect}
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="All">All priorities</option>
            {priorities.map((priority) => (
              <option key={priority.id} value={priority.level}>
                {priority.level}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.taskList}>
          {loading ? (
            <p>Tasks loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.title_editbutton}>
                  <h3>{task.title}</h3>
                  {isEditModeActive && (
                    <div className={styles.editTaskButtonContainer}>
                      <button 
                        className={styles.editTaskButton}
                        onClick={() => openEditModal(task)}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </div>
                <p><span>Description :</span>  {task.description}</p>
                <p><span>Category :</span>  {task.category}</p>
                <p><span>Priority :</span>  {task.priority}</p> 
                <p><span>Status :</span> {task.status}</p>               
                <p><span>Due date :</span>  {new Date(task.dueDate).toLocaleDateString()}</p>
               
                {isDeleteModeActive && (
                  <div className={styles.deleteTaskButtonContainer}>
                    <button 
                      className={styles.deleteTaskButton}
                      onClick={() => openDeleteConfirm(task)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Tasks */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHeader}>
              <h2>{currentTask ? 'Edit Task' : 'Add New Task'}</h2>
            </header>
            <form className={styles.modalForm}>
            <h5>
                ADD YOUR TITLE
              </h5>
              <input
                className={styles.titleInput}
                type="text"
                placeholder="Title"
                value={currentTask ? currentTask.title : newTask.title}
                onChange={(e) => 
                  currentTask
                    ? setCurrentTask({...currentTask, title: e.target.value})
                    : setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
              <h5>
                ADD A DESCRIPTION
              </h5>
              <textarea
                placeholder="Description"
                value={currentTask ? currentTask.description : newTask.description}
                onChange={(e) => 
                  currentTask
                    ? setCurrentTask({...currentTask, description: e.target.value})
                    : setNewTask({ ...newTask, description: e.target.value })
                }
              />
              <div className={styles.dateGroup}>
                <div className={styles.datesubGroup}>
                  <h5>START DATE</h5>
                  <input
                    type="date"
                    value={formatDate(currentTask ? currentTask.startDate : newTask.startDate)}
                    onChange={(e) =>
                      currentTask
                        ? handleDateChange(e.target.value, setCurrentTask, currentTask, 'startDate')
                        : handleDateChange(e.target.value, setNewTask, newTask, 'startDate')
                    }
                  />
                </div>
                <div className={styles.datesubGroup}>
                  <h5>DUE DATE</h5>
                  <input
                    type="date"
                    value={formatDate(currentTask ? currentTask.dueDate : newTask.dueDate)}
                    onChange={(e) =>
                      currentTask
                        ? handleDateChange(e.target.value, setCurrentTask, currentTask, 'dueDate')
                        : handleDateChange(e.target.value, setNewTask, newTask, 'dueDate')
                    }
                  />
                </div>
              </div>
              <div className={styles.dateGroup}>
                <div className={styles.datesubGroup}>
                  <h5>START TIME</h5>
                  <input
                    type="time"
                    value={formatTime(currentTask ? currentTask.startDate : newTask.startDate)}
                    onChange={(e) =>
                      handleTimeChange(
                        e.target.value,
                        currentTask ? setCurrentTask : setNewTask,
                        currentTask ? currentTask : newTask,
                        'startDate'
                      )
                    }
                  />
                </div>
                <div className={styles.datesubGroup}>
                  <h5>DUE TIME</h5>
                  <input
                    type="time"
                    value={formatTime(currentTask ? currentTask.dueDate : newTask.dueDate)}
                    onChange={(e) =>
                      handleTimeChange(
                        e.target.value,
                        currentTask ? setCurrentTask : setNewTask,
                        currentTask ? currentTask : newTask,
                        'dueDate'
                      )
                    }
                  />
                </div>
              </div>

              <div className={styles.selectGroup}>
                <div className={styles.selectsubGroup}>
                  <h5>
                    CATEGORY
                  </h5>
                  <select
                    value={currentTask ? currentTask.categoryId : newTask.categoryId}
                    onChange={(e) => 
                      currentTask
                        ? setCurrentTask({...currentTask, categoryId: Number(e.target.value)})
                        : setNewTask({ ...newTask, categoryId: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.selectsubGroup}>
                  <h5 >
                    PRIORITY
                  </h5>
                  <select
                    value={currentTask ? currentTask.priorityId : newTask.priorityId}
                    onChange={(e) => 
                      currentTask
                        ? setCurrentTask({...currentTask, priorityId: Number(e.target.value)})
                        : setNewTask({ ...newTask, priorityId: e.target.value })
                    }
                  >
                    <option value="">Select Priority</option>
                    {priorities.map((priority) => (
                      <option key={priority.id} value={priority.id}>
                        {priority.level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={currentTask ? handleEditTask : handleAddTask}
                  disabled={
                    currentTask 
                      ? false 
                      : (!newTask.title || !newTask.categoryId || !newTask.priorityId || !newTask.dueDate)
                  }
                >
                  {currentTask ? 'Update Task' : 'Add Task'}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentTask(null);
                  }}
                >
                  Cancel
                </button>
              </div>
              {error && <p className={styles.errorMessage}>{error}</p>}
            </form>
          </div>
        </div>
      )}
       {/* Custom Delete Confirmation Modal */}
       {isDeleteConfirmOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteConfirm}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <header className={styles.modalHeader2}>
              <h2>Delete Task ?</h2>
            </header>
            <p className={styles.confirmation_question}>
              Are you sure you want to delete the task "{taskToDelete?.title}"?
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.primaryButton}
                onClick={handleDeleteTask}
              >
                Delete
              </button>
              <button
                className={styles.secondaryButton}
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default TasksPage;