import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request, Response } from 'express';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const { method, path, query, body }: Request = ctx.getRequest();
    const { statusCode }: Response = ctx.getResponse();

    this.logger.log(
      `[Request] ${JSON.stringify({ method, path, query, body })}`,
    );

    return next.handle().pipe(
      tap((data) => {
        this.logger.log(
          `[Response] ${JSON.stringify({ method, path, statusCode, data })}`,
        );
      }),
    );
  }
}
