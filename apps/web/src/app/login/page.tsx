'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/ui/motion';
import { useAuthStore } from '@/stores';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      router.push('/account');
    } catch {
      /* error in store */
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <FadeIn>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-text-primary">Вход</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Войдите, чтобы сохранять гараж, объявления и заказы
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@mail.ru"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Пароль</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-red-500"
              >
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Нет аккаунта?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </p>

          <div className="mt-6 rounded-card bg-surface-muted p-4 text-xs text-text-secondary">
            <p className="font-medium text-text-primary">Демо-аккаунты:</p>
            <p className="mt-1">admin@tirehub.ru / admin123</p>
            <p>shop@tirehub.ru / demo1234</p>
            <p>private@tirehub.ru / demo1234</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
