import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  create(postCreateInput: Prisma.PostCreateInput) {
    return this.prismaService.post.create({
      data: postCreateInput,
    });
  }

  findAll() {
    return this.prismaService.post.findMany();
  }

  findOne(id: number) {
    return this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, postUpdateInput: Prisma.PostUpdateInput) {
    return this.prismaService.post.update({
      where: {
        id,
      },
      data: postUpdateInput,
    });
  }

  remove(id: number) {
    return this.prismaService.post.delete({
      where: {
        id,
      },
    });
  }
}
