import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ResponseAppointmentDto } from './dto/response-appointment.dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/jwt-guard';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // appointments
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createAppointment: CreateAppointmentDto,
  ): Promise<ResponseAppointmentDto> {
    try {
      if (createAppointment.id) {
        const updatedAppointment = await this.appointmentService.update(
          createAppointment.id,
          createAppointment,
        );
        return plainToInstance(ResponseAppointmentDto, updatedAppointment);
      }
      const appointment =
        await this.appointmentService.create(createAppointment);
      return plainToInstance(ResponseAppointmentDto, appointment);
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  // appointments/byDate
  @Get('byDate')
  @UseGuards(JwtAuthGuard)
  async findAllByDate(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ): Promise<ResponseAppointmentDto[]> {
    // console.log('FIND APPOINT BY DATE:', fromDate, toDate);
    const appointments = await this.appointmentService.findByDate(
      fromDate,
      toDate,
    );

    return plainToInstance(ResponseAppointmentDto, appointments);
  }

  // appointments/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Param('id')
    id: string,
  ) {
    try {
      return await this.appointmentService.getById(id);
      // return await this.appointmentService.getById();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(error.message, 404);
      } else {
        throw new HttpException('Unknown error', 404);
      }
    }
  }

  // appointments/:id
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() appointment: UpdateAppointmentDto,
  ) {
    // console.log('UPDATE API:', id, appointment);
    try {
      const updatedAppointment = await this.appointmentService.update(
        id,
        appointment,
      );
      return plainToInstance(ResponseAppointmentDto, updatedAppointment);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  // appointments/:id
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<boolean> {
    try {
      return await this.appointmentService.deleteAppointment(id);
    } catch (error) {
      throw new HttpException(error.message, 404);
    }
  }

  // Method to rename and remove mongoose properties.
  private normalizeToResponse(instance) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (instance?._id) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      instance.id = instance._id.toString();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      delete instance.__v;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      delete instance._id;
    }
  }
}
