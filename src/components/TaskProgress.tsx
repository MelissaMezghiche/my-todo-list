'use client';

const TaskProgress = () => {
  const categories = [
    { name: 'Work', percentage: 80, color: '#4caf50' },
    { name: 'Personal', percentage: 60, color: '#ff9800' },
    { name: 'Learning', percentage: 40, color: '#f44336' },
  ];

  return (
    <div>
      {categories.map((category) => (
        <div key={category.name} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{category.name}</span>
            <span>{category.percentage}%</span>
          </div>
          <div style={{ background: '#ddd', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${category.percentage}%`, background: category.color, height: '100%' }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskProgress;
