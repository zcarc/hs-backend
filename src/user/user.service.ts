import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FindUserIdByUserId } from './types/user.types';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userCreateInput: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(userCreateInput.password, 10);
    return this.prismaService.user.create({
      data: {
        userId: userCreateInput.userId,
        password: hashedPassword,
        email: userCreateInput.email,
        name: userCreateInput.name,
      },
    });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  findOne(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  // userId로 사용자를 찾아서 userId를 반환
  async findUserIdByUserId(userId: string): Promise<FindUserIdByUserId> {
    const user: Prisma.UserCreateInput | null =
      await this.prismaService.user.findUnique({
        where: { userId },
      });
    if (!user) {
      throw new UnauthorizedException('해당 유저를 찾을 수 없습니다.');
    }
    return {
      userId: user.userId,
    };
  }

  update(id: number, userUpdateInput: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: userUpdateInput,
    });
  }

  remove(id: number) {
    return this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
