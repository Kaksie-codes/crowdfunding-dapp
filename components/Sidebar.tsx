'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

const Sidebar = () => {
  const pathname = usePathname();

  const navLink = [
    { name: 'Home', href: '/' },
    { name: 'Transaction History', href: '/transactions' },
  ];

  return (
    <aside className="min-w-[250px] fixed top-0 left-0 bottom-0 h-screen bg-card border-r border-border p-4 flex flex-col gap-8">
      <Logo />

      <nav className="flex flex-col gap-2">
        {navLink.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
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
