import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.prisma.product.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
