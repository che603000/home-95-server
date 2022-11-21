import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './task.schema';
import { TaskController } from './task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MqttModule,
    ScheduleModule,
  ],
  providers: [TaskService],
  exports: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
