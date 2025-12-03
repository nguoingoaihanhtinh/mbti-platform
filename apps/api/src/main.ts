import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // Configure CORS for both development and production
  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? [
          'https://your-frontend-domain.com', // Replace with your actual frontend URL
          'https://mbti-web.onrender.com', // Example Render frontend URL
        ]
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
