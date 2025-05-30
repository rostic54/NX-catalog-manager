import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPsg } from './entities/user-psg.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserAccessService } from 'src/shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sharedService: UserAccessService,
    @InjectRepository(UserPsg) private userRepository: Repository<UserPsg>,
  ) {}

  async register(userDto: RegisterUserDto): Promise<boolean> {
    const salt = await bcrypt.genSalt();
    userDto.password = await bcrypt.hash(userDto.password, salt);
    const newUser = await this.userRepository.save(userDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;

    const createdUser =
      await this.sharedService.createUserInMongo(userWithoutPassword);
    if (!createdUser) {
      throw new HttpException('User not created', 500);
    }

    return true;
  }

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: loginDto.email });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (isPasswordValid) {
      const payload = { email: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new HttpException('Invalid password', 401);
    }
  }
}
