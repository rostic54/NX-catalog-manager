import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    console.log('GET PROFILE USER:', req.user);
    try {
      const user = await this.userService.findByEmail(req.user.email);
      return user;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
    // return req.user;
  }

  @Post('update')
  async register(@Body() user: CreateUserDto) {
    console.log('REGISTER USER:', user);
    try {
      await this.userService.create(user);
    } catch (error) {
      throw new HttpException(error.message, 400);
      // Registration logic here
      return { message: 'User registered successfully' };
    }
  }
}
