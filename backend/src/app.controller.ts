import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('message')
  getMessage() {
    return { text: 'Hello from NestJS Backend!' };
  }
}
