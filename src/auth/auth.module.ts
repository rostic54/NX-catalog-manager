import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPsg } from './entities/user-psg.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, secretJWT } from './jwt-strategy';
import { UserModule } from 'src/users/user.module';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserPsg]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || secretJWT,
      signOptions: { expiresIn: '3h' },
    }),
  ],
})
export class AuthModule {}
