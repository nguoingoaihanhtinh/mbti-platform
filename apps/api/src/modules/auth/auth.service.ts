import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { JwtUtil, JWTPayload } from '@/utils/jwt.util';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtUtil: JwtUtil,
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
      role: 'user',
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
    const token = this.jwtUtil.sign(payload);

    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      access_token: token,
    };
  }
}
