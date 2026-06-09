import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return 'signup';
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return 'login';
  }
}
