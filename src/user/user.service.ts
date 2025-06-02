import { Injectable } from '@nestjs/common';
import { prismaClient } from '../client';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  create(userCreateInput: Prisma.UserCreateInput) {
    return prismaClient.user.create({
      data: userCreateInput,
    });
  }

  findAll() {
    return prismaClient.user.findMany();
  }

  findOne(id: number) {
    return prismaClient.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, userUpdateInput: Prisma.UserUpdateInput) {
    return prismaClient.user.update({
      where: {
        id,
      },
      data: userUpdateInput,
    });
  }

  remove(id: number) {
    return prismaClient.user.delete({
      where: {
        id,
      },
    });
  }
}
