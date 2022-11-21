import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';


@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mqttService: MqttService,
  ) {}

  @Get('/active/light/:value')
  activeLight(@Param('value') value: string): void {
    return this.mqttService.activeLight(value === 'on');
  }
}
