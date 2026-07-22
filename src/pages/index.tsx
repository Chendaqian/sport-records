import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import FixedNav from '@/components/FixedNav';
import Layout from '@/components/Layout';
import LocationStat from '@/components/LocationStat';
import RunMap from '@/components/RunMap';
import RunTable from '@/components/RunTable';
import useActivities from '@/hooks/useActivities';
import { INFO_MESSAGE } from '@/utils/const';

import {
  Activity,
  IViewState,
  filterAndSortRuns,
  filterCityRuns,
  filterTitleRuns,
  filterYearRuns,
  geoJsonForRuns,
  getBoundsForGeoData,
  scrollToMap,
  sortDateFunc,
  titleForShow,
  RunIds,
} from '@/utils/utils';

const Index = () => {
  const { years } = useActivities();
  const { activities, thisYear } = useActivities();
  const [year, setYear] = useState('Total');
  const [runIndex, setRunIndex] = useState(-1);
  const [runs, setActivity] = useState(
    filterAndSortRuns(activities, year, filterYearRuns, sortDateFunc)
  );
  const [title, setTitle] = useState('');
  const [geoData, setGeoData] = useState(geoJsonForRuns(runs));
  // for auto zoom
  const bounds = getBoundsForGeoData(geoData);
  const [intervalId, setIntervalId] = useState<number>();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [resizeTrigger, setResizeTrigger] = useState(0);

  const [viewState, setViewState] = useState<IViewState>({
    ...bounds,
  });

  const changeByItem = (
    item: string,
    name: string,
    func: (_run: Activity, _value: string) => boolean
  ) => {
    scrollToMap();
    if (name != 'Year') {
      setYear(thisYear);
    }
    setActivity(filterAndSortRuns(activities, item, func, sortDateFunc));
    setRunIndex(-1);
    setTitle(`${item} ${name} Running Heatmap`);
  };

  const changeYear = (y: string) => {
    // default year
    setYear(y);

    if ((viewState.zoom ?? 0) > 3 && bounds) {
      setViewState({
        ...bounds,
      });
    }

    changeByItem(y, 'Year', filterYearRuns);
    clearInterval(intervalId);
  };

  const changeCity = (city: string) => {
    changeByItem(city, 'City', filterCityRuns);
  };

  const changeTitle = (title: string) => {
    changeByItem(title, 'Title', filterTitleRuns);
  };

  const locateActivity = (runIds: RunIds) => {
    const ids = new Set(runIds);

    const selectedRuns = !runIds.length
      ? runs
      : runs.filter((r: any) => ids.has(r.run_id));

    if (!selectedRuns.length) {
      return;
    }

    const lastRun = selectedRuns.sort(sortDateFunc)[0];

    if (!lastRun) {
      return;
    }
    setGeoData(geoJsonForRuns(selectedRuns));
    setTitle(titleForShow(lastRun));
    clearInterval(intervalId);
    scrollToMap();
  };

  useEffect(() => {
    setViewState({
      ...bounds,
    });
  }, [geoData]);

  useEffect(() => {
    const runsNum = runs.length;
    // maybe change 20 ?
    const sliceNume = runsNum >= 20 ? runsNum / 20 : 1;
    let i = sliceNume;
    const id = setInterval(() => {
      if (i >= runsNum) {
        clearInterval(id);
      }

      const tempRuns = runs.slice(0, i);
      setGeoData(geoJsonForRuns(tempRuns));
      i += sliceNume;
    }, 100);
    setIntervalId(id);
  }, [runs]);

  // parse ?year= param from annual page navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const yearParam = params.get('year');
    if (yearParam && (yearParam === 'Total' || years.includes(yearParam))) {
      window.history.replaceState({}, '', window.location.pathname);
      changeYear(yearParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <FixedNav
        sidebarVisible={sidebarVisible}
        onToggle={() => {
          setSidebarVisible(!sidebarVisible);
          setResizeTrigger((c) => c + 1);
        }}
      />
      <div className={`w-full lg:w-1/3 ${sidebarVisible ? '' : 'hidden'}`}>
        <div className="w-full lg:max-w-[600px] lg:pr-16">
          <section className="_statForType_1nqem_9">
            <p className="leading-relaxed">
              数据来源：<b className="_b_corSienna">佳明540</b>，展示
              <b className="_b_corSienna">
                {' '}
                {INFO_MESSAGE(years.length, year)}{' '}
              </b>
              数据。
              <br />
              <br />
              “怀念过去是在时间的长河里刻舟求剑，
              <br />
              展望未来是在前行的道路上望梅止渴。”
              <br />
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;––&nbsp;&nbsp;甲辰·庚午·癸卯{' '}
              <b className="_b_corSienna">C.D.Q</b>
            </p>
            <hr color="red" />
          </section>
        </div>
        <LocationStat
          changeYear={changeYear}
          changeCity={changeCity}
          changeTitle={changeTitle}
        />
      </div>
      <div className={`w-full ${sidebarVisible ? 'lg:w-2/3' : 'lg:w-full'}`}>
        <RunMap
          title={title}
          viewState={viewState}
          geoData={geoData}
          setViewState={setViewState}
          changeYear={changeYear}
          thisYear={year}
          resizeTrigger={resizeTrigger}
        />
        <RunTable
          runs={runs}
          locateActivity={locateActivity}
          setActivity={setActivity}
          runIndex={runIndex}
          setRunIndex={setRunIndex}
        />
      </div>
      {/* Enable Audiences in Vercel Analytics: https://vercel.com/docs/concepts/analytics/audiences/quickstart */}
      <Analytics />
    </Layout>
  );
};

export default Index;
