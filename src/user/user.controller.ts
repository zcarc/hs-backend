import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { JwtStrategyResponse } from '../auth/types/auth.types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() userCreateInput: Prisma.UserCreateInput) {
    return this.userService.create(userCreateInput);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  findProfile(@Request() req: JwtStrategyResponse) {
    // validate()에서 반환된 객체가 req에 들어 있음
    return {
      userId: req.user.userId,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() userUpdateInput: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(+id, userUpdateInput);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
