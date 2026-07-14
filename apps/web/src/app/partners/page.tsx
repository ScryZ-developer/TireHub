'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Phone, Navigation, MapPin, Wrench, Store } from 'lucide-react';
import { mockPartners } from '@/lib/api';
import { FadeIn } from '@/components/ui/motion';
import clsx from 'clsx';

type Partner = (typeof mockPartners)[number];

const typeLabels: Record<string, { label: string; icon: typeof Store }> = {
  store: { label: 'Магазин', icon: Store },
  tire_service: { label: 'Шиномонтаж', icon: Wrench },
  pickup_point: { label: 'ПВЗ', icon: MapPin },
};

export default function PartnersPage() {
  const [selected, setSelected] = useState<Partner | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <FadeIn>
        <h1 className="mb-6 text-2xl font-bold text-text-primary">
          Партнёры на карте
        </h1>
      </FadeIn>

      <div className="flex flex-col gap-6 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="card relative h-[400px] flex-1 overflow-hidden lg:h-[600px]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #1565C0 0, #1565C0 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #1565C0 0, #1565C0 1px, transparent 1px, transparent 40px)',
              }}
            />
          </div>

          {mockPartners.map((partner, index) => {
            const isStore = partner.type === 'store' || partner.type === 'pickup_point';
            const positions = [
              { top: '30%', left: '40%' },
              { top: '50%', left: '60%' },
              { top: '65%', left: '35%' },
            ];
            const pos = positions[index] ?? positions[0];

            return (
              <motion.button
                key={partner.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.15 }}
                onClick={() => setSelected(partner)}
                className="absolute z-10 -translate-x-1/2 -translate-y-full transition-transform hover:scale-110"
                style={{ top: pos.top, left: pos.left }}
              >
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full shadow-elevation ring-2 ring-white',
                    isStore ? 'bg-primary' : 'bg-accent',
                  )}
                >
                  {isStore ? (
                    <Store className="h-5 w-5 text-white" />
                  ) : (
                    <Wrench className="h-5 w-5 text-white" />
                  )}
                </div>
                <div
                  className={clsx(
                    'mx-auto h-0 w-0 border-x-8 border-t-8 border-x-transparent',
                    isStore ? 'border-t-primary' : 'border-t-accent',
                  )}
                />
              </motion.button>
            );
          })}

          <div className="absolute bottom-4 left-4 rounded-card bg-surface/90 px-3 py-2 text-xs shadow-card backdrop-blur">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-primary" /> Магазины
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-full bg-accent" /> Шиномонтаж
              </span>
            </div>
          </div>
        </motion.div>

        <div className="w-full shrink-0 lg:w-80">
          <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
            <PartnerCard
              partner={selected}
              onClose={() => setSelected(null)}
            />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-4"
            >
              <h2 className="mb-3 font-semibold text-text-primary">
                Все партнёры ({mockPartners.length})
              </h2>
              <ul className="space-y-2">
                {mockPartners.map((partner) => (
                  <li key={partner.id}>
                    <button
                      onClick={() => setSelected(partner)}
                      className="flex w-full items-start gap-3 rounded-button p-3 text-left transition-colors hover:bg-background"
                    >
                      <div
                        className={clsx(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                          partner.type === 'tire_service'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-primary/10 text-primary',
                        )}
                      >
                        {partner.type === 'tire_service' ? (
                          <Wrench className="h-4 w-4" />
                        ) : (
                          <Store className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {partner.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {partner.address}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PartnerCard({
  partner,
  onClose,
}: {
  partner: Partner;
  onClose: () => void;
}) {
  const typeInfo = typeLabels[partner.type] ?? typeLabels.store;
  const TypeIcon = typeInfo.icon;

  return (
    <div className="card p-5">
      <button
        onClick={onClose}
        className="mb-3 text-xs text-primary hover:text-primary-dark"
      >
        ← Назад к списку
      </button>

      <div
        className={clsx(
          'mb-4 flex h-16 w-16 items-center justify-center rounded-card',
          partner.type === 'tire_service'
            ? 'bg-accent/10 text-accent'
            : 'bg-primary/10 text-primary',
        )}
      >
        <TypeIcon className="h-8 w-8" />
      </div>

      <span className="text-xs font-medium uppercase tracking-wide text-text-secondary">
        {typeInfo.label}
      </span>
      <h2 className="mt-1 text-lg font-bold text-text-primary">{partner.name}</h2>

      <p className="mt-2 text-sm text-text-secondary">{partner.address}</p>

      <div className="mt-3 flex items-center gap-1">
        <Star className="h-4 w-4 fill-accent text-accent" />
        <span className="text-sm font-medium text-accent">{partner.rating}</span>
      </div>

      {partner.phone && (
        <a
          href={`tel:${partner.phone.replace(/\D/g, '')}`}
          className="mt-4 flex items-center gap-2 text-sm text-primary hover:text-primary-dark"
        >
          <Phone className="h-4 w-4" />
          {partner.phone}
        </a>
      )}

      <a
        href={`https://yandex.ru/maps/?rtext=~${partner.latitude},${partner.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-4 w-full gap-2"
      >
        <Navigation className="h-4 w-4" />
        Построить маршрут
      </a>
    </div>
  );
}
