import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@/env/env-schema';
import { AuthModule } from '@/auth/auth.module';
import { EnvModule } from '@/env/env.module';
import { UsersModule } from '@/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
