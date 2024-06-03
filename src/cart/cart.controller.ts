import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Get user cart by user ID' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  @Get(':userId')
  async getCart(@Param('userId') userId: string) {
    try {
      return await this.cartService.getCartByUserId(Number(userId));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiOperation({ summary: 'Add product to cart' })
  @ApiResponse({
    status: 201,
    description: 'Product added to cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Product or Cart not found' })
  @Post(':userId/add')
  async addProduct(
    @Param('userId') userId: string,
    @Body() body: { productId: number; quantity: number },
  ) {
    try {
      return await this.cartService.addProductToCart(
        Number(userId),
        body.productId,
        body.quantity,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @ApiOperation({ summary: 'Remove product from cart' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from cart successfully',
  })
  @ApiResponse({ status: 404, description: 'Product or Cart not found' })
  @Delete(':userId/remove/:productId')
  async removeProduct(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    try {
      return await this.cartService.removeProductFromCart(
        Number(userId),
        Number(productId),
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
