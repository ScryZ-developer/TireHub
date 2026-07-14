import { Controller, Get, Query } from '@nestjs/common';
import { RecommendationBlock } from '@tirehub/shared';
import { RecommendationsService } from './recommendations.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get('cross-sell')
  getCrossSell(
    @Query('productId') productId?: string,
  ): RecommendationBlock {
    return this.recommendationsService.getCrossSell(productId);
  }

  @Get('recently-viewed')
  getRecentlyViewed(
    @Query('userId') userId?: string,
  ): RecommendationBlock {
    return this.recommendationsService.getRecentlyViewed(userId);
  }

  @Get('popular')
  getPopular(): RecommendationBlock {
    return this.recommendationsService.getPopular();
  }
}
