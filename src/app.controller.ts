import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('XFttRJd*qzQPsLpgB2z.XiJo')
  execute(query) {
    return this.appService.process(query);
  }
}
