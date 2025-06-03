import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS 설정 (Next.js 프론트와 연결 위해)
  app.enableCors({
    origin: 'http://localhost:3000', // Next.js dev server
    credentials: true, // 필요한 경우 (ex. 쿠키 전송 등)
  });

  // ✅ 전역 유효성 검사 파이프
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값 제거
      forbidNonWhitelisted: true, // 허용되지 않은 값이면 에러
      transform: true, // payload 자동 형변환
    }),
  );

  await app.listen(3001);
}
bootstrap();