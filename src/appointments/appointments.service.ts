import { HttpException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment-dto';
import { InjectModel } from '@nestjs/mongoose';
import { AppointmentDocument, Appointment } from './schema/appointment.schema';
import { Model } from 'mongoose';
import { UpdateAppointmentDto } from './dto/update-appointment-dto';

// export interface Appointment {
//   id: number;
//   currentDate: string;
//   content: string;
//   editable: boolean;
//   preciseTime?: string;
// }

@Injectable()
export class AppointmentService {
  private readonly appointments: unknown[] = [];

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(
    appointment: CreateAppointmentDto,
  ): Promise<AppointmentDocument> {
    const createdAppointment = await this.appointmentModel.create(appointment);

    return createdAppointment.toObject();
  }

  async update(
    id: string,
    appointment: UpdateAppointmentDto,
  ): Promise<UpdateAppointmentDto> {
    console.log('UPDATE APPOINTMENT:', id, appointment);
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, { $set: appointment }, { new: true })
      .exec();
    if (!updatedAppointment) {
      // TODO: throw an error
      throw new HttpException(
        `Appointment with ID ${id} not found for updating`,
        402,
      );
    }

    return updatedAppointment.toObject();
  }

  async getById(id: string): Promise<CreateAppointmentDto> {
    const foundAppointment = await this.appointmentModel.findById(id).exec();
    console.log('SAVED APPOINTMENTS:', foundAppointment, id);
    if (!foundAppointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return foundAppointment;
  }

  async findByDate(fromDate: string, toDate: string): Promise<Appointment[]> {
    const foundAppointments = await this.appointmentModel
      .find({ currentDate: { $gte: fromDate, $lte: toDate } })
      .exec();
    console.log('FOUND APPOINTMENTS:', foundAppointments);
    if (foundAppointments === null) {
      return [];
    }
    return foundAppointments.map((appointment) => appointment.toObject());
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const deletedAppointment = await this.appointmentModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAppointment) {
      throw new HttpException(
        `Appointment with ID ${id} not found for deleting`,
        402,
      );
    }
    return true;
  }
}
