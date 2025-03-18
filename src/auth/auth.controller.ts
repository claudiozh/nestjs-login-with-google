import { EnvService } from '@/env/env.service';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { RoutePublic } from '@/auth/decorators/route-public.decorator';
import { GoogleAuthGuard } from '@/auth/guards/google-auth.guard';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
  ) {}

  @RoutePublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  async googleLogin() {}

  @RoutePublic()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    const { accessToken } = await this.authService.login(req.user.id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.redirect(this.envService.get('FRONTEND_URL'));
  }
}
