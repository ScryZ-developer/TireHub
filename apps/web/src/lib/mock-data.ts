import { WeatherState } from '@tirehub/shared';

export { mockProducts } from './products';

export const mockWeather = {
  temperature: -5,
  condition: 'Облачно, снег',
  state: WeatherState.COLD,
  city: 'Красноярск',
};
