import type { AccountType, AuthResponse, Seller, User } from '@tirehub/shared';
import { KRASNOYARSK } from '@tirehub/shared';

export interface RegisterPayload {
  email: string;
  password: string;
  accountType: AccountType;
  phone?: string;
  firstName?: string;
  lastName?: string;
  shopName?: string;
  address?: string;
  description?: string;
}

const API_BASE = {
  catalog: process.env.NEXT_PUBLIC_CATALOG_API ?? 'http://localhost:3002/api',
  consumer: process.env.NEXT_PUBLIC_CONSUMER_API ?? 'http://localhost:3003/api',
  recommendation: process.env.NEXT_PUBLIC_RECOMMENDATION_API ?? 'http://localhost:3004/api',
  core: process.env.NEXT_PUBLIC_CORE_API ?? 'http://localhost:3001',
};

function authHeaders(token?: string | null): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders(),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<AuthResponse>(`${API_BASE.core}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (data: RegisterPayload) =>
      fetchApi<AuthResponse>(`${API_BASE.core}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          city: KRASNOYARSK.city,
          latitude: KRASNOYARSK.latitude,
          longitude: KRASNOYARSK.longitude,
        }),
      }),

    me: (token: string) =>
      fetch(`${API_BASE.core}/auth/me`, {
        headers: authHeaders(token),
      }).then(async (res) => {
        if (!res.ok) throw new Error('unauthorized');
        return res.json() as Promise<User>;
      }),
  },

  admin: {
    getStats: (token: string) =>
      fetchApi(`${API_BASE.core}/admin/stats`, {
        headers: authHeaders(token),
      }),

    getUsers: (token: string) =>
      fetchApi<User[]>(`${API_BASE.core}/admin/users`, {
        headers: authHeaders(token),
      }),

    getSellers: (token: string) =>
      fetchApi<Seller[]>(`${API_BASE.core}/admin/sellers`, {
        headers: authHeaders(token),
      }),

    verifySeller: (token: string, sellerId: string, isVerified: boolean) =>
      fetchApi(`${API_BASE.core}/admin/sellers/${sellerId}/verify`, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify({ isVerified }),
      }),
  },

  catalog: {
    search: (params: Record<string, string | number | undefined>) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          query.set(key, String(value));
        }
      });
      return fetchApi(`${API_BASE.catalog}/search?${query}`);
    },
    getProducts: () => fetchApi(`${API_BASE.catalog}/products`),
    getListings: (params?: Record<string, string | number | undefined>) => {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') query.set(key, String(value));
        });
      }
      return fetchApi(`${API_BASE.catalog}/listings?${query}`);
    },
    getListing: (id: string) => fetchApi(`${API_BASE.catalog}/listings/${id}`),
    getSellers: () => fetchApi(`${API_BASE.catalog}/listings/sellers`),
    getSeller: (id: string) => fetchApi(`${API_BASE.catalog}/listings/sellers/${id}`),
    createListing: (data: Record<string, unknown>) =>
      fetchApi(`${API_BASE.catalog}/listings`, { method: 'POST', body: JSON.stringify(data) }),
  },
  recommendation: {
    getWeather: (region = 'krasnoyarsk') =>
      fetchApi(`${API_BASE.recommendation}/weather?region=${region}`),
    getPopular: () => fetchApi(`${API_BASE.recommendation}/recommendations/popular`),
    getCrossSell: (productId: string) =>
      fetchApi(`${API_BASE.recommendation}/recommendations/cross-sell?productId=${productId}`),
    getWeatherRecommendations: (region = 'krasnoyarsk') =>
      fetchApi(`${API_BASE.recommendation}/weather/recommendations?region=${region}`),
  },
  consumer: {
    getGarage: (userId: string) =>
      fetchApi(`${API_BASE.consumer}/garage?userId=${userId}`),
    addVehicle: (data: Record<string, unknown>) =>
      fetchApi(`${API_BASE.consumer}/garage`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getPartners: () => fetchApi(`${API_BASE.consumer}/partners`).catch(() => mockPartners),
  },
};

const mockPartners = [
  {
    id: '1',
    type: 'store',
    name: 'TireHub Красноярск',
    address: 'ул. Мира, 42, Красноярск',
    latitude: 56.0104,
    longitude: 92.8526,
    rating: 4.7,
    phone: '+7 (391) 123-45-67',
  },
  {
    id: '2',
    type: 'tire_service',
    name: 'Шиномонтаж Сибирь',
    address: 'пр. Мира, 15, Красноярск',
    latitude: 56.018,
    longitude: 92.87,
    rating: 4.5,
    phone: '+7 (391) 987-65-43',
  },
  {
    id: '3',
    type: 'pickup_point',
    name: 'ПВЗ TireHub Юг',
    address: 'ул. 9 Мая, 8, Красноярск',
    latitude: 55.995,
    longitude: 92.89,
    rating: 4.3,
    phone: '+7 (391) 555-12-34',
  },
];

export { mockPartners };
