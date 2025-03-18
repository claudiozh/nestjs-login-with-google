import { UserEntity } from '@/user/user.entity';
import { UsersRepository } from '@/user/user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';

interface IUserGoogle {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async login(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async findOrCreateUserByGoogle(user: IUserGoogle): Promise<UserEntity> {
    const userExists = await this.usersRepository.findByEmail(user.email);

    if (userExists) {
      return userExists;
    }

    const id = randomUUID();

    await this.usersRepository.save({
      id,
      name: user.firstName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    });

    return this.usersRepository.findById(id);
  }
}
