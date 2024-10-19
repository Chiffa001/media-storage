import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthMonitorModule } from './health-monitor/health-monitor.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthMonitorModule],
})
export class AppModule {}
