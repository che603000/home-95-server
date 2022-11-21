import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import { TOPIC_TEMP_SENSOR, TOPIC_HWMON, META } from '../const';
import { InjectModel } from '@nestjs/mongoose';
import { Temp, TempDocument } from './temp.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TempService {
  private readonly logger = new Logger(TempService.name);
  private store: Record<string, number[]> = {};

  constructor(
    @InjectModel(Temp.name) private readonly tempModel: Model<TempDocument>,
    private readonly mqqtService: MqttService,
  ) {
    mqqtService.client.subscribe(
      [`${TOPIC_TEMP_SENSOR}/+`, `${TOPIC_HWMON}/+`],
      () => undefined,
    );
    mqqtService.client.on('message', (topic: string, data) =>
      this.onMessage(topic, data.toString()),
    );
  }

  /*
  @Cron(CronExpression.EVERY_10_MINUTES) // каждые 10 минут
  onCron() {
    const createDate = new Date();
    createDate.setSeconds(0, 0);
    Object.entries(this.store).forEach((prop) => {
      const [key, items = []] = prop;
      const value =
        items.reduce((res: number, value: number) => res + value, 0) /
        items.length;
      this.tempModel
        .create({
          createDate,
          device: key,
          title: META.has(key) ? META.get(key).title : 'noname',
          value: +value.toFixed(1),
        })
        .catch((err) => this.logger.error(err.message));
      this.store[key] = [];
    });
  }
  */
  onMessage(topic: string, message: string) {
    const [key] = topic.split('/').reverse();
    this.store[key] = this.store[key] || [];
    this.store[key].push(parseFloat(message));
  }

  getTemps(startDate: string, endDate: string) {
    return this.tempModel.find({
      createDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });
  }

  getTemp(device: string, startDate: string, endDate: string) {
    return this.tempModel.find({
      device,
      createDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });
  }
}
