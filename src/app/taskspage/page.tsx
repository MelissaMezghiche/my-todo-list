'use client'; 
import { useState, useEffect } from 'react'; 
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 
import styles from '/styles/tasks.module.css';

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
        const response = await fetch('/api/tasks'); 
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
            description: newTask.description || '', // Make description optional
            categoryId: parseInt(newTask.categoryId),
            priorityId: parseInt(newTask.priorityId),
            startDate: newTask.startDate || new Date().toISOString(), // Add start date
            dueDate: newTask.dueDate,
            userId: 1, // Hardcoded for now, you might want to get this dynamically later
            status: 'Pending' // Add a default status if not provided
        };

        // Validate required fields before sending
        if (!formattedTask.title || !formattedTask.categoryId || 
            !formattedTask.priorityId || !formattedTask.dueDate) {
            setError('Please fill in all required fields');
            return;
        }

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formattedTask),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add task');
        }

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
        console.error(err.message);
        setError(err.message);
    }
};

  const handleEditTask = async () => {
    if (!currentTask) return;

    try {
      const response = await fetch(`/api/tasks/${currentTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentTask.id,
          title: currentTask.title,
          description: currentTask.description,
          startDate: currentTask.startDate,
          dueDate: currentTask.dueDate,
          categoryId: currentTask.categoryId,
          priorityId: currentTask.priorityId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to edit task.');
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) => 
        prevTasks.map(task => 
          task.id === currentTask.id 
            ? {
                ...updatedTask,
                category: categories.find(c => c.id === Number(updatedTask.categoryId))?.name || 'Unknown',
                priority: priorities.find(p => p.id === Number(updatedTask.priorityId))?.level || 'Unknown',
              }
            : task
        )
      );
      setIsModalOpen(false);
      setCurrentTask(null);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task.');
      }

      setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (selectedCategory === 'All' || task.category === selectedCategory) &&
      (selectedPriority === 'All' || task.priority === selectedPriority)
    );
  });

  return (
    <div className={styles.tasksContainer}>
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
                <h3>{task.title}</h3>
                <p>Category: {task.category}</p>
                <p>Priority: {task.priority}</p>
                <p>DueDate: {task.dueDate}</p>
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
                {isDeleteModeActive && (
                  <div className={styles.deleteTaskButtonContainer}>
                    <button 
                      className={styles.deleteTaskButton}
                      onClick={() => handleDeleteTask(task.id)}
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
              <h3>{currentTask ? 'Edit Task' : 'Add New Task'}</h3>
            </header>
            <form className={styles.modalForm}>
            <h5 style={{ color: ' #437A6F', fontWeight: 'bold', marginBottom: '10px' }}>
                ADD YOUR TITLE
              </h5>
              <input
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
              <h5 style={{ color: ' #437A6F', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>
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
              <h5 style={{ color: '# #437A6F', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>
                START DATE & DUE DATE
              </h5>
              <div className={styles.dateGroup}>
                <input
                  type="date"
                  value={currentTask ? currentTask.startDate : newTask.startDate}
                  onChange={(e) => 
                    currentTask
                      ? setCurrentTask({...currentTask, startDate: e.target.value})
                      : setNewTask({ ...newTask, startDate: e.target.value })
                  }
                />
                <input
                  type="date"
                  value={currentTask ? currentTask.dueDate : newTask.dueDate}
                  onChange={(e) => 
                    currentTask
                      ? setCurrentTask({...currentTask, dueDate: e.target.value})
                      : setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <h5 style={{ color: ' #437A6F', fontWeight: 'bold', marginTop: '15px', marginBottom: '10px' }}>
                CATEGORY & PRIORITY
              </h5>
              <div className={styles.selectGroup}>
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
    </div>
  );
};

export default TasksPage;