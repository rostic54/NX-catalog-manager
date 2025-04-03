import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppointmentMockMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('req in Appointment MIDDL', req.body);

    req.body = {
      currentDate: '2021-10-10',
      content: 'test appointment',
      editable: true,
      preciseTime: '10:00',
    };
    next();
  }
}
