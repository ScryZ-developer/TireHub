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
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  getCart(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  addItem(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(userId, dto);
  }

  @Patch(':userId/items/:productId')
  updateItem(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(userId, productId, dto.quantity);
  }

  @Delete(':userId/items/:productId')
  removeItem(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete(':userId')
  clearCart(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.cartService.clearCart(userId);
  }
}
