import { Injectable } from "@nestjs/common";
import { Task, TaskDocument } from "./task/task.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ITask } from "./task/task.interface";

@Injectable()
export class AppService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {
  }

  getTask(id: string): Promise<any> {
    return this.taskModel
      .findOne({ id })
      .then((doc) => (doc ? doc.toJSON() : {}));
  }

  async saveTask(data: ITask): Promise<any> {
    const model = await this.taskModel.findOne({ id: data.id });
    if (model) {
      model.startTime = data.startTime;
      model.waitTime = data.waitTime;
      model.disable = data.disable;
      return model.save().then((doc) => doc.toJSON());
    } else {
      return this.taskModel.create(data).then((doc) => doc.toJSON());
    }
  }
}
