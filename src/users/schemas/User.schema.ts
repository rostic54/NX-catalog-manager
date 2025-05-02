import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Appointment } from 'src/appointments/schema/appointment.schema';

@Schema()
export class User {
  @Prop({ required: true, index: true, unique: true })
  userName: string;

  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: false })
  avatarUrl: string;

  @Prop({
    type: [
      {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
  })
  appointments: Appointment[];
  // password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ret.id = ret._id;
    delete ret._id;
  },
});
