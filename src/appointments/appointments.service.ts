import { HttpException, Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AppointmentDocument, Appointment } from './schema/appointment.schema';
import mongoose, { Model } from 'mongoose';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
    private userService: UserService,
  ) {}

  async create(
    appointment: CreateAppointmentDto,
  ): Promise<AppointmentDocument> {
    let otherAttendees = 0;

    if (appointment.attendees.length > 0) {
      otherAttendees = await this.countAndVerifyAttendees(
        appointment.attendees,
        appointment.ownerId,
      );
    }

    const modifiedAppointment = {
      ...appointment,
      otherAttendees,
    };

    const createdAppointment =
      await this.appointmentModel.create(modifiedAppointment);

    await this.updateAppointmentIdsInAttendees(
      createdAppointment.id,
      [],
      createdAppointment.attendees,
    );

    return createdAppointment.toObject();
  }

  async update(
    id: string,
    appointment: UpdateAppointmentDto,
  ): Promise<AppointmentDocument> {
    console.log('UPDATE APPOINTMENT:', id, appointment);

    let otherAttendees = 0;

    if (appointment.attendees) {
      otherAttendees = await this.countAndVerifyAttendees(
        appointment.attendees,
        appointment.ownerId,
      );
    }

    const modifiedAppointment = {
      ...appointment,
      otherAttendees,
    };
    const foundAppointment = await this.appointmentModel.findById(id).exec();
    if (!foundAppointment) {
      // TODO: throw an error
      throw new HttpException(
        `Appointment with ID ${id} not found for updating`,
        402,
      );
    }
    const updatedAppointment = await this.appointmentModel
      .findByIdAndUpdate(id, { $set: modifiedAppointment }, { new: true })
      .exec();

    await this.updateAppointmentIdsInAttendees(
      id,
      foundAppointment.attendees,
      updatedAppointment!.attendees,
    );

    return updatedAppointment!.toObject();
  }

  async getById(id: string): Promise<AppointmentDocument> {
    const foundAppointment = await this.appointmentModel
      .findById(id)
      .populate('attendees')
      .exec();

    console.log('SAVED APPOINTMENTS:', foundAppointment, id);
    if (!foundAppointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return foundAppointment.toJSON();
  }

  async findByDate(fromDate: string, toDate: string): Promise<Appointment[]> {
    const foundAppointments = await this.appointmentModel
      .find({ currentDate: { $gte: fromDate, $lte: toDate } })
      .exec();

    return foundAppointments
      ? foundAppointments.map((appointment) => appointment.toJSON())
      : [];
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const appointment = await this.appointmentModel.findById(id).exec();
    if (!appointment) {
      throw new HttpException(
        `Appointment with ID ${id} not found for deleting`,
        402,
      );
    }
    await this.updateAppointmentIdsInAttendees(id, appointment.attendees);
    const deletedAppointment = await this.appointmentModel.deleteOne({
      _id: id,
    });

    if (!deletedAppointment) {
      throw new HttpException(
        `Appointment with ID ${id} not found for deleting`,
        402,
      );
    }
    return true;
  }

  private async updateAppointmentIdsInAttendees(
    appointmentId: string,
    oldAttendeeIds: mongoose.Types.ObjectId[],
    newAttendeeIds: mongoose.Types.ObjectId[] = [],
  ): Promise<void> {
    const oldAttendees = oldAttendeeIds.map((a) => a.toString());
    const newAttendees = newAttendeeIds.map((a) => a.toString());

    const updatedAttendees = await this.userService.syncUserAppointments(
      appointmentId,
      oldAttendees,
      newAttendees,
    );
    if (!updatedAttendees) {
      throw new HttpException('Failed to update attendees', 500);
    }
  }

  private async countAndVerifyAttendees(
    attendees: string[],
    ownerId: string,
  ): Promise<number> {
    const otherAttendees = this.countExtraAttendees(attendees, ownerId);
    const isValidAttendees = await this.verifyAttendees(attendees);
    if (!isValidAttendees) {
      throw new HttpException('Invalid attendees IDs list ', 400);
    }

    return otherAttendees;
  }

  private countExtraAttendees(
    attendees: string[],
    currentUseId: string,
  ): number {
    return attendees.filter((id: string) => id !== currentUseId).length;
  }

  private async verifyAttendees(attendeeId: string[]): Promise<boolean> {
    const attendee = await this.userService.verifyUserIds(attendeeId);
    return !!attendee;
  }
}
