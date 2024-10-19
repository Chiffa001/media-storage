import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number =>
    (context.switchToHttp().getRequest().user as JwtPayload).sub,
);
