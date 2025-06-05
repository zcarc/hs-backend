import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { JwtStrategyTokenPayload } from '../types/auth.types';
import { FindUserIdByUserId } from '../../user/types/user.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const secret = configService.get<string>('JWT_ACCESS_SECRET');
    if (!secret) {
      throw new InternalServerErrorException(
        'JWT_ACCESS_SECRET 환경변수가 설정되지 않았습니다.',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false,
    });
  }

  // super(option) 에서 JWT가 유효하면 호출되는 메서드
  async validate(
    tokenPayload: JwtStrategyTokenPayload,
  ): Promise<FindUserIdByUserId> {
    return await this.userService.findUserIdByUserId(tokenPayload.userId); // req.user에 할당됨 (passport 에서 약속된 키)
  }
}
