import { MiddlewareConsumer, Module, NestModule, Req, RequestMethod } from '@nestjs/common';
import { AppointmentService } from './appointments.service';
import { AppointmentController } from './appointments.controller';
import { AppointmentMockMiddleware } from 'src/common/middleware/appointment-proxy/appointment-proxy.middleware';

@Module({
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppointmentMockMiddleware).forRoutes({
      path: 'appointments',
      method: RequestMethod.POST,
    });
  }
}
