import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationBlock, WeatherInfo } from '@tirehub/shared';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getWeather(@Query('region') region?: string): WeatherInfo {
    return this.weatherService.getWeather(region);
  }

  @Get('recommendations')
  getTireRecommendations(
    @Query('region') region?: string,
  ): RecommendationBlock {
    return this.weatherService.getTireRecommendations(region);
  }
}
