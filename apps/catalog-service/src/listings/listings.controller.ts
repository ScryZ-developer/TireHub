import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingQueryDto,
} from './dto/listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(@Query() query: ListingQueryDto) {
    return this.listingsService.findAll(query);
  }

  @Get('sellers')
  findSellers() {
    return this.listingsService.findSellers();
  }

  @Get('sellers/:id')
  findSeller(@Param('id') id: string) {
    return this.listingsService.findSeller(id);
  }

  @Get('sellers/:id/listings')
  findBySeller(@Param('id') sellerId: string) {
    return this.listingsService.findBySeller(sellerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateListingDto) {
    return this.listingsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listingsService.remove(id);
  }
}
