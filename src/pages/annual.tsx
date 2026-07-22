import { lazy, Suspense } from 'react';
import FixedNav from '@/components/FixedNav';
import Layout from '@/components/Layout';
import YearStat from '@/components/YearStat';
import useActivities from '@/hooks/useActivities';
import { githubYearStats } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

const GithubYearSvg = ({ year }: { year: string }) => {
  const path = `./github_${year}.svg`;
  const hasSvg = path in githubYearStats;

  if (!hasSvg) {
    return null;
  }

  const SvgComponent = lazy(() =>
    loadSvgComponent(githubYearStats, path)
  );

  return (
    <Suspense fallback={null}>
      <SvgComponent className="my-4 h-auto w-full" />
    </Suspense>
  );
};

const Annual = () => {
  const { years } = useActivities();

  const yearsReversed = [...years].sort().reverse();
  const displayYears = [...yearsReversed, 'Total'];

  return (
    <Layout>
      <FixedNav />
      <div className="w-full">
        {displayYears.map((year) => (
          <div key={year} className="mb-8">
            <YearStat year={year}>
              {year !== 'Total' && <GithubYearSvg year={year} />}
            </YearStat>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Annual;
