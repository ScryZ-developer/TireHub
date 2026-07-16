# TireHub

Маркетплейс шин и дисков. Здесь магазины и частные продавцы размещают объявления, а покупатели ищут комплекты по городу, размеру, сезону и разболтовке - в духе Авито или Дрома, но только по шинам и дискам.

Сайт даёт каталог с фильтрами, карточки объявлений, профили продавцов, корзину и оформление заказа. Можно позвонить продавцу напрямую. В личном кабинете - аватар, геолокация и гараж с вашими автомобилями. При регистрации выбирается тип аккаунта: частник или магазин. Регион по умолчанию - Красноярск.

## Стек

| Слой | Технологии |
|------|------------|
| Frontend | Next.js, Tailwind, Zustand |
| Backend | NestJS (auth, каталог, заказы, рекомендации) |
| Инфраструктура | PostgreSQL, Redis, Elasticsearch, RabbitMQ |

Монорепозиторий: `apps/web`, сервисы в `apps/*`, общие типы в `packages/shared`, схема БД - `database/init.sql`.

## Запуск

Нужны **Node.js 20+** и **Docker Desktop**. Сначала поднимите инфраструктуру, затем auth-сервис, затем сайт.

```bash
docker compose up -d
npm install
npm run build --workspace=@tirehub/shared
npm run build --workspace=@tirehub/core-service

# терминал 1
npm run start:prod --workspace=@tirehub/core-service

# терминал 2
npm run dev:web
```

- Сайт: http://localhost:3000  
- Auth API: http://localhost:3001  

После правок `database/init.sql` пересоздайте тома: `docker compose down -v && docker compose up -d`.

## Демо-аккаунты

| Email | Пароль | Роль |
|-------|--------|------|
| admin@tirehub.ru | admin123 | Админ |
| shop@tirehub.ru | demo1234 | Магазин |
| private@tirehub.ru | demo1234 | Частник |

## Страницы

| URL | Назначение |
|-----|------------|
| `/catalog` | Объявления и фильтры |
| `/listing/[id]` | Карточка объявления |
| `/listings/new` | Создать объявление |
| `/listings/my` | Мои объявления |
| `/seller/[id]` | Профиль продавца |
| `/account` | Личный кабинет |
| `/garage` | Гараж |
| `/partners` | ПВЗ и шиномонтажи |
| `/cart`, `/checkout` | Корзина и заказ |
| `/login`, `/register` | Вход и регистрация |
| `/admin` | Админ-панель |
