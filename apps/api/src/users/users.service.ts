import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    { id: 1, name: 'Vaporeon' },
    { id: 2, name: 'Jolteon' },
  ];

  findAll() {
    return this.users;
  }
}
