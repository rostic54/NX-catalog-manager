import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    AppointmentsModule,
    MongooseModule.forRoot('mongodb://localhost:27017/catalog-manager'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
