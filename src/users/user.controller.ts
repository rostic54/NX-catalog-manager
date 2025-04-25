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
import { JwtAuthGuard } from 'src/auth/jwt-guard';
import { ValidatedUser } from 'src/common/types/user';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: { user: ValidatedUser }) {
    console.log('GET PROFILE USER:', req.user);
    try {
      const user = await this.userService.findByEmail(req.user.email);
      return user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new HttpException(errorMessage, 400);
    }
    // return req.user;
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async register(
    @Body() user: UpdateUserDto,
    @Request() req: { user: ValidatedUser },
  ) {
    return await this.userService.update(user, req.user.email);
  }
}
