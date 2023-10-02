import prisma from '../client';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import config from './config';

export enum TokenType {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL'
}

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

export interface ExpressUser extends Express.User {
  id?: number;
}
// global extend Express namespace

export interface UserRequest extends Express.Request {
  user?: ExpressUser;
}

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
      where: { id: payload.sub }
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
