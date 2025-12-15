'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const pathname = usePathname();

  const navLink = [
    { name: 'Home', href: '/' },
    { name: 'Backers & Contributions', href: '/transactions' },
  ];

  return (
    <aside className={`min-w-[250px] fixed top-0 left-0 bottom-0 h-screen bg-card border-r border-border p-4 flex flex-col gap-8 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto ${isOpen ? '' : 'hidden'} md:block`}>
      <div className="flex justify-between items-center">
        <Logo />
        <button onClick={onClose} className="md:hidden p-1 hover:bg-accent rounded">
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {navLink.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose} // close on mobile after navigation
             className={
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                hover:bg-accent hover:text-accent-foreground
                ${isActive ? "bg-primary/10 text-primary font-semibold border border-primary/30" : ""}`
                }
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
