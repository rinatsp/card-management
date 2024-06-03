import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartByUserId(userId: number): Promise<Cart | null> {
    try {
      const cart = await this.prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!cart) {
        throw new NotFoundException(
          `Cart for user with ID ${userId} not found`,
        );
      }
      return cart;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async addProductToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.upsert({
        where: { userId },
        update: {
          items: {
            upsert: {
              where: {
                cartId_productId: {
                  cartId: (
                    await this.prisma.cart.findUnique({ where: { userId } })
                  )?.id,
                  productId,
                },
              },
              update: { quantity: { increment: quantity } },
              create: { productId, quantity },
            },
          },
        },
        create: {
          user: { connect: { id: userId } },
          items: {
            create: { productId, quantity },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeProductFromCart(
    userId: number,
    productId: number,
  ): Promise<Cart> {
    try {
      const cart = await this.prisma.cart.update({
        where: { userId },
        data: {
          items: {
            delete: {
              cartId_productId: {
                cartId: (
                  await this.prisma.cart.findUnique({ where: { userId } })
                )?.id,
                productId,
              },
            },
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      return cart;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
