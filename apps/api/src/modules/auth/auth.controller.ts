import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
  UnauthorizedException,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyRegisterOtpDto,
} from './dto/auth.dto';
import { JWTPayload, JwtUtil } from '@/utils/jwt.util';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { UpdateProfileDto } from '../user/dto/update-profile.dto';

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
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { user };
  }

  @Post('login/otp')
  async sendLoginOtp(@Body('email') email: string) {
    await this.authService.sendLoginOtp(email);
    return { message: 'OTP sent to your email' };
  }

  @Post('login/verify')
  async verifyLoginOtp(
    @Body() { email, otp }: { email: string; otp: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const isValid = await this.authService.verifyOtp(email, otp, 'login');
    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
    };
    const accessToken = this.jwtUtil.signAccess(payload);
    const refreshToken = this.jwtUtil.signRefresh(payload);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    const { password: _, ...safeUser } = user;
    return { user: safeUser };
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
      const isProd = process.env.NODE_ENV === 'production';
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/',
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
  async getProfile(@Req() req: Request) {
    const userId = req.user.sub;

    // Fetch basic user
    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const profile = await this.userService.getUserProfile(userId);

    return {
      user: {
        ...user,
        profile: profile || null,
      },
    };
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
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body() updateDto: UpdateProfileDto,
  ) {
    const userId = req.user.sub;

    if (updateDto.full_name || updateDto.email) {
      await this.userService.updateProfile(userId, {
        full_name: updateDto.full_name,
        email: updateDto.email,
      });
    }

    if (
      updateDto.education ||
      updateDto.experience ||
      updateDto.social_links ||
      updateDto.about
    ) {
      await this.userService.updateUserProfile(userId, {
        education: updateDto.education,
        experience: updateDto.experience,
        social_links: updateDto.social_links,
        about: updateDto.about,
      });
    }

    const user = await this.userService.findOneById(userId);
    const profile = await this.userService.getUserProfile(userId);

    return {
      user: {
        ...user,
        profile: profile || {
          education: '',
          experience: '',
          social_links: {},
          about: '',
        },
      },
    };
  }

  @Post('register/otp')
  async sendRegisterOtp(@Body('email') email: string) {
    await this.authService.sendRegisterOtp(email);
    return { message: 'OTP sent to your email' };
  }

  @Post('register/verify')
  async verifyRegisterOtp(@Body() dto: VerifyRegisterOtpDto) {
    const { email, otp, full_name, password } = dto;

    const user = await this.authService.verifyRegisterOtp(email, otp, {
      full_name,
      password,
    });

    return { user };
  }
}
