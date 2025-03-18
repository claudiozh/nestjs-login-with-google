import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '@/auth/auth.controller';
import { GoogleStrategy } from '@/auth/strategies/google.strategy';
import { EnvService } from '@/env/env.service';
import { AuthService } from '@/auth/auth.service';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (envService: EnvService) => ({
        secret: envService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [EnvService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [],
})
export class AuthModule {}
