import { Link } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import ThemeToggle from '@/components/ThemeToggle';

interface FixedNavProps {
  sidebarVisible?: boolean;
  onToggle?: () => void;
}

const FixedNav = ({ sidebarVisible, onToggle }: FixedNavProps) => {
  const isToggleMode = !!onToggle;

  const btnClass =
    'fixed left-8 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-theme-border bg-theme-card text-theme-accent shadow-md transition-all duration-200 hover:border-theme-accent hover:shadow-lg hover:scale-105';

  return (
    <>
      {isToggleMode ? (
        <button
          onClick={onToggle}
          className={`${btnClass} top-20`}
          aria-label={sidebarVisible ? '折叠侧边栏' : '展开侧边栏'}
          title={sidebarVisible ? '折叠侧边栏' : '展开侧边栏'}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      ) : (
        <Link to="/" className={`${btnClass} top-20`} title="返回首页">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </Link>
      )}
      <ThemeToggle className={`${btnClass} top-[121px]`} />
      <Link to="/posters" className={`${btnClass} top-[162px]`} title="年度海报">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      </Link>
      <Link to="/annual" className={`${btnClass} top-[203px]`} title="年度回顾">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="4" y1="20" x2="4" y2="12" />
          <line x1="8" y1="20" x2="8" y2="4" />
          <line x1="12" y1="20" x2="12" y2="14" />
          <line x1="16" y1="20" x2="16" y2="8" />
          <line x1="20" y1="20" x2="20" y2="10" />
        </svg>
      </Link>
      <ScrollToTop btnClass={btnClass} />
    </>
  );
};

export default FixedNav;
