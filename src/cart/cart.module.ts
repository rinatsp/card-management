import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
  imports: [PrismaModule],
})
export class CartModule {}
