import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthMonitorModule } from './health-monitor/health-monitor.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), HealthMonitorModule, DatabaseModule],
})
export class AppModule {}
