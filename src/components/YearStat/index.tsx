import { ComponentType, Suspense, useEffect, useState } from 'react';
import Stat from '@/components/Stat';
import useActivities from '@/hooks/useActivities';
import { formatPace } from '@/utils/utils';
import { yearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

const SvgContainer = ({ year }: { year: string }) => {
  const [Svg, setSvg] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadSvgComponent(yearStats, `./year_${year}.svg`).then((mod) => {
      if (!cancelled) {
        setSvg(() => mod.default);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [year]);

  if (!Svg) {
    return null;
  }

  return <Svg className="h-full w-full border-0 p-0" />;
};

const YearStat = ({
  year,
  onClick,
}: {
  year: string;
  onClick?: (_year: string) => void;
}) => {
  let { activities: runs, years } = useActivities();

  if (years.includes(year)) {
    runs = runs.filter((run) => run.start_date_local.slice(0, 4) === year);
  }
  let sumDistance = 0;
  let streak = 0;
  let pace = 0; // eslint-disable-line no-unused-vars
  let paceNullCount = 0; // eslint-disable-line no-unused-vars
  let heartRate = 0;
  let heartRateNullCount = 0;
  let totalMetersAvail = 0;
  let totalSecondsAvail = 0;
  runs.forEach((run) => {
    sumDistance += run.distance || 0;
    if (run.average_speed) {
      pace += run.average_speed;
      totalMetersAvail += run.distance || 0;
      totalSecondsAvail += (run.distance || 0) / run.average_speed;
    } else {
      paceNullCount++;
    }
    if (run.average_heartrate) {
      heartRate += run.average_heartrate;
    } else {
      heartRateNullCount++;
    }
    if (run.streak) {
      streak = Math.max(streak, run.streak);
    }
  });
  sumDistance = parseFloat((sumDistance / 1000.0).toFixed(1));
  const avgPace = formatPace(totalMetersAvail / totalSecondsAvail);
  const hasHeartRate = !(heartRate === 0);
  const avgHeartRate = (heartRate / (runs.length - heartRateNullCount)).toFixed(
    0
  );

  return (
    <div
      className="_statForType_1nqem_9 overflow-x-auto"
      onClick={onClick ? () => onClick(year) : undefined}
    >
      <div>
        <section className="relative inline-block">
          <Stat value={year} description=" Journey" className="_difuni_div" />
          <Stat value={runs.length} description=" Runs" />
          <Stat value={sumDistance} description=" KM" />
          <Stat value={avgPace} description=" Avg Pace" />
          <Stat value={`${streak} day`} description=" Streak" />
          {hasHeartRate && (
            <Stat value={avgHeartRate} description=" Avg Heart Rate" />
          )}
          {year !== 'Total' && (
            <div className="absolute left-[calc(100%+30px)] top-0 bottom-0 w-[350px] overflow-hidden">
              <SvgContainer year={year} />
            </div>
          )}
        </section>
      </div>
      <hr color="red" />
    </div>
  );
};

export default YearStat;
