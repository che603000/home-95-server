export const META = new Map<string, Record<string, any>>();

export const TOPIC_TEMP_SENSOR = '/devices/wb-w1/controls';
export const SENSOR_TEMP_OUTDOOR = '28-011831bb08ff'; // темп улица
export const SENSOR_TEMP_HOT = '28-0617000489ff'; // подача отопления
export const SENSOR_TEMP_HOT_BACK = '28-0218317686ff'; // обратка отопления

export const TOPIC_HWMON = '/devices/hwmon/controls';
export const BOARD_TEMP = 'Board Temperature';
export const CPU_TEMP = 'CPU Temperature';

META.set(SENSOR_TEMP_OUTDOOR, { title: 'Темп улица' });
META.set(SENSOR_TEMP_HOT, { title: 'Подача отопление' });
META.set(SENSOR_TEMP_HOT_BACK, { title: 'Обратка отопление' });
META.set(BOARD_TEMP, { title: 'Температура в щите' });
META.set(CPU_TEMP, { title: 'Температура CPU' });

export const TELEGRAM = {
  token: '1581137233:AAHXMgFXs81pjPIMfZ-SG4ZROOGtVPb79s8', // @home95_bot
  nameBot: '@home95_bot',
};

export const ALARM_TEMP = 30; // темп тревоги (нижний предел)
export const ALARM_LIST = [
  418211324, // che603000
  -341802588, // group Che
];
