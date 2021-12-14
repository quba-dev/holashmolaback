import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 5000;

async function app() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}

app().then(() => console.log(`Server working at http://localhost:${PORT}`));
