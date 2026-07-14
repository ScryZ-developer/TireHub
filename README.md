# TireHub

Маркетплейс шин и дисков — платформа для магазинов и частных продавцов (модель Авито / Дром).

## Концепция

TireHub
- **Магазины** размещают объявления с каталогом шин и дисков
- **Частники** продают б/у и новые комплекты
- Покупатели фильтруют по городу, продавцу, состоянию, разболтовке
- Связь с продавцом по телефону или через корзину

## Архитектура

```
TireHub/
├── apps/
│   ├── web/                    # Next.js — маркетплейс UI
│   ├── core-service/           # Auth, роли, уведомления
│   ├── catalog-service/        # Products + Listings API
│   ├── consumer-service/       # Корзина, заказы, гараж
│   └── recommendation-service/ # Рекомендации, погода
├── packages/shared/            # Seller, Listing, типы маркетплейса
└── database/init.sql           # sellers, listings, products
```

## Модель данных маркетплейса

| Сущность | Описание |
|----------|----------|
| `sellers` | Магазин или частное лицо |
| `listings` | Объявление: цена, город, состояние, фото, характеристики |
| `products` | Справочник / шаблоны (опционально) |
| `partners` | ПВЗ и шиномонтажи на карте |

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js, Tailwind, Zustand, React Query, Framer Motion |
| Backend | NestJS, TypeScript |
| БД | PostgreSQL, Redis, Elasticsearch |
| Очереди | RabbitMQ |

## Быстрый старт

```bash
docker compose up -d
npm install
npm run dev:web          # http://localhost:3000
npm run dev:core         # Auth API :3001
npm run dev:catalog      # Listings API :3002/api/listings
```

> После изменений схемы БД: `docker compose down -v && docker compose up -d`

## Аккаунты и геолокация

Регион по умолчанию — **Красноярск** (56.0153, 92.8932). GPS-определение доступно в личном кабинете.

| Email | Пароль | Роль |
|-------|--------|------|
| admin@tirehub.ru | admin123 | Админ |
| shop@tirehub.ru | demo1234 | Магазин |
| private@tirehub.ru | demo1234 | Частник |

При регистрации выбирается тип: **частник** (имя, фамилия) или **магазин** (название, адрес, описание). Данные гаража и объявлений сохраняются в аккаунте.

## Ключевые страницы

| URL | Описание |
|-----|----------|
| `/catalog` | Все объявления с фильтрами |
| `/listing/[id]` | Карточка объявления |
| `/seller/[id]` | Профиль продавца |
| `/listings/new` | Разместить объявление |
| `/listings/my` | Мои объявления |
| `/login` | Вход |
| `/register` | Регистрация (частник / магазин) |
| `/account` | Личный кабинет |
| `/admin` | Админ-панель |

## API Auth (core-service)

| Method | Path | Описание |
|--------|------|----------|
| POST | `/auth/register` | Регистрация (private / shop) |
| POST | `/auth/login` | Вход |
| GET | `/auth/me` | Профиль (Bearer token) |
| GET | `/admin/stats` | Статистика (admin) |
| GET | `/admin/sellers` | Список продавцов (admin) |
| PATCH | `/admin/sellers/:id/verify` | Верификация магазина (admin) |

## API Listings (catalog-service)

| Method | Path | Описание |
|--------|------|----------|
| GET | `/api/listings` | Список объявлений |
| GET | `/api/listings/:id` | Объявление |
| POST | `/api/listings` | Создать объявление |
| GET | `/api/listings/sellers` | Все продавцы |
| GET | `/api/listings/sellers/:id/listings` | Объявления продавца |
