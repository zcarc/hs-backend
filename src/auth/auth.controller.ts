import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { RefreshRequest } from './types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    return this.authService.login(user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(@Req() request: RefreshRequest) {
    const { userId, refreshToken } = request.refreshPayload;
    return await this.authService.refresh(userId, refreshToken);
  }
}
