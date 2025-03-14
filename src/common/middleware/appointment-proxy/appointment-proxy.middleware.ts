import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppointmentMockMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('req in Appointment MIDDL', req.body);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    req.body = {
      currentDate: '2021-10-10',
      content: 'test appointment',
      editable: true,
      preciseTime: '10:00',
    };
    next();

  }
}
