import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  // Configure CORS for both development and production
  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? [
          process.env.FRONTEND_URL,
          'https://mbti-platform-web.vercel.app',
        ].filter(Boolean)
      : ['http://localhost:5173', 'http://localhost:3000'];

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  // Use PORT from environment or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}
bootstrap();
