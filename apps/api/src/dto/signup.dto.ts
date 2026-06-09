import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;
  @IsString()
  nickname!: string;
  @MinLength(8)
  password!: string;
}
