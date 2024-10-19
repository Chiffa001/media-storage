import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { LoggerInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggerInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
