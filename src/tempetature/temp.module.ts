import { Module } from '@nestjs/common';
import { TempService } from './temp.service';
import { MqttModule } from '../mqtt/mqtt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Temp, TempSchema } from './temp.schema';
import { TempController } from './temp.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Temp.name, schema: TempSchema }]),
    MqttModule,
  ],
  controllers: [TempController],
  providers: [TempService],
  exports: [TempService],
})
export class TempModule {}
