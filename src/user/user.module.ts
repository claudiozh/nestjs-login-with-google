import { Module } from '@nestjs/common';
import { UsersRepository } from '@/user/user.repository';

@Module({
  providers: [UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
