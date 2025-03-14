import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment-dto';

const appointmentDate = new Date();
const id = 10;
export const appointment = {
  id: id,
  currentDate: appointmentDate.toISOString().split('T')[0],
  content: 'test appointment',
  editable: true,
  preciseTime: '10:00',
};

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // appointments
  @Post()
  create(@Body() createAppointment: CreateAppointmentDto) {
    createAppointment = appointment;
    console.log('createAppointment is not defined', createAppointment);

    return this.appointmentService.create(createAppointment);
  }

  // appointments/byDate
  @Get('byDate')
  findAllByDate() {
    return this.appointmentService.findByDate(
      appointmentDate.toISOString().split('T')[0],
    );
  }

  // appointments/:id
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    try {
      return this.appointmentService.getById(id);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  // appointments/:id
  @Put(':id')
  update() {
    try {
      return this.appointmentService.update(id, appointment);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }
}
