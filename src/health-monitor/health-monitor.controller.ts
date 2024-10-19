import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';

@Controller('health')
export class HealthMonitorController {
  @Public()
  @Get('/')
  check() {
    return { message: "I'm healthy!" };
  }
}
