import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RecommendationsModule } from './recommendations/recommendations.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RecommendationsModule,
    WeatherModule,
  ],
})
export class AppModule {}
