'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, BriefcaseBusiness, ContactRound, House, Menu, PackageCheck, Truck, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { BrandMark } from '@/components/brand-mark';

const items = [
  { label: 'Home', href: '/#top', icon: House },
  { label: 'Services', href: '/#services', icon: BriefcaseBusiness },
  { label: 'Fleet', href: '/fleet', icon: Truck },
  { label: 'Tracking', href: '/tracking', icon: PackageCheck },
  { label: 'About', href: '/about', icon: ContactRound },
  { label: 'Contact', href: '/contact', icon: ContactRound },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigationRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 80);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen || !window.matchMedia('(max-width: 768px)').matches) return;
    navigationRef.current?.querySelector<HTMLElement>('a')?.focus();
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`} onKeyDown={(event) => {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }}>
      <div className="header-shell">
        <BrandMark />
        <nav id="primary-navigation" ref={navigationRef} className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
          {items.map((item) => {
            const Icon = item.icon;
            const isCurrent = pathname === item.href || (item.label === 'Home' && pathname === '/');
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={`nav-link ${isCurrent ? 'is-active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon aria-hidden="true" size={15} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <Link className="nav-quote nav-quote--mobile" href="/#quote" onClick={() => setMenuOpen(false)}>
            Get a Quote <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <svg className="menu-doodle" viewBox="0 0 180 38" aria-hidden="true" data-open={menuOpen}>
            <path d="M4 28C38 1 70 4 92 20s45 18 84-12" />
            <path d="m165 8 11-1-2 11" />
            <circle cx="49" cy="9" r="2" />
          </svg>
        </nav>
        <div className="header-actions">
          <Link className="nav-quote" href="/#quote">
            Get a Quote <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>
      <span className="header-rule" aria-hidden="true" />
    </header>
  );
}
