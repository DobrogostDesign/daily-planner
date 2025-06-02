import React from 'react';

interface NavItem {
  icon: string; // image path
  label: string;
  count: number;
}

interface SidebarProps {
  selectedIdx: number;
  onSelect: (idx: number) => void;
  navItems: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ selectedIdx, onSelect, navItems }) => (
  <aside className="h-screen w-[320px] bg-gray-50 flex flex-col py-8 px-4">
    <nav className="flex flex-col gap-4">
      {navItems.map((item, i) => (
        <div
          key={item.label}
          className={`group flex items-center gap-2 rounded-xl pr-4 cursor-pointer transition-colors font-medium text-sm text-gray-500 ${
            i === selectedIdx ? 'bg-gray-100 text-gray-950' : 'hover:text-gray-950'
          }`}
          tabIndex={0}
          aria-label={item.label}
          onClick={() => onSelect(i)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(i); }}
          role="button"
        >
          <img src={item.icon} alt="" className="w-12 h-12 transition-transform duration-300 group-hover:rotate-[10deg]" />
          <span className="flex-1">{item.label}</span>
          <span className="text-xs text-gray-500 font-normal ">{item.count}</span>
        </div>
      ))}
    </nav>
  </aside>
);

export default Sidebar; 