import LineChartWithFilters from '../../components/LineChartWithFilters';
import PieChart from '../../components/PieChart';
import Tracker from '../../components/Tracker';
import Style from '@/app/statistics/statistics.module.css'

const StatisticsPage = () => {
  return (
    <div style={{ padding: '20px', height:'60vh' }}>      
      <div className={Style.chartcontainer}>
        <h2>Statistiques de tâches</h2>
        <LineChartWithFilters />
      </div>

      <div style={{ display: 'flex', flexDirection:'row', justifyContent: 'space-between' }}>
        {/* tracker */}
        <div style={{ width: '65%', height:'45vh'}}>
          <h2 style={{color:'#0E3028', marginTop:'5px', marginBottom:'0'}}>Trackeur de productivité</h2>
          <div className={Style.trackerdiv}>
            <Tracker />
          </div>
        </div>
        <div className={Style.containerPieGlobal}>
          <h2 style={{color:'#0E3028', marginTop:'10px'}}>Vue générale</h2>
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
