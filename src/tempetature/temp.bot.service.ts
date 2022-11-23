import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ALARM_LIST, ALARM_TEMP, META, TELEGRAM } from '../const';
import { InjectModel } from '@nestjs/mongoose';
import { Temp, TempDocument } from './temp.schema';
import { Model } from 'mongoose';
import { Telegraf } from 'telegraf';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const QuickChart = require('quickchart-js');

const DEVICES = Array.from(META);

@Injectable()
export class TempBotService implements OnApplicationBootstrap {
  private readonly logger = new Logger(TempBotService.name);
  private bot: Telegraf;

  constructor(
    @InjectModel(Temp.name) private readonly tempModel: Model<TempDocument>,
  ) {
    this.bot = new Telegraf(TELEGRAM.token);
    this.bot.help((ctx) => this.cmdHelp(ctx));
    const comm = DEVICES.map((d, index) => `temp_${index}`);
    this.bot.command(comm, (ctx) => this.cmdTemp(ctx));
    this.bot.command('temp', (ctx) => this.cmdMainTemp(ctx));
  }

  async cmdHelp(ctx) {
    const text = [
      '<b>Поддерживаются следующие команды:</b>',
      '/temp - Важные графики температуры',
      ...DEVICES.map(
        ([, item], index) => `/temp_${index.toString()} - ${item[`title`]}`,
      ),
    ].join('\n');

    return ctx.replyWithHTML(text, {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });
  }

  async cmdMainTemp(ctx) {
    const Temp = this.tempModel;
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60 * 1000;

    const nameDevices = DEVICES.map(([key]) => key);

    const series0 = (
      await Temp.find({ device: nameDevices[0] })
        .sort({ createDate: -1 })
        .limit(24 * 6)
    ).map((d) => ({
      x: new Date(d.createDate.getTime() - offset),
      y: d.value,
    }));

    const series1 = (
      await Temp.find({ device: nameDevices[1] })
        .sort({ createDate: -1 })
        .limit(24 * 6)
    ).map((d) => ({
      x: new Date(d.createDate.getTime() - offset),
      y: d.value,
    }));

    const series2 = (
      await Temp.find({ device: nameDevices[2] })
        .sort({ createDate: -1 })
        .limit(24 * 6)
    ).map((d) => ({
      x: new Date(d.createDate.getTime() - offset),
      y: d.value,
    }));

    const myChart = new QuickChart();
    myChart.setConfig({
      type: 'line',

      data: {
        datasets: [
          {
            borderColor: 'blue',
            backgroundColor: 'blue',
            borderWidth: 2,
            fill: false,
            label: `Темп возд:  ${series0[0].y.toFixed(1)} ℃`,
            pointRadius: 0,
            data: series0,
            yAxisID: 'y-axis-1',
          },
          {
            borderColor: 'red',
            backgroundColor: 'red',
            borderWidth: 1,
            fill: false,
            label: `Подача:  ${series1[0].y.toFixed(1)} ℃`,
            pointRadius: 0,
            data: series1.reverse(),
            yAxisID: 'y-axis-2',
          },
          {
            borderColor: '#f66',
            backgroundColor: '#f66',
            borderWidth: 1,
            fill: false,
            label: `Обратка:  ${series2[0].y.toFixed(1)} ℃`,
            pointRadius: 0,
            data: series2.reverse(),
            yAxisID: 'y-axis-2',
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'time',
              //distribution: 'series',
              time: {
                unit: 'hour',
                stepSize: 2,
                timezone: 3,
                displayFormats: {
                  hour: 'HH:mm',
                },
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontColor: 'blue',
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'y-axis-1',
            },
            {
              ticks: {
                fontColor: 'red',
              },
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'y-axis-2',
            },
          ],
        },
      },
    });
    return ctx.replyWithPhoto(myChart.getUrl(), {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });
  }

  async cmdTemp(ctx) {
    const {
      message: { text, message_id },
    } = ctx;

    const [, deviceIndex] = text.split('@')[0].split('_');
    const [key, item] = DEVICES[deviceIndex];

    const data = await this.getTemp(key, 12);

    const message = data
      .map(
        (doc) =>
          `${doc.createDate.toLocaleString()}   ${doc.value.toFixed(1)} ℃`,
      )
      .reverse();

    return ctx
      .replyWithHTML([`<b>${item.title}:</b>`, ...message].join('\n'), {
        reply_to_message_id: message_id,
        allow_sending_without_reply: true,
      })
      .catch((err) => ctx.reply(`Ошибка.\n${err.message}`));
  }

  getTemps(startDate: string, endDate: string) {
    return this.tempModel
      .find({
        createDate: {
          $gte: new Date(startDate),
          $lt: new Date(endDate),
        },
      })
      .sort({ createDate: -1 });
  }

  getTemp(device: string, limit = 6) {
    // const endDate = new Date();
    // const startDate = new Date(endDate);
    // startDate.setDate(endDate.getDate() - 1);

    return this.tempModel
      .find({
        device,
        // createDate: {
        //   $gte: startDate,
        //   $lt: endDate,
        // },
      })
      .sort({ createDate: -1 })
      .limit(limit);
  }

  alarmTemp(value) {
    if (value < ALARM_TEMP) {
      ALARM_LIST.forEach((id) =>
        this.bot.telegram
          .sendMessage(
            id,
            `Тревога!\nТемпература теплоносителя ${value.toFixed(
              1,
            )} ℃  менее чем ${ALARM_TEMP} ℃.\nДля инф. смотрите /temp`,
          )
          .catch((err) => console.log(err.message)),
      );
    }
  }

  onApplicationBootstrap() {
    this.bot
      .launch()
      .then(() => {
        this.logger.log('Start bot success!!!');
      })
      .catch((err: Error) => {
        this.logger.error(err.message);
        return this.onApplicationBootstrap();
      });

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
