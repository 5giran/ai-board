import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('인증 정보가 올바르지 않습니다.');
    }

    const isPasswordValid = await argon2.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('인증 정보가 올바르지 않습니다.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
    };
  }

  async signup(dto: SignupDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);

    if (existingEmail) {
      throw new ConflictException('이미 사용하고 있는 이메일입니다.');
    }

    const existingNickname = await this.usersService.findByNickname(
      dto.nickname,
    );

    if (existingNickname) {
      throw new ConflictException('이미 사용하고 있는 닉네임입니다.');
    }

    const passwordHash = await argon2.hash(dto.password);

    const user = await this.usersService.createUser(
      dto.email,
      dto.nickname,
      passwordHash,
    );

    // user 전체를 반환하지 않고, 필드를 골라서 반환하게 함: passwordHash가 나가지 않음.
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      createAt: user.createAt,
    };
  }
}
