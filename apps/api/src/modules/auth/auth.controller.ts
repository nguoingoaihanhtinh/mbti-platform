import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
  Query,
  Redirect,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JWTPayload, JwtUtil } from '@/utils/jwt.util';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtUtil: JwtUtil,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { user };
  }

  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    try {
      const payload = this.jwtUtil.verify(refreshToken);
      const accessToken = this.jwtUtil.signAccess(payload);

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
      });

      return { message: 'Token refreshed' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return { success: true };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('google')
  @Redirect()
  googleLogin() {
    const googleAuthUrl = new URL(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
    googleAuthUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID!);
    googleAuthUrl.searchParams.set(
      'redirect_uri',
      `${process.env.API_URL}/auth/google/callback`,
    );
    console.log('REDIRECT:', process.env.API_URL);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    return { url: googleAuthUrl.toString() };
  }

  // 2. Xử lý callback từ Google
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Res() res: Response, // ← removed passthrough since we handle everything
  ) {
    try {
      // 1. Exchange code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          code,
          grant_type: 'authorization_code',
          redirect_uri: `${process.env.API_URL}/auth/google/callback`,
        }),
      });

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', await tokenResponse.text());
        return res.redirect(
          302,
          `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
        );
      }

      const { access_token } = await tokenResponse.json();

      // 2. Fetch user info
      const userResponse = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      if (!userResponse.ok) {
        console.error('Userinfo fetch failed:', await userResponse.text());
        return res.redirect(
          302,
          `${process.env.FRONTEND_URL}/login?error=google_userinfo_failed`,
        );
      }

      const googleUser = await userResponse.json();
      console.log('Google User:', googleUser);

      if (!googleUser.email) {
        console.error('Google user missing email:', googleUser);
        return res.redirect(
          302,
          `${process.env.FRONTEND_URL}/login?error=google_no_email`,
        );
      }

      if (googleUser.email_verified !== true) {
        console.error('Google email not verified:', googleUser.email);
        return res.redirect(
          302,
          `${process.env.FRONTEND_URL}/login?error=google_email_not_verified`,
        );
      }

      let fullName = googleUser.name;
      if (!fullName && googleUser.given_name && googleUser.family_name) {
        fullName = `${googleUser.given_name} ${googleUser.family_name}`;
      }
      if (!fullName) {
        fullName = googleUser.email.split('@')[0];
      }

      let user = await this.userService.findOneByEmail(googleUser.email);
      if (!user) {
        user = await this.userService.create({
          email: googleUser.email,
          full_name: fullName,
          password: 'google_oauth_user',
          role: 'candidate',
        });
      }

      const payload: JWTPayload = { sub: user.id, email: user.email };
      const accessToken = this.jwtUtil.signAccess(payload);
      const refreshToken = this.jwtUtil.signRefresh(payload);

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'mbti-platform.onrender.com',
        path: '/',
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        domain: 'mbti-platform.onrender.com',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect(302, `${process.env.FRONTEND_URL}/assessments`);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect(
        302,
        `${process.env.FRONTEND_URL}/login?error=server_error`,
      );
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'If your email is registered, you’ll receive an OTP.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.otp, dto.newPassword);
    return { message: 'Password updated.' };
  }
}
