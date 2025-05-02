import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/users/schemas/User.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAccessService } from 'src/shared/shared.service';
import {
  addAppointmentIdToUser,
  deleteAppointmentIdFromUser,
} from './sync-user-appointments';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly sharedService: UserAccessService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async update(
    userForUpdate: UpdateUserDto,
    email: string,
  ): Promise<User | null> {
    return this.sharedService.updateUserInfoInBothDBs(userForUpdate, email);
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async search(searchTerm: string, loggedUserEmail: string): Promise<User[]> {
    return this.userModel
      .find({
        $and: [
          {
            $or: [
              { userName: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } },
            ],
          },
          { email: { $ne: loggedUserEmail } },
        ],
      })
      .exec();
  }

  async findUsersByIds(userIds: string[]): Promise<User[]> {
    return this.userModel.find({ _id: { $in: userIds } }).exec();
  }

  async verifyUserIds(ids: string[]): Promise<boolean> {
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    const users = await this.userModel.find({ _id: { $in: objectIds } }).exec();
    return users.length === ids.length;
  }

  async syncUserAppointments(
    appointmentId: string,
    oldAttendees: string[],
    newAttendees: string[],
  ): Promise<boolean> {
    const addedUsers = newAttendees.filter((a) => !oldAttendees.includes(a));
    const removedUsers = oldAttendees.filter((a) => !newAttendees.includes(a));

    const addAttendeesRequest = addedUsers.length
      ? addAppointmentIdToUser(this.userModel, appointmentId, addedUsers)
      : true;
    const removeAttendeesRequest = removedUsers.length
      ? deleteAppointmentIdFromUser(this.userModel, appointmentId, removedUsers)
      : true;

    return await Promise.all([addAttendeesRequest, removeAttendeesRequest])
      .then((results) => {
        return results.every((result) => result);
      })
      .catch((error) => {
        console.error('Error syncing user appointments:', error);
        throw new HttpException('Failed to sync user appointments', 500);
      });
  }
}
