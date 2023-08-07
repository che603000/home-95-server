import { Injectable, Logger } from '@nestjs/common';
import { connect, Client } from 'mqtt';
import { RainService } from '../rain/rain.service';

const MQQT = {
  //connect: 'ws://192.168.1.5:18883/mqtt',
  connect: 'mqtt://192.168.1.5',
};

@Injectable()
export class MqttService {
  private readonly logger = new Logger(MqttService.name);
  public client: Client;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private rainService: RainService) {
    this.connect();
  }

  activeLight(value: boolean) {
    this.client.publish(
      '/devices/wb-gpio/controls/A2_OUT/on',
      value ? '1' : '0',
      (err, pak) => console.log(err, pak),
    );
  }

  activeTopic(topic: string, value: boolean) {
    if (this.rainService.value) {
      this.client.publish(`${topic}/on`, '0');
    } else {
      this.client.publish(`${topic}/on`, value ? '1' : '0');
    }
  }

  connect() {
    this.client = connect(MQQT.connect);
    this.client.on('connect', (opt) => this.onConnect());
    this.client.on('error', (err) => this.onError(err));
    this.client.on('message', (topic, message) =>
      this.onMessage(topic, message),
    );
  }

  onConnect() {
    //this.client.subscribe(['/devices/wb-gpio/controls/#']);
    this.client.publish('/devices/server-home95/controls/GUARD/on', '1');
    this.client.publish(
      '/devices/server-home95/controls/PING',
      Date.now().toString(),
    );
    setInterval(
      () =>
        this.client.publish(
          '/devices/server-home95/controls/PING',
          Date.now().toString(),
        ),
      1000 * 5,
    );
    //this.client.subscribe('/devices/server-home95/controls/#'/*, '/devices/wb-mr6c_159/controls/#'*/], () => 0)
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
