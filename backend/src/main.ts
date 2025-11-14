import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow frontend to connect
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend listening on http://localhost:${port}`);
}
bootstrap();
