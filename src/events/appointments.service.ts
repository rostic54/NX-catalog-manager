import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment-dto';

export interface Appointment {
  id: number;
  currentDate: string;
  content: string;
  editable: boolean;
  preciseTime?: string;
}

@Injectable()
export class AppointmentService {
  private readonly appointments: Appointment[] = [];

  create(appointment: CreateAppointmentDto): Appointment[] {
    this.appointments.push({
      ...appointment,
      id: this.appointments.length + 1,
    });

    return this.appointments;
  }

  update(id: number, appointment: Appointment): Appointment | boolean {
    const index = this.appointments.findIndex((event) => event.id === id);
    if (index === -1) {
      // TODO: throw an error
      throw new Error(`Appointment with ID ${id} not found for updating`);
    }

    this.appointments[index] = appointment;
    return this.appointments[index];
  }

  getById(id: number): Appointment | undefined {
    console.log('SAVED APPOINTMENTS:', this.appointments);
    const foundAppointment = this.appointments.find((event) => event.id === id);
    if (!foundAppointment) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
    return foundAppointment;
  }

  findByDate(date: string): Appointment[] {
    if (this.appointments.length === 0) {
      return [];
    }
    return this.appointments.filter((event) => event.currentDate === date);
  }
}
