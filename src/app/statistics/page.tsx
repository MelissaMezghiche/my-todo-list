import LineChartWithFilters from '@/components/LineChartWithFilters';
import PieChart from '@/components/PieChart';
import TaskProgress from '@/components/TaskProgress';

const StatisticsPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Statistics Dashboard</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Task Trends</h2>
        <LineChartWithFilters />
      </section>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Tableau des pourcentages */}
        <div style={{ width: '45%' }}>
          <h2>Task Completion Progress</h2>
          <TaskProgress />
        </div>

        {/* Graphique en camembert */}
        <div style={{ width: '45%' }}>
          <h2>Task Distribution</h2>
          <PieChart />
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
