import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';

export interface JWTPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  signAccess(payload: JWTPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  signRefresh(payload: JWTPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  verify(token: string): JWTPayload {
    try {
      const decoded = this.jwtService.verify(token);

      if (
        typeof decoded === 'object' &&
        decoded !== null &&
        'sub' in decoded &&
        'email' in decoded
      ) {
        return decoded as JWTPayload;
      }
      throw new UnauthorizedException('Invalid token structure');
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
