// eslint-disable-next-line @typescript-eslint/no-var-requires
const { connect, Client } = require('mqtt');
const TOPIC_RAIN_SENSOR = '/devices/wb-mr6c_159/controls/K1';
const TOPIC_TEMP_SENSOR = '/devices/wb-w1/controls';
const SENSOR_TEMP_OUTDOOR = '28-011831bb08ff'; // темп улица
const SENSOR_TEMP_HOT = '28-0617000489ff'; // подача отопления
const SENSOR_TEMP_HOT_BACK = '28-0218317686ff'; // обратка отопления

const TOPIC_HWMON = '/devices/hwmon/controls';

const MQQT = {
  //connect: 'ws://192.168.1.5:18883/mqtt',
  connect: 'mqtt://192.168.1.5',
};

const client = connect(MQQT.connect);
client.on('connect', (opt) => {
  console.log(`Success connect [${MQQT.connect}]`);
  client.subscribe(
    [`${TOPIC_RAIN_SENSOR}`],
    //[`${TOPIC_TEMP_SENSOR}/+`, `${TOPIC_HWMON}/+`],
    () => undefined,
  );
});
client.on('error', (err) => {
  console.log(`Error connect [${MQQT.connect}]`);
  console.log(err);
});
client.on('message', (topic, message) => {
  console.log(topic, message.toString());
});
