import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidatedUser } from 'src/common/types/user';

export class JwtAuthGuard extends AuthGuard('jwt') {
  // Override the handleRequest method to customize the behavior
  handleRequest(err: any, user: ValidatedUser, info: any): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
