import { Injectable, Logger } from '@nestjs/common';
import { connect, Client } from 'mqtt';

const MQQT = {
  //connect: 'ws://192.168.1.5:18883/mqtt',
  connect: 'mqtt://192.168.1.5',
};

@Injectable()
export class MqttService {
  private readonly logger = new Logger(MqttService.name);
  private client: Client;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.connect();
  }

  activeLight(value: boolean) {
    this.client.publish(
      '/devices/wb-gpio/controls/A2_OUT/on',
      value ? '1' : '0',
      (err, pak) => console.log(err, pak),
    );
  }

  activeWater(key: string, value: boolean) {
    // key [K1, K2, ... K6]
    this.client.publish(
      `/devices/wb-mr6c_159/controls/${key}/on`,
      value ? '1' : '0',
    );
  }

  connect() {
    this.client = connect(MQQT.connect);
    this.client.on('connect', (opt) => this.onConnect(opt));
    this.client.on('error', (err) => this.onError(err));
    this.client.on('message', (topic, message) =>
      this.onMessage(topic, message),
    );
  }

  onConnect(opt: any) {
    console.log(opt);
    this.client.subscribe(['/devices/wb-gpio/controls/#']);
    //this.client.subscribe(['/devices/wb-gpio/#', '/devices/wb-w1/controls/#']);
  }

  onError(err: Error) {
    console.log(err);
  }

  onMessage(topic: string, message: Buffer) {
    const data = message.toString();
    //this.logger.warn(`${topic} = ${data}`);
    //if (/^\/devices\/wb-gpio\/controls\/A[1234]_OUT$/.test(topic))
    //console.log(`${topic} = ${data}`);
  }
}
