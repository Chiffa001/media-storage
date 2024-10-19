import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { SignInAuthDto } from 'src/auth/dto/SignInAuthDto';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from 'src/auth/dto/RegisterAuthDto';
import { compare, hash } from 'bcrypt';
import { Tokens } from 'src/types/tokens';
import { JwtPayload } from 'src/types/jwt';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_DENIED_ERROR,
  ACCESS_TOKEN_SECRET,
  ALREADY_USER_EXIST_ERROR,
  INCORRECT_LOGIN_OR_PASSWORD_ERROR,
  REFRESH_TOKEN_SECRET,
} from './auth.constants';
import { AuthRepository } from './auth.repository';

const SALT = 6;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async registerLocal({ email, password, name, surname }: RegisterAuthDto) {
    const oldUser = await this.getUserByEmail(email);

    if (oldUser) {
      throw new BadRequestException(ALREADY_USER_EXIST_ERROR);
    }

    const hashedPassword = await hash(password, SALT);
    const user = await this.authRepository.create({
      email,
      name,
      surname,
      passwordHash: hashedPassword,
    });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async signInLocal({ email, password }: SignInAuthDto) {
    const user = await this.getUserByEmail(email);

    if (!user) {
      throw new ForbiddenException(INCORRECT_LOGIN_OR_PASSWORD_ERROR);
    }

    const passwordMatches = await compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new ForbiddenException(INCORRECT_LOGIN_OR_PASSWORD_ERROR);
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    await this.authRepository.clearRt(userId);
  }

  private async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow<string>(ACCESS_TOKEN_SECRET),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.getOrThrow<string>(REFRESH_TOKEN_SECRET),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hashedRefresh = await hash(rt, SALT);
    await this.authRepository.updateRt(userId, hashedRefresh);
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.authRepository.getById(userId);

    if (!user || !user.hashedRt) {
      throw new ForbiddenException(ACCESS_DENIED_ERROR);
    }

    const rtMatches = await compare(rt, user.hashedRt);
    if (!rtMatches) {
      throw new ForbiddenException(ACCESS_DENIED_ERROR);
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return tokens;
  }

  private async getUserByEmail(email: string) {
    return this.authRepository.getByEmail(email);
  }
}
