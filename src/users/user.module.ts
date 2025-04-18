import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/User.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
