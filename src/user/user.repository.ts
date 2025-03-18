import { Injectable } from '@nestjs/common';
import { UserEntity } from '@/user/user.entity';

@Injectable()
export class UsersRepository {
  private users: UserEntity[] = [];

  async findAll() {
    return this.users;
  }

  async findById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async save(user: UserEntity) {
    this.users.push(user);
  }

  async delete(id: string) {
    this.users = this.users.filter((user) => user.id !== id);
  }
}
