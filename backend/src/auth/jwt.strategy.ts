import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ 헤더에서 Bearer 토큰 추출
      ignoreExpiration: false, // 토큰 만료 검사 활성화
      secretOrKey: configService.get<string>('JWT_SECRET'), // 환경변수에서 시크릿키 가져옴
    });
  }

  async validate(payload: any) {
    // ✅ 이 payload는 login 시 만든 { sub, nickname }
    return { id: payload.sub, nickname: payload.nickname };
  }
}