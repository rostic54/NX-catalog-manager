import { Module } from '@nestjs/common';
import { UserAccessService } from './shared.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPsg } from 'src/auth/entities/user-psg.entity';
import { User, UserSchema } from 'src/users/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TypeOrmModule.forFeature([UserPsg]),
  ],
  providers: [UserAccessService],
  exports: [UserAccessService],
})
export class SharedModule {}
