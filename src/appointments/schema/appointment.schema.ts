import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/User.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Prop({ required: true, type: String })
  currentDate: string;

  @Prop({ required: true, type: String })
  ownerId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  editable: boolean;

  @Prop({ required: false })
  preciseTime: string;

  @Prop({
    required: true,
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    // validate: [
    //   (v: User[]) => v.length > 0,
    //   'At least one attendee is required',
    // ],
  })
  attendees: (mongoose.Types.ObjectId | User)[];

  @Prop({ required: true, type: Number })
  otherAttendees: number;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
