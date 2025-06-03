import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

import * as bcrypt from 'bcrypt';

import { ForbiddenException } from '@nestjs/common'; 

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(dto: SignupDto) {
    // 이메일 중복 체크
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // DB에 저장
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        nickname: dto.nickname,
      },
    });

    // 비밀번호는 응답에서 제외하고 반환
    const { password, ...result } = user;
    return result;
  }


  async signIn(dto: SigninDto) {
    // 유저 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new ForbiddenException('존재하지 않는 사용자입니다.');
    }

    // 비밀번호 일치 여부 확인
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다.');
    }

    // 로그인 성공
    const { password, ...result } = user;
    return result;
  }



}