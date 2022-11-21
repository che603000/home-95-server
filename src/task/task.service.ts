import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask } from './task.interface';
import { ScheduleService } from '../schedule/schedule.service';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly mqttService: MqttService,
    private readonly scheduleService: ScheduleService,
  ) {
    this.getAllTask().then((tasks: ITask[]) =>
      tasks.forEach((task) => this.scheduleService.addTask(task)),
    );
  }

  getTask(id: string): Promise<any> {
    return this.taskModel.findById(id).then((doc) => (doc ? doc.toJSON() : {}));
  }

  async updateTask(data: ITask): Promise<any> {
    const model = await this.taskModel.findById(data.id);
    if (!model) throw new Error(`404 Not task`);
    model.title = data.title;
    model.type = data.type;
    model.topic = data.topic;
    model.startTime = data.startTime;
    model.waitTime = data.waitTime;
    model.disable = data.disable;
    const doc = await model.save();
    const task: ITask = doc.toJSON();
    this.scheduleService.removeTasks(task.id);
    //this.mqttService.activeTopic(task.topic, false);
    this.scheduleService.addTask(task);
    return task;
  }

  async createTask(data: ITask): Promise<any> {
    const doc = await this.taskModel.create(data);
    const task: ITask = doc.toJSON();
    this.scheduleService.addTask(task);
    return task;
  }

  async removeTask(id: string) {
    const task = await this.getTask(id);
    if (!task) return;
    this.scheduleService.removeTasks(task.id);
    this.mqttService.activeTopic(task.topic, false);
    return this.taskModel.findByIdAndRemove(id);
  }

  async getAllTask() {
    return this.taskModel
      .find()
      .then((docs) => docs.map((doc) => doc.toJSON()));
  }
}
