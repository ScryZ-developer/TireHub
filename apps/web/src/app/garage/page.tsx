'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Trash2, Calendar } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';
import { useAuthStore, useGarageStore } from '@/stores';

export default function GaragePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const getVehicles = useGarageStore((s) => s.getVehicles);
  const addVehicle = useGarageStore((s) => s.addVehicle);
  const removeVehicle = useGarageStore((s) => s.removeVehicle);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    tireSize: '',
    installDate: '',
    nickname: '',
  });

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  const vehicles = getVehicles(user.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVehicle(user.id, {
      ...form,
      installDate: form.installDate || undefined,
      nickname: form.nickname || undefined,
    });
    setForm({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      tireSize: '',
      installDate: '',
      nickname: '',
    });
    setShowForm(false);
  };

  const handleRemove = (id: string) => {
    removeVehicle(user.id, id);
  };

  const getTireAge = (installDate?: string) => {
    if (!installDate) return null;
    const months = Math.floor(
      (Date.now() - new Date(installDate).getTime()) / (1000 * 60 * 60 * 24 * 30),
    );
    if (months < 12) return `${months} мес.`;
    const years = Math.floor(months / 12);
    return `${years} ${years === 1 ? 'год' : years < 5 ? 'года' : 'лет'}`;
  };

  return (
    <div className="mx-auto max-w-3xl px-4">
      <FadeIn>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Мой гараж</h1>
          {vehicles.length > 0 && !showForm && (
            <button onClick={() => setShowForm(true)} className="btn-primary gap-1.5">
              <Plus className="h-4 w-4" />
              Добавить авто
            </button>
          )}
        </div>
      </FadeIn>

      <AnimatePresence>
      {vehicles.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card flex flex-col items-center py-16 text-center"
        >
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Car className="h-20 w-20 text-primary/20" strokeWidth={1} />
          </motion.div>
          <h2 className="mt-6 text-lg font-semibold text-text-primary">
            Ваш гараж пуст
          </h2>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Добавьте автомобиль, чтобы получать персональные рекомендации по шинам
            и отслеживать возраст текущего комплекта
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mt-6 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Добавить автомобиль
          </button>
        </motion.div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card mb-6 p-6"
        >
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Новый автомобиль
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Марка
                </label>
                <input
                  required
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="Toyota"
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Модель
                </label>
                <input
                  required
                  value={form.model}
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  placeholder="Camry"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Год выпуска
                </label>
                <input
                  required
                  type="number"
                  min={1990}
                  max={2030}
                  value={form.year}
                  onChange={(e) =>
                    setForm({ ...form, year: Number(e.target.value) })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Размер шин
                </label>
                <input
                  required
                  value={form.tireSize}
                  onChange={(e) => setForm({ ...form, tireSize: e.target.value })}
                  placeholder="225/45 R17"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Дата установки резины
                </label>
                <input
                  type="date"
                  value={form.installDate}
                  onChange={(e) =>
                    setForm({ ...form, installDate: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                  Название (необязательно)
                </label>
                <input
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="Семейная"
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary">
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-outline"
              >
                Отмена
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {vehicles.length > 0 && (
        <div className="space-y-4">
          <AnimatePresence>
          {vehicles.map((vehicle) => {
            const tireAge = getTireAge(vehicle.installDate);
            return (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="card p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-card bg-primary/10">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">
                        {vehicle.nickname ??
                          `${vehicle.brand} ${vehicle.model}`}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {vehicle.brand} {vehicle.model} · {vehicle.year}
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Размер: <span className="font-medium text-text-primary">{vehicle.tireSize}</span>
                      </p>
                      {tireAge && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                          <Calendar className="h-3.5 w-3.5" />
                          Возраст резины: {tireAge}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(vehicle.id)}
                    className="rounded-full p-2 text-text-secondary transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
