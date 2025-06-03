import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ 추가
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 전역 설정을 통해 다른 모듈에서 따로 import 안 해도 됨
    }),
    PrismaModule,
    UserModule,
    PostModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}