'use client';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import des icônes
import styles from '/styles/tasks.module.css';

interface Task {
  id: number;
  title: string;
  category: 'Work' | 'Personal' | 'Study';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Complete project report', category: 'Work', priority: 'High', dueDate: '2024-11-18' },
    { id: 2, title: 'Grocery shopping', category: 'Personal', priority: 'Low', dueDate: '2024-11-20' },
    { id: 3, title: 'Team meeting', category: 'Work', priority: 'Medium', dueDate: '2024-11-19' },
    { id: 4, title: 'Read a book', category: 'Study', priority: 'Low', dueDate: '2024-11-22' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');

  const filteredTasks = tasks.filter(task => {
    return (
      (selectedCategory === 'All' || task.category === selectedCategory) &&
      (selectedPriority === 'All' || task.priority === selectedPriority)
    );
  });

  return (
    <div className={styles.tasksContainer}>
      {/* Barre d'options flottante */}
      <aside className={styles.floatingBar}>
        <button className={styles.addButton}>
          <FaPlus />
        </button>
        <button className={styles.editButton}>
          <FaEdit />
        </button>
        <button className={styles.deleteButton}>
          <FaTrash />
        </button>
      </aside>

      {/* Contenu principal */}
      <div className={styles.mainContent}>
        {/* Filtres */}
        <div className={styles.filters}>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="All">Toutes les catégories</option>
            <option value="Work">Travail</option>
            <option value="Personal">Personnel</option>
            <option value="Study">Études</option>
          </select>

          <select onChange={(e) => setSelectedPriority(e.target.value)}>
            <option value="All">Toutes les priorités</option>
            <option value="High">Haute</option>
            <option value="Medium">Moyenne</option>
            <option value="Low">Basse</option>
          </select>
        </div>

        {/* Liste des tâches */}
        <div className={styles.taskList}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className={styles.taskCard}>
                <h3>{task.title}</h3>
                <p>Catégorie: {task.category}</p>
                <p>Priorité: {task.priority}</p>
                <p>Échéance: {task.dueDate}</p>
              </div>
            ))
          ) : (
            <p>Aucune tâche trouvée.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;
