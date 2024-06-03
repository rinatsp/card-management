import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      await this.prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data,
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.delete({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
