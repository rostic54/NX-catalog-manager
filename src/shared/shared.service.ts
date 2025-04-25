import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { UserPsg } from 'src/auth/entities/user-psg.entity';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { User } from 'src/users/schemas/User.schema';
import { Repository } from 'typeorm';
import { hasChanges } from './utils/helpers';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class UserAccessService {
  constructor(
    @InjectRepository(UserPsg) private userRepository: Repository<UserPsg>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateUserInfoInBothDBs(
    userForUpdate: UpdateUserDto,
    email: string,
  ): Promise<User | null> {
    const updatedUser = await this.updateUserInMongo(userForUpdate, email);
    await this.updateUserInfoInPostgres(userForUpdate, email);

    return updatedUser;
  }

  async createUserInMongo(user: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  private async updateUserInfoInPostgres(
    updateUser: UpdateUserDto,
    email: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ email });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      await this.userRepository.save({
        ...user,
        ...updateUser,
      });

      return;
    } catch (error) {
      // Handle PostgreSQL unique constraint violation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23505') {
        // PostgreSQL unique violation error code
        throw new ConflictException('Name is already taken in PostgreSQL');
      }
      throw error; // Rethrow other errors
    }
  }

  private async updateUserInMongo(
    userForUpdate: UpdateUserDto,
    email: string,
  ): Promise<User> {
    const currentUser = await this.userModel.findOne({ email }).exec();
    if (!currentUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    if (!hasChanges(currentUser, userForUpdate)) {
      return currentUser;
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate(
        { email },
        { $set: userForUpdate },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedUser) {
      throw new HttpException('User not found', 404);
    }

    return updatedUser;
  }
}
