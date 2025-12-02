import { JWTPayload } from '@/utils/jwt.util';

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
