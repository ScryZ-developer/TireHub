import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dto/update-product-attribute.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  @Get(':id/attributes')
  findAttributes(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productsService.findAttributes(productId);
  }

  @Post(':id/attributes')
  createAttributes(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: CreateProductAttributeDto,
  ) {
    return this.productsService.createAttributes(productId, dto);
  }

  @Patch(':id/attributes')
  updateAttributes(
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateProductAttributeDto,
  ) {
    return this.productsService.updateAttributes(productId, dto);
  }

  @Delete(':id/attributes')
  removeAttributes(@Param('id', ParseUUIDPipe) productId: string) {
    return this.productsService.removeAttributes(productId);
  }
}
