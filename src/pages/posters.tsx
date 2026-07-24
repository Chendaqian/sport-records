import { lazy, Suspense } from 'react';
import FixedNav from '@/components/FixedNav';
import Layout from '@/components/Layout';
import { totalStat } from '@assets/index';
import { loadSvgComponent } from '@/utils/svgUtils';

const GridSvg = lazy(() => loadSvgComponent(totalStat, './grid.svg'));
const GithubSvg = lazy(() => loadSvgComponent(totalStat, './github.svg'));

const Posters = () => (
  <Layout>
    <FixedNav />
    <div className="w-full">
      <Suspense
        fallback={<div className="text-center text-theme-text-muted-light">Loading...</div>}
      >
        <GridSvg className="mb-8 h-auto w-full" />
        <GithubSvg className="mb-8 h-auto w-full" />
      </Suspense>
    </div>
  </Layout>
);

export default Posters;
