import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';

const PeriodStat = ({ onClick }: { onClick: (_period: string) => void }) => {
  const { runPeriod } = useActivities();

  const periodArr = Object.entries(runPeriod);
  periodArr.sort((a, b) => b[1] - a[1]);
  return (
    <div className="_statForType_1nqem_9">
      <section>
        {periodArr.map(([period, times]) => (
          <Stat
            key={period}
            value={period}
            description={` ${times}`}
            citySize={3}
            onClick={() => onClick(period)}
          />
        ))}
      </section>
      <hr color='red'/>
    </div>
  );
};

export default PeriodStat;
