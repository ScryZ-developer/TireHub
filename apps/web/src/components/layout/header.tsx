'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingCart, User, MapPin, Search, Menu, Plus, LogIn } from 'lucide-react';
import { UserRole } from '@tirehub/shared';
import { useCartStore, useAuthStore, useGeoStore } from '@/stores';
import clsx from 'clsx';

const navLinks = [
  { href: '/catalog', label: 'Объявления' },
  { href: '/listings/my', label: 'Мои объявления' },
  { href: '/partners', label: 'Партнёры' },
  { href: '/garage', label: 'Мой гараж' },
];

export function Header() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const { city } = useGeoStore();

  const accountHref = user ? '/account' : '/login';

  return (
    <header className="sticky top-0 z-50 bg-primary pb-6">
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <div className="mb-2 flex items-center justify-end">
          <span className="flex items-center gap-1 text-xs text-white/70">
            <MapPin className="h-3.5 w-3.5" />
            {city}
          </span>
          {user?.role === UserRole.ADMIN && (
            <Link href="/admin" className="ml-4 text-xs text-white/80 hover:text-white">
              Админ
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20"
            >
              <span className="text-lg font-bold text-white">TH</span>
            </motion.div>
            <span className="text-xl font-bold text-white transition-opacity group-hover:opacity-90">
              TireHub
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'relative rounded-button px-4 py-2 text-sm font-medium transition-all duration-300',
                  pathname.startsWith(link.href)
                    ? 'text-white'
                    : 'text-white/80 hover:text-white',
                )}
              >
                {pathname.startsWith(link.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-button bg-white/20"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/listings/new"
              className="hidden items-center gap-1.5 rounded-button bg-accent px-3 py-2 text-sm font-medium text-white transition-all hover:bg-accent/90 sm:inline-flex"
            >
              <Plus className="h-4 w-4" />
              Разместить
            </Link>
            <Link
              href="/catalog"
              className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white md:hidden"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              href={accountHref}
              className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white"
              title={user ? 'Аккаунт' : 'Войти'}
            >
              {user ? <User className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </Link>
            <Link
              href="/partners"
              className="hidden rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white sm:block"
            >
              <MapPin className="h-5 w-5" />
            </Link>
            <Link href="/cart" className="relative rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white">
              <ShoppingCart className="h-5 w-5" />
              <motion.span
                key={totalItems}
                initial={{ scale: 0 }}
                animate={{ scale: totalItems > 0 ? 1 : 0 }}
                className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
              >
                {totalItems}
              </motion.span>
            </Link>
            <button className="rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white md:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-6 rounded-b-header bg-primary" />
    </header>
  );
}
