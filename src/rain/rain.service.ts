import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RainService {
  private readonly logger = new Logger(RainService.name);
  private _value = false; //true - дождь идет
  private waitTime = 30; // minutes
  private _endRainTime: number;

  constructor() {
    this._endRainTime = 0;
  }

  private getTime() {
    return (Date.now() / (1000 * 60)) | 0; // в минутах;
  }

  set value(value) {
    if (value === false && this._value === true) {
      // дождь кончился
      this._endRainTime = this.getTime();
    }
    this._value = value;
  }

  get value() {
    if (this._value) {
      return true;
    }
    const wait = this.getTime() - this._endRainTime;
    return wait >= this.waitTime ? this._value : true;
  }
}
