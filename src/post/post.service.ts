import { Injectable } from '@nestjs/common';
import { prismaClient } from '../client';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  create(postCreateInput: Prisma.PostCreateInput) {
    return prismaClient.post.create({
      data: postCreateInput,
    });
  }

  findAll() {
    return prismaClient.post.findMany();
  }

  findOne(id: number) {
    return prismaClient.post.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, postUpdateInput: Prisma.PostUpdateInput) {
    return prismaClient.user.update({
      where: {
        id,
      },
      data: postUpdateInput,
    });
  }

  remove(id: number) {
    return prismaClient.post.delete({
      where: {
        id,
      },
    });
  }
}
