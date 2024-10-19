import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH } from 'src/constants/auth';

@Injectable()
export class RefreshTokenGuard extends AuthGuard(JWT_REFRESH) {
  constructor() {
    super();
  }
}
