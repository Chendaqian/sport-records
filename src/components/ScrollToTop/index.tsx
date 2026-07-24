import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 300;

const getScrollTop = (): number => {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
};

const ScrollToTop = ({ btnClass }: { btnClass: string }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(getScrollTop() > SCROLL_THRESHOLD);
          ticking = false;
        });
        ticking = true;
      }
    };

    // 初始检查
    setVisible(getScrollTop() > SCROLL_THRESHOLD);

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibilityClass = visible
    ? 'opacity-100'
    : 'pointer-events-none opacity-0';

  return (
    <button
      onClick={scrollToTop}
      className={`${btnClass} top-[224px] transition-all duration-300 ease-in-out ${visibilityClass}`}
      aria-label="滚动到顶部"
      title="滚动到顶部"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
