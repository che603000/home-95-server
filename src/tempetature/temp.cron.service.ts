import { Injectable, Logger } from '@nestjs/common';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ALARM_TEMP,
  META,
  SENSOR_TEMP_HOT,
  SENSOR_TEMP_OUTDOOR,
  TOPIC_HWMON,
  TOPIC_RAIN_SENSOR,
  TOPIC_TEMP_SENSOR,
} from '../const';
import { InjectModel } from '@nestjs/mongoose';
import { Temp, TempDocument } from './temp.schema';
import { Model } from 'mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TempBotService } from './temp.bot.service';
import { RainService } from '../rain/rain.service';

@Injectable()
export class TempCronService {
  private readonly logger = new Logger(TempCronService.name);
  private store: Record<string, number[]> = {};

  constructor(
    @InjectModel(Temp.name) private readonly tempModel: Model<TempDocument>,
    private readonly mqqtService: MqttService,
    private readonly botService: TempBotService,
    private readonly rainService: RainService,
  ) {
    mqqtService.client.subscribe(
      [`${TOPIC_TEMP_SENSOR}/+`, `${TOPIC_HWMON}/+`, TOPIC_RAIN_SENSOR],
      () => undefined,
    );
    mqqtService.client.on('message', (topic: string, data) => {
      if (topic === TOPIC_RAIN_SENSOR) {
        this.onMessageRain(topic, data.toString());
      } else {
        this.onMessageTemp(topic, data.toString());
      }
    });
  }

  @Cron(CronExpression.EVERY_10_MINUTES) // каждые 10 минут
  //@Cron(CronExpression.EVERY_30_SECONDS) // каждые 10 sec
  tempCron() {
    const createDate = new Date();
    createDate.setSeconds(0, 0);
    // темп на улице
    const tempOut = this.store[SENSOR_TEMP_OUTDOOR][0];
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
          value,
        })
        .catch((err) => this.logger.error(err.message));

      if (key === SENSOR_TEMP_HOT && value < ALARM_TEMP && tempOut < 5) {
        this.botService.alarmTemp(value);
      }
      this.store[key] = [];
    });
  }

  onMessageTemp(topic: string, message: string) {
    const [key] = topic.split('/').reverse();
    //console.log(key, message);
    this.store[key] = this.store[key] || [];
    this.store[key].push(parseFloat(message));
  }

  private onMessageRain(topic: string, message: string) {
    this.tempModel
      .create({
        createDate: new Date(),
        device: topic,
        title: 'Датчик дождя',
        value: message,
      })
      .then(() => (this.rainService.value = message === '1'))
      .catch((err) => this.logger.error(err.message));
  }
}
