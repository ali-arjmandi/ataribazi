import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from 'filters/all-exception.filter';
import path from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const port = 3000;
  await app.listen(port);
  console.info(`Running on port ${port}`);
}

void bootstrap();
