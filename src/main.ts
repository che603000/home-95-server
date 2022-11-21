import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { starBot } from './bot';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
}

bootstrap()
  //.then(() => starBot())
  .catch((err: Error) => console.error(err));
