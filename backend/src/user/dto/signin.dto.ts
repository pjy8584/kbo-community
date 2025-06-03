// src/user/dto/signin.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}