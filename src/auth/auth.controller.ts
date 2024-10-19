import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInAuthDto } from 'src/auth/dto/SignInAuthDto';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { REFRESH_TOKEN_COOKIE_NAME } from 'src/constants/auth';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from 'src/auth/dto/RegisterAuthDto';
import { Response } from 'express';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/register')
  @HttpCode(HttpStatus.CREATED)
  async registerLocal(
    @Body() dto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.registerLocal(dto);

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
    });

    return { accessToken };
  }

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async loginLocal(
    @Body() dto: SignInAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.signInLocal(dto);
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
    });
    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } = await this.authService.refreshTokens(
      userId,
      rt,
    );

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
    });

    return {
      accessToken,
    };
  }
}
