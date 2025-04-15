import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserPsg } from './auth/entities/user-psg.entity';

@Module({
  imports: [
    AuthModule,
    AppointmentsModule,
    UserModule,
    MongooseModule.forRoot('mongodb://localhost:27017/catalog-manager'),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost', // or 'postgres' as set in docker file
      database: 'catalog-manager',
      port: 5432,
      username: 'postgres',
      password: 'root',
      entities: [UserPsg],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {
    console.log('Data Source initialized:', dataSource.driver.database);
  }
}
