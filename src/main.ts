import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  appService.init('https://www.reddit.com', 5);
  appService.crawl(0);
  await app.close()
}
bootstrap();
