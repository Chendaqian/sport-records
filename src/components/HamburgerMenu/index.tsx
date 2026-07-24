interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerMenu = ({ isOpen, onToggle }: HamburgerMenuProps) => {
  return (
    <button
      onClick={onToggle}
      className="fixed left-4 top-20 z-50 flex h-10 w-10 items-center justify-center rounded border border-theme-accent text-theme-accent transition-colors hover:bg-white/20 hover:text-white"
      aria-label={isOpen ? '折叠侧边栏' : '展开侧边栏'}
      title={isOpen ? '折叠侧边栏' : '展开侧边栏'}
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
  );
};

export default HamburgerMenu;
