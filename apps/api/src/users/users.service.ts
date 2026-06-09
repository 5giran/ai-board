import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // findAll()은 그냥 아직 컨트롤러 수정이 안되어서 남겨둠.
  findAll() {
    return this.userRepository.find();
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  findByNickname(nickname: string) {
    return this.userRepository.findOne({
      where: { nickname },
    });
  }

  createUser(email: string, nickname: string, passwordHash: string) {
    const user = this.userRepository.create({
      email,
      nickname,
      passwordHash,
    });
    return this.userRepository.save(user);
  }
}
