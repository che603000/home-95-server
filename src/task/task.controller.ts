import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ITask } from './task.interface';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/task/:id')
  getTask(@Param('id') id: string) {
    return this.taskService.getTask(id);
  }

  @Get('/task')
  getAllTask() {
    return this.taskService.getAllTask();
  }

  @Post('/task')
  createTask(@Body() data: ITask) {
    return this.taskService.createTask(data);
  }

  @Put('/task')
  updateTask(@Body() data: ITask) {
    return this.taskService.updateTask(data);
  }

  @Delete('/task/:id')
  removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }
}
