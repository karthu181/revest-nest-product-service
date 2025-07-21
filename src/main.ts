import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { StripUndefinedValidationPipe } from './common/pipes/valdiation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new StripUndefinedValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
