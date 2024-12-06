import LineChartWithFilters from '../../components/LineChartWithFilters';
import PieChart from '../../components/PieChart';
import Tracker from '../../components/Tracker';
import Style from './statistics.module.css'

const StatisticsPage = () => {
  return (
    <div style={{ padding: '20px', height:'80vh' }}>
      
      <div className={Style.chartcontainer}>
        <h2 style={{color:'var(--green-dark-white-lightmode)'}}>Statistiques de tâches</h2>
        <LineChartWithFilters />
      </div>

      <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'space-between' }}>
        {/* tracker */}
        <div  className={Style.containerTracker}>
          <h2 style={{color:'var(--green-dark-white-lightmode)', marginTop:'10px'}}>Trackeur de productivité</h2>
          <Tracker />
        </div>
        <div className={Style.containerPieGlobal}>
          <h2 style={{color:'var(--green-dark-white-lightmode)', marginTop:'10px'}}>Vue générale</h2>
          <div className={Style.containetPie}>
            <div className={Style.piechart}>
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
