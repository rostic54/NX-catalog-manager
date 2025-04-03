import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Prop({ required: true, type: String })
  currentDate: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  editable: boolean;

  @Prop({ required: false })
  preciseTime: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
