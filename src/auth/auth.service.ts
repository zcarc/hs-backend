import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<LoginDto> {
    const { userId, password } = loginDto;
    const user: Prisma.UserCreateInput | null =
      await this.prismaService.user.findUnique({
        where: { userId },
      });

    if (user && (await bcrypt.compare(password, user.password))) {
      return {
        userId: user.userId,
        password: user.password,
      };
    } else {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 올바르지 않습니다.',
      );
    }
  }

  async login(loginDto: LoginDto) {
    const payload = { userId: loginDto.userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: {
        userId: loginDto.userId,
      },
      data: { refreshToken: hashedRefreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.prismaService.user.findUnique({
      where: { userId },
    });
    if (!user) {
      throw new UnauthorizedException('사용자가 존재하지 않습니다.');
    }
    if (!user.refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 존재하지 않습니다.');
    }
    const compared = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!compared) {
      throw new UnauthorizedException('리프레시 토큰이 일치하지 않습니다.');
    }

    // 새 액세스 토큰 발급
    const payload = { userId: user.userId };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
    });
    return { accessToken };
  }
}
