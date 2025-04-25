import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ValidatedUser } from 'src/common/types/user';

export const secretJWT = '123qwe';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // The name of the JWT strategy
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return req?.cookies?.['jwt'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || secretJWT,
    });
  }

  async validate(payload: any): Promise<ValidatedUser> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return { id: payload.sub, email: payload.email };
  }
}
