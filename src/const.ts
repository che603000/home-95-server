export const META = new Map<string, Record<string, any>>();

export const TOPIC_TEMP_SENSOR = '/devices/wb-w1/controls';
export const SENSOR_TEMP_OUTDOOR = '28-011831bb08ff'; // темп улица
export const SENSOR_TEMP_HOT = '28-0617000489ff'; // подача отопления
export const SENSOR_TEMP_HOT_BACK = '28-0218317686ff'; // обратка отопления

export const TOPIC_HWMON = '/devices/hwmon/controls';
export const BOARD_TEMP = 'Board Temperature';
export const CPU_TEMP = 'CPU Temperature';

META.set(SENSOR_TEMP_OUTDOOR, { title: 'темп улица' });
META.set(SENSOR_TEMP_HOT, { title: 'подача отопление' });
META.set(SENSOR_TEMP_HOT_BACK, { title: 'обратка отопление' });
META.set(BOARD_TEMP, { title: 'температура в щите' });
META.set(CPU_TEMP, { title: 'температура CPU' });
