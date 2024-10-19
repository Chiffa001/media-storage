import { Module } from '@nestjs/common';
import { HealthMonitorModule } from './health-monitor/health-monitor.module';

@Module({
  imports: [HealthMonitorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
