import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtUtil, JWTPayload } from '@/utils/jwt.util';
import { SupabaseProvider } from '@/database/supabase.provider';
import * as crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/email';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtUtil: JwtUtil,
    private supabase: SupabaseProvider,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, full_name } = registerDto;

    const existing = await this.userService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      email,
      full_name,
      password: hashed,
      role: 'candidate',
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JWTPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtUtil.signAccess(payload);
    const refreshToken = this.jwtUtil.signRefresh(payload);

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
  async forgotPassword(email: string) {
    console.log('forgotPassword called with email:', email);

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      console.log('Email not found in DB');
      return;
    }
    console.log('User found, generating OTP...');

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.supabase.client
      .from('password_reset_otp')
      .upsert({ email, otp, expires_at: expiresAt.toISOString() });

    console.log('OTP saved to DB');

    try {
      await sendPasswordResetEmail(email, otp);
      console.log('Email sent via Resend');
    } catch (err) {
      console.error('Resend error:', err);
      throw new BadRequestException('Failed to send email');
    }
  }

  async resetPassword(otp: string, newPassword: string) {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase.client
      .from('password_reset_otp')
      .select('email')
      .eq('otp', otp)
      .gte('expires_at', now)
      .single();

    if (error || !data) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userService.updatePassword(data.email, hashed);

    await this.supabase.client
      .from('password_reset_otp')
      .delete()
      .eq('otp', otp);
  }
}
