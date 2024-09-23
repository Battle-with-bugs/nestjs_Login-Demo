import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const POST = 3000
  const app = await NestFactory.create(AppModule);
  await app.listen(POST, () => {
    console.log(`server listening on post ${POST}`)
  });
}
bootstrap();
