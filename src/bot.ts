import { Telegraf } from 'telegraf';
import { META } from './const';

const TELEGRAM = {
  token: '1581137233:AAHXMgFXs81pjPIMfZ-SG4ZROOGtVPb79s8', // @home95_bot
  nameBot: '@home95_bot',
};

const DEVICES = Array.from(META);//.map(([key, item]) =>  );

export const starBot = () => {
  const bot = new Telegraf(TELEGRAM.token);
  bot.start((ctx) => ctx.reply('Welcome'));
  bot.on('sticker', (ctx) => ctx.reply('👍'));
  bot.hears('hi', (ctx) => ctx.reply('Hey there'));

  bot.help((ctx) => {
    const text = [
      '<b>Поддерживаются следующие команды:</b>',
      '/temp - Важные графики температуры',
      ...DEVICES.map(
        ([key, item], index) => `/temp_${index.toString()} - ${item[`title`]}`,
      ),
    ].join('\n');

    return ctx.replyWithHTML(text, {
      reply_to_message_id: ctx.message.message_id,
      allow_sending_without_reply: true,
    });
  });

  bot.launch();

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
};
