import { ConflictException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { SignupDto } from '../dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async signup(dto: SignupDto) {
    const existingEmail = await this.usersService.findByEmail(dto.email);

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const existingNickname = await this.usersService.findByNickname(
      dto.nickname,
    );

    if (existingNickname) {
      throw new ConflictException('Nickname already exists');
    }

    const passwordHash = await argon2.hash(dto.password);

    return this.usersService.createUser(dto.email, dto.nickname, passwordHash);
  }
}
