import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
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

  @Get('/task')
  getAllTas() {
    return this.appService.getAllTask();
  }

  @Post('/task')
  createTask(@Body() data: ITask) {
    return this.appService.createTask(data);
  }

  @Put('/task')
  updateTask(@Body() data: ITask) {
    return this.appService.updateTask(data);
  }

  @Delete('/task/:id')
  removeTask(@Param('id') id: string) {
    return this.appService.removeTask(id);
  }
}
