import { Injectable } from '@nestjs/common';
import { Task, TaskDocument } from './task/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ITask } from './task/task.interface';

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  getTask(id: string): Promise<any> {
    return this.taskModel.findById(id).then((doc) => (doc ? doc.toJSON() : {}));
  }

  async updateTask(data: ITask): Promise<any> {
    const model = await this.taskModel.findById(data.id);
    if (model) {
      model.title = data.title;
      model.type = data.type;
      model.topic = data.topic;
      model.startTime = data.startTime;
      model.waitTime = data.waitTime;
      model.disable = data.disable;
      const doc = await model.save();
      return doc.toJSON();
    } else {
      throw new Error(`404 Not task`);
    }
  }

  async createTask(data: ITask): Promise<any> {
    const doc = await this.taskModel.create(data);
    return doc.toJSON();
  }

  removeTask(id: string) {
    return this.taskModel.findByIdAndRemove(id);
  }

  getAllTask() {
    return this.taskModel
      .find()
      .then((docs) => docs.map((doc) => doc.toJSON()));
  }
}
