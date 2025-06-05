import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtVerifyPayload, RefreshRequest } from '../types/auth.types';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RefreshRequest>();

    const refreshToken = request.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 입력되지 않았습니다.');
    }

    try {
      const { userId }: JwtVerifyPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      );
      request.refreshPayload = {
        userId,
        refreshToken,
      };
      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('리프레시 토큰 유효성 검증 실패');
    }
  }
}
