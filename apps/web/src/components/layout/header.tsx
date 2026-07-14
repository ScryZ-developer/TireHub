'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ShoppingCart,
  User,
  MapPin,
  Plus,
  LogIn,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { UserRole } from '@tirehub/shared';
import { useCartStore, useAuthStore, useGeoStore } from '@/stores';
import clsx from 'clsx';

const navLinks = [
  { href: '/catalog', label: 'Объявления' },
  { href: '/listings/my', label: 'Мои объявления' },
  { href: '/partners', label: 'Партнёры' },
  { href: '/garage', label: 'Гараж' },
];

export function Header() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.totalItems());
  const user = useAuthStore((s) => s.user);
  const { city } = useGeoStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const accountHref = user ? '/account' : '/login';
  const displayName =
    user?.seller?.name ??
    user?.firstName ??
    (user ? user.email.split('@')[0] : null);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-primary-dark via-primary to-[#1976D2] shadow-[0_8px_24px_rgba(13,71,161,0.25)]">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center gap-4 px-4 lg:gap-6">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 420, damping: 18 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black tracking-tight text-primary shadow-sm"
          >
            TH
          </motion.span>
          <span className="text-lg font-bold tracking-tight text-white">
            TireHub
          </span>
        </Link>

        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/90 ring-1 ring-white/15 transition hover:bg-white/15 sm:inline-flex"
          title="Город доставки"
        >
          <MapPin className="h-3.5 w-3.5 text-accent" />
          <span className="max-w-[9rem] truncate font-medium">{city}</span>
        </button>

        <nav className="ml-auto hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'relative px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-white' : 'text-white/70 hover:text-white',
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {user?.role === UserRole.ADMIN && (
            <Link
              href="/admin"
              className={clsx(
                'relative flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith('/admin')
                  ? 'text-white'
                  : 'text-white/70 hover:text-white',
              )}
            >
              <Shield className="h-3.5 w-3.5" />
              Админ
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 md:ml-2">
          <Link
            href="/listings/new"
            className="hidden items-center gap-1.5 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(255,111,0,0.35)] transition hover:bg-[#F57C00] hover:shadow-[0_6px_18px_rgba(255,111,0,0.45)] sm:inline-flex"
          >
            <Plus className="h-4 w-4" />
            Разместить
          </Link>

          <Link
            href={accountHref}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/90 transition hover:bg-white/10"
            title={user ? 'Аккаунт' : 'Войти'}
          >
            <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15 ring-1 ring-white/20">
              {user?.avatarUrl || user?.seller?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl ?? user.seller?.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : user ? (
                <User className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
            </span>
            <span className="hidden max-w-[7rem] truncate text-sm font-medium lg:block">
              {displayName ?? 'Войти'}
            </span>
          </Link>

          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10"
            aria-label="Корзина"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-primary-dark/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              <p className="mb-1 flex items-center gap-1.5 text-xs text-white/60">
                <MapPin className="h-3.5 w-3.5" />
                {city}
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={clsx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium',
                    pathname.startsWith(link.href)
                      ? 'bg-white/15 text-white'
                      : 'text-white/80 hover:bg-white/10',
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/listings/new"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-lg bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Разместить объявление
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
