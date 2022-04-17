import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { pubsub } from './public-center';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    pubsub.publish('timeChanged', { timeChanged: Date.now() });
    return this.appService.getHello();
  }
}
