'use client';

import { motion } from 'framer-motion';
import { Cloud, Snowflake, Sun, ThermometerSun, AlertTriangle } from 'lucide-react';
import { WeatherState } from '@tirehub/shared';
import clsx from 'clsx';

interface WeatherWidgetProps {
  temperature: number;
  condition: string;
  state: WeatherState;
  city: string;
}

const stateConfig: Record<
  WeatherState,
  { bg: string; icon: typeof Sun; label: string }
> = {
  [WeatherState.COLD]: {
    bg: 'bg-weather-cold',
    icon: Snowflake,
    label: 'Холодно',
  },
  [WeatherState.WARNING]: {
    bg: 'bg-weather-warning',
    icon: AlertTriangle,
    label: 'Пора менять резину',
  },
  [WeatherState.SUMMER]: {
    bg: 'bg-weather-summer',
    icon: Sun,
    label: 'Лето',
  },
  [WeatherState.HEAT]: {
    bg: 'bg-weather-heat',
    icon: ThermometerSun,
    label: 'Жара',
  },
};

export function WeatherWidget({
  temperature,
  condition,
  state,
  city,
}: WeatherWidgetProps) {
  const config = stateConfig[state] ?? stateConfig[WeatherState.SUMMER];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
      className={clsx(
        'card flex items-center gap-4 p-4 transition-colors',
        config.bg,
      )}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-white/60"
      >
        <Icon className="h-7 w-7 text-primary" />
      </motion.div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={temperature}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-text-primary"
          >
            {temperature > 0 ? '+' : ''}
            {temperature}°C
          </motion.span>
          <span className="text-sm text-text-secondary">{city}</span>
        </div>
        <p className="text-sm text-text-secondary">{condition}</p>
        <span className="mt-1 inline-block text-xs font-medium text-primary">
          {config.label}
        </span>
      </div>
      <Cloud className="h-8 w-8 animate-pulse-soft text-primary/30" />
    </motion.div>
  );
}

export function WeatherWidgetSkeleton() {
  return (
    <div className="card animate-pulse p-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-4 w-40 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
