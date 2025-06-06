import { Module } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { AppointmentController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schema/appointment.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    UserModule,
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentsModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AppointmentMockMiddleware).forRoutes({
  //     path: 'appointments',
  //     method: RequestMethod.POST,
  //   });
  // }
}
