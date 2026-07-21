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

const ScrollToTop = () => {
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

  return (
    <button
      onClick={scrollToTop}
      className={`fixed left-4 top-[224px] z-50 flex h-10 w-10 items-center justify-center rounded
        border border-[rgb(224,237,94)] text-[rgb(224,237,94)]
        transition-all duration-300
        ease-in-out hover:bg-white/20 hover:text-white
        ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
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
