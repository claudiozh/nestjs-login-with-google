import { AuthService } from '@/auth/auth.service';
import { EnvService } from '@/env/env.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    envService: EnvService,
  ) {
    super({
      clientID: envService.get('GOOGLE_CLIENT_ID'),
      clientSecret: envService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: envService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, refreshToken: string, profile: any) {
    const user = await this.authService.findOrCreateUserByGoogle({
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      avatarUrl: profile.photos[0].value,
    });

    return user;
  }
}
