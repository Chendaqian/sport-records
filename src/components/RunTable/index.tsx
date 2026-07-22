import React, { useState } from 'react';
import {
  sortDateFunc,
  sortDateFuncReverse,
  convertMovingTime2Sec,
  Activity,
  RunIds,
} from '@/utils/utils';
import RunRow from './RunRow';
import styles from './style.module.css';

const PAGE_SIZE = 20;

interface IRunTableProperties {
  runs: Activity[];
  locateActivity: (_runIds: RunIds) => void;
  setActivity: (_runs: Activity[]) => void;
  runIndex: number;
  setRunIndex: (_index: number) => void;
}

type SortFunc = (_a: Activity, _b: Activity) => number;

const RunTable = ({
  runs,
  locateActivity,
  setActivity,
  runIndex,
  setRunIndex,
}: IRunTableProperties) => {
  const [sortFuncInfo, setSortFuncInfo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sortTypeFunc: SortFunc = (a, b) =>
    sortFuncInfo === 'Type'
      ? a.type > b.type
        ? 1
        : -1
      : b.type < a.type
        ? -1
        : 1;
  const sortKMFunc: SortFunc = (a, b) =>
    sortFuncInfo === 'KM' ? a.distance - b.distance : b.distance - a.distance;
  const sortPaceFunc: SortFunc = (a, b) =>
    sortFuncInfo === 'Pace'
      ? a.average_speed - b.average_speed
      : b.average_speed - a.average_speed;
  const sortBPMFunc: SortFunc = (a, b) => {
    return sortFuncInfo === 'BPM'
      ? (a.average_heartrate ?? 0) - (b.average_heartrate ?? 0)
      : (b.average_heartrate ?? 0) - (a.average_heartrate ?? 0);
  };
  const sortRunTimeFunc: SortFunc = (a, b) => {
    const aTotalSeconds = convertMovingTime2Sec(a.moving_time);
    const bTotalSeconds = convertMovingTime2Sec(b.moving_time);
    return sortFuncInfo === 'Time'
      ? aTotalSeconds - bTotalSeconds
      : bTotalSeconds - aTotalSeconds;
  };
  const sortDateFuncClick =
    sortFuncInfo === 'Date' ? sortDateFunc : sortDateFuncReverse;
  const sortFuncMap = new Map([
    ['Type', sortTypeFunc],
    ['KM', sortKMFunc],
    ['Pace', sortPaceFunc],
    ['BPM', sortBPMFunc],
    ['Date', sortDateFuncClick],
    ['Time', sortRunTimeFunc],
  ]);

  const totalPages = Math.max(1, Math.ceil(runs.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pagedRuns = runs.slice(startIndex, startIndex + PAGE_SIZE);

  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    const funcName = (e.target as HTMLElement).innerHTML;
    const f = sortFuncMap.get(funcName);

    setRunIndex(-1);
    setSortFuncInfo(sortFuncInfo === funcName ? '' : funcName);
    setActivity(runs.sort(f));
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }
    setCurrentPage(page);
    setRunIndex(-1);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.runTable} cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            {Array.from(sortFuncMap.keys()).map((k) => (
              <th key={k} onClick={handleClick}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pagedRuns.map((run, elementIndex) => (
            <RunRow
              key={run.run_id}
              elementIndex={elementIndex}
              rowNumber={startIndex + elementIndex + 1}
              locateActivity={locateActivity}
              run={run}
              runIndex={runIndex}
              setRunIndex={setRunIndex}
            />
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={safePage <= 1}
            onClick={() => goToPage(safePage - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => {
              if (totalPages <= 7) {
                return true;
              }
              return (
                p === 1 ||
                p === totalPages ||
                (p >= safePage - 1 && p <= safePage + 1)
              );
            })
            .map((p, i, arr) => {
              const items: React.ReactNode[] = [];
              if (i > 0 && p - arr[i - 1] > 1) {
                items.push(
                  <span key={`ellipsis-${p}`} className={styles.ellipsis}>
                    …
                  </span>
                );
              }
              items.push(
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === safePage ? styles.active : ''}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              );
              return items;
            })}
          <button
            className={styles.pageBtn}
            disabled={safePage >= totalPages}
            onClick={() => goToPage(safePage + 1)}
          >
            ›
          </button>
          <span className={styles.pageInfo}>
            {runs.length} 条记录，第 {safePage}/{totalPages} 页
          </span>
        </div>
      )}
    </div>
  );
};

export default RunTable;
