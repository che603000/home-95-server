import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { MqttModule } from '../mqtt/mqtt.module';

@Module({
  imports: [MqttModule],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
