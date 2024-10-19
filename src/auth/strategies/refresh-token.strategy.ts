import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  REFRESH_TOKEN_MALFORMED_ERROR,
  REFRESH_TOKEN_SECRET,
} from 'src/auth/auth.constants';
import { JWT_REFRESH, REFRESH_TOKEN_COOKIE_NAME } from 'src/constants/auth';
import { JwtPayload, JwtPayloadWithRt } from 'src/types/jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  JWT_REFRESH,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req.cookies[REFRESH_TOKEN_COOKIE_NAME],
      ]),
      secretOrKey: configService.getOrThrow<string>(REFRESH_TOKEN_SECRET),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new ForbiddenException(REFRESH_TOKEN_MALFORMED_ERROR);
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
