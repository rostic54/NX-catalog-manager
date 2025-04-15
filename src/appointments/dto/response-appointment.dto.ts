/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Exclude, Expose, Transform } from 'class-transformer';
import { User } from 'src/users/schemas/User.schema';

export class ResponseAppointmentDto {
  @Expose({ name: '_id' }) // Map MongoDB's _id to id
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Exclude()
  __v: number;

  currentDate: string;
  content: string;
  editable: boolean;
  preciseTime: string;
  ownerId: string;
  attendees: string[] | User[];

  //   constructor(partial: Partial<ResponseAppointmentDto>) {
  //     Object.assign(this, partial)
  //   }
}
