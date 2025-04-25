import {
  Body,
  Controller,
  HttpException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('LOGIN USE API :', loginDto);
    try {
      const { accessToken } = await this.authService.login(loginDto);
      res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return { message: 'Login successful' };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
