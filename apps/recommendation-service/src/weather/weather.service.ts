import { Injectable } from '@nestjs/common';
import {
  RecommendationBlock,
  TireSeason,
  WeatherInfo,
  WeatherState,
} from '@tirehub/shared';
import { MOCK_PRODUCTS } from '../recommendations/mock-products';

interface RegionWeatherProfile {
  city: string;
  temperature: number;
  condition: string;
  state: WeatherState;
}

const REGION_WEATHER: Record<string, RegionWeatherProfile> = {
  moscow: {
    city: 'Москва',
    temperature: -8,
    condition: 'Снег',
    state: WeatherState.COLD,
  },
  'saint-petersburg': {
    city: 'Санкт-Петербург',
    temperature: -5,
    condition: 'Облачно',
    state: WeatherState.COLD,
  },
  novosibirsk: {
    city: 'Новосибирск',
    temperature: -15,
    condition: 'Метель',
    state: WeatherState.COLD,
  },
  sochi: {
    city: 'Сочи',
    temperature: 12,
    condition: 'Дождь',
    state: WeatherState.WARNING,
  },
  kazan: {
    city: 'Казань',
    temperature: 3,
    condition: 'Пасмурно',
    state: WeatherState.WARNING,
  },
  rostov: {
    city: 'Ростов-на-Дону',
    temperature: 8,
    condition: 'Ветрено',
    state: WeatherState.WARNING,
  },
  ekaterinburg: {
    city: 'Екатеринбург',
    temperature: 22,
    condition: 'Ясно',
    state: WeatherState.SUMMER,
  },
  samara: {
    city: 'Самара',
    temperature: 28,
    condition: 'Солнечно',
    state: WeatherState.SUMMER,
  },
  volgograd: {
    city: 'Волгоград',
    temperature: 35,
    condition: 'Жара',
    state: WeatherState.HEAT,
  },
  krasnodar: {
    city: 'Краснодар',
    temperature: 38,
    condition: 'Зной',
    state: WeatherState.HEAT,
  },
};

const DEFAULT_REGION = 'moscow';

@Injectable()
export class WeatherService {
  getWeather(region?: string): WeatherInfo {
    const key = this.normalizeRegion(region);
    const profile = REGION_WEATHER[key] ?? REGION_WEATHER[DEFAULT_REGION];

    return {
      temperature: profile.temperature,
      condition: profile.condition,
      state: profile.state,
      city: profile.city,
    };
  }

  getTireRecommendations(region?: string): RecommendationBlock {
    const weather = this.getWeather(region);
    const products = this.selectProductsForState(weather.state);

    return {
      id: 'weather-recommendations',
      title: this.getTitleForState(weather.state, weather.city),
      type: 'weather',
      products,
    };
  }

  private normalizeRegion(region?: string): string {
    if (!region) {
      return DEFAULT_REGION;
    }

    return region.toLowerCase().trim().replace(/\s+/g, '-');
  }

  private selectProductsForState(state: WeatherState) {
    const seasonMap: Record<WeatherState, TireSeason[]> = {
      [WeatherState.COLD]: [TireSeason.WINTER],
      [WeatherState.WARNING]: [TireSeason.ALL_SEASON, TireSeason.WINTER],
      [WeatherState.SUMMER]: [TireSeason.SUMMER, TireSeason.ALL_SEASON],
      [WeatherState.HEAT]: [TireSeason.SUMMER],
    };

    const preferredSeasons = seasonMap[state];
    const matched = MOCK_PRODUCTS.filter((product) => {
      const name = product.name.toLowerCase();
      if (preferredSeasons.includes(TireSeason.WINTER)) {
        return (
          name.includes('winter') ||
          name.includes('blizzak') ||
          name.includes('hakka')
        );
      }
      if (preferredSeasons.includes(TireSeason.SUMMER)) {
        return (
          name.includes('pilot') ||
          name.includes('advan') ||
          name.includes('p zero')
        );
      }
      return name.includes('vector') || name.includes('kinergy');
    });

    return (matched.length > 0 ? matched : MOCK_PRODUCTS).slice(0, 4);
  }

  private getTitleForState(state: WeatherState, city: string): string {
    const titles: Record<WeatherState, string> = {
      [WeatherState.COLD]: `Зимние шины для ${city}`,
      [WeatherState.WARNING]: `Всесезонные шины для ${city}`,
      [WeatherState.SUMMER]: `Летние шины для ${city}`,
      [WeatherState.HEAT]: `Шины для жаркой погоды в ${city}`,
    };

    return titles[state];
  }
}
