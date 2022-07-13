import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MqttService } from './mqtt/mqtt.service';
import { ITask } from './task/task.interface';

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

  @Get('/task/:id')
  getTask(@Param('id') id: string) {
    return this.appService.getTask(id);
  }

  @Post('/task')
  saveTask(@Body() data: ITask) {
    return this.appService.saveTask(data);
  }
}
