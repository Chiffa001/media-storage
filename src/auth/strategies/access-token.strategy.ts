import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_SECRET } from 'src/auth/auth.constants';
import { JWT } from 'src/constants/auth';
import { JwtPayload } from 'src/types/jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JWT) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>(ACCESS_TOKEN_SECRET),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
