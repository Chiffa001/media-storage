import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthMonitorController {
  @Get('/')
  check() {
    return { message: "I'm healthy!" };
  }
}
