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

    const payload: JWTPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id,
    };
    const accessToken = this.jwtUtil.signAccess(payload);
    const refreshToken = this.jwtUtil.signRefresh(payload);

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }
  async generateAndStoreOtp(
    email: string,
    purpose: 'login' | 'password_reset' | 'register',
  ) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.supabase.client.from('otps').upsert({
      email,
      otp,
      purpose,
      expires_at: expiresAt.toISOString(),
    });

    return otp;
  }

  async verifyOtp(
    email: string,
    otp: string,
    purpose: 'login' | 'password_reset' | 'register',
  ) {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase.client
      .from('otps')
      .select('otp')
      .eq('email', email)
      .eq('otp', otp)
      .eq('purpose', purpose)
      .gte('expires_at', now)
      .single();

    if (error || !data) {
      return false;
    }

    await this.supabase.client
      .from('otps')
      .delete()
      .eq('email', email)
      .eq('otp', otp)
      .eq('purpose', purpose);

    return true;
  }
  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) return;

    const otp = await this.generateAndStoreOtp(email, 'password_reset');
    await sendPasswordResetEmail(email, otp);
  }

  async resetPassword(otp: string, newPassword: string) {
    const now = new Date().toISOString();
    const { data, error } = await this.supabase.client
      .from('otps')
      .select('email')
      .eq('otp', otp)
      .gte('expires_at', now)
      .single();

    if (error || !data) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.userService.updatePassword(data.email, hashed);

    await this.supabase.client.from('otps').delete().eq('otp', otp);
  }
  async sendLoginOtp(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Email not registered');
    }

    const otp = await this.generateAndStoreOtp(email, 'login');
    // console.log(`[OTP] Sending login OTP ${otp} to ${email}`);
    await sendPasswordResetEmail(email, otp);
  }
  async sendRegisterOtp(email: string) {
    const existing = await this.userService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const otp = await this.generateAndStoreOtp(email, 'register');
    await sendPasswordResetEmail(email, otp);
  }

  async verifyRegisterOtp(
    email: string,
    otp: string,
    data: { full_name: string; password: string },
  ) {
    const isValid = await this.verifyOtp(email, otp, 'register');
    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const existing = await this.userService.findOneByEmail(email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await this.userService.create({
      email,
      full_name: data.full_name,
      password: hashed,
      role: 'candidate',
    });

    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
