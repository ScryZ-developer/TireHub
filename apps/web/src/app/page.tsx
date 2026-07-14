'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Plus, Store, User, Disc3, CircleDot, Megaphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { SearchBar } from '@/components/search/search-bar';
import { WeatherWidget, WeatherWidgetSkeleton } from '@/components/weather/weather-widget';
import { ListingCard } from '@/components/listings/listing-card';
import { mockListings, MOCK_SELLERS } from '@/lib/marketplace';
import { mockWeather } from '@/lib/mock-data';
import { FadeIn, StaggerGrid, StaggerItem, ScaleOnHover } from '@/components/ui/motion';
import { SellerType } from '@tirehub/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { WeatherInfo } from '@tirehub/shared';

export default function HomePage() {
  const { data: weather, isLoading: weatherLoading } = useQuery<WeatherInfo>({
    queryKey: ['weather'],
    queryFn: () => api.recommendation.getWeather('krasnoyarsk') as Promise<WeatherInfo>,
    placeholderData: mockWeather,
  });

  const freshListings = [...mockListings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const shopCount = MOCK_SELLERS.filter((s) => s.type === SellerType.SHOP).length;
  const privateCount = MOCK_SELLERS.filter((s) => s.type === SellerType.PRIVATE).length;

  return (
    <div className="mx-auto max-w-7xl px-4">
      <FadeIn className="mb-6">
        <SearchBar />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="card mb-8 overflow-hidden bg-gradient-to-br from-primary to-primary-dark p-6 text-white md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Маркетплейс шин и дисков
              </h1>
              <p className="mt-2 max-w-lg text-white/80">
                Покупайте и продавайте как на Авито — {shopCount} магазинов и {privateCount} частных продавцов уже на платформе
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/listings/new" className="inline-flex items-center gap-2 rounded-button bg-accent px-5 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
                  <Plus className="h-4 w-4" />
                  Разместить объявление
                </Link>
                <Link href="/catalog" className="inline-flex items-center gap-2 rounded-button bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/30">
                  Смотреть объявления
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <Stat icon={Store} label="Магазины" value={shopCount} />
              <Stat icon={User} label="Частники" value={privateCount} />
              <Stat label="Объявления" value={mockListings.length} />
            </div>
          </div>
        </div>
      </FadeIn>

      <section className="mb-8">
        {weatherLoading ? (
          <WeatherWidgetSkeleton />
        ) : weather ? (
          <WeatherWidget
            temperature={weather.temperature}
            condition={weather.condition}
            state={weather.state}
            city={weather.city}
          />
        ) : null}
      </section>

      <section className="mb-8">
        <FadeIn delay={0.1}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Свежие объявления</h2>
            <Link href="/catalog" className="group flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark">
              Все объявления
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
        <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
          {freshListings.map((listing) => (
            <StaggerItem key={listing.id}>
              <ListingCard listing={listing} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <StaggerGrid className="grid gap-4 md:grid-cols-3">
        {(
          [
            {
              href: '/catalog?type=tire',
              icon: Disc3,
              title: 'Шины',
              desc: 'От магазинов и частников по всей России',
            },
            {
              href: '/catalog?type=wheel',
              icon: CircleDot,
              title: 'Диски',
              desc: 'Фильтр по разболтовке и диаметру',
            },
            {
              href: '/listings/new',
              icon: Megaphone,
              title: 'Продать',
              desc: 'Разместите объявление бесплатно за 2 минуты',
            },
          ] as { href: string; icon: LucideIcon; title: string; desc: string }[]
        ).map((card) => {
          const Icon = card.icon;
          return (
            <StaggerItem key={card.href}>
              <ScaleOnHover>
                <Link href={card.href} className="card block p-6">
                  <motion.span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    whileHover={{ scale: 1.08 }}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </motion.span>
                  <h3 className="mt-3 text-lg font-bold text-text-primary">{card.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{card.desc}</p>
                </Link>
              </ScaleOnHover>
            </StaggerItem>
          );
        })}
      </StaggerGrid>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Store;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-card bg-white/10 px-4 py-3 text-center backdrop-blur">
      {Icon && <Icon className="mx-auto h-5 w-5 text-white/80" />}
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="text-xs text-white/70">{label}</p>
    </div>
  );
}
