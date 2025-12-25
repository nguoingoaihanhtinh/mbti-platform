import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('MBTI Platform API')
    .setDescription('API documentation for MBTI Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const corsOrigin =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL, 'https://mbti-platform-web.vercel.app']
          .filter(Boolean)
          .map((url) => url?.trim())
      : ['http://localhost:5173'];

  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
  console.log(`Application is running on port ${port}`);
}
bootstrap();
