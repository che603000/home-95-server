import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Temp, TempDocument } from './temp.schema';
import { Model } from 'mongoose';

@Injectable()
export class TempService {
  constructor(
    @InjectModel(Temp.name) private readonly tempModel: Model<TempDocument>,
  ) {}

  getTemps(startDate: string, endDate: string) {
    return this.tempModel.find({
      createDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });
  }

  getTemp(device: string, startDate: string, endDate: string) {
    return this.tempModel.find({
      device,
      createDate: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });
  }
}
