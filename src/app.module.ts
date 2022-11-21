import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { MqttModule } from './mqtt/mqtt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TempModule } from './tempetature/temp.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ScheduleModule.forRoot(),
    //MongooseModule.forRoot('mongodb://localhost/home-95'),
    MongooseModule.forRoot('mongodb://192.168.1.9/home-95'),
    TaskModule,
    MqttModule,
    TempModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
