import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [PostController],
  providers: [PostService, JwtStrategy],
})
export class PostModule {}