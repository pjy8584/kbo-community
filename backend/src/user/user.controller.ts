import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signUp(@Body() signupDto: SignupDto) {
    console.log('📥 받은 회원가입 데이터:', signupDto)
    return this.userService.signUp(signupDto);
  }

  @Post('signin')
  async signIn(@Body() signinDto: SigninDto) {
    console.log('📥 받은 로그인 데이터:', signinDto); 
    return this.userService.signIn(signinDto);
  }
}