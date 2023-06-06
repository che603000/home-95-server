import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ITask } from '../task/task.interface';
import { MqttService } from '../mqtt/mqtt.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry, //private logger: LoggerService,
    private mqqtService: MqttService,
  ) {}

  addTaskTime(id: string, time: string, wait: number, topic: string) {
    try {
      const [hours, minutes] = time.split(':').map((t) => parseInt(t));
      this.addCronJob(
        `${id}:start`,
        this.createCronTime(hours, minutes),
        () => {
          this.mqqtService.activeTopic(topic, true);
        },
      );
      this.addCronJob(
        `${id}:stop`,
        this.createCronTime(hours, minutes, wait),
        () => {
          this.mqqtService.activeTopic(topic, false);
        },
      );
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  addTask(task: ITask) {
    if (!task.disable)
      task.startTime.forEach((time: string, index: number) =>
        this.addTaskTime(
          `${task.id}-${index}`,
          time,
          task.waitTime,
          task.topic,
        ),
      );
  }

  removeTasks(id: string) {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      if (key.indexOf(id) === 0) this.schedulerRegistry.deleteCronJob(key);
    });
  }

  createCronTime(hours: number, minutes: number, waitMinutes = 0) {
    const date = new Date();
    date.setHours(hours, minutes + waitMinutes, 0, 0);
    const h = date.getHours();
    const m = date.getMinutes();
    return `0 ${m} ${h} * * *`;
  }

  addCronJob(id: string, cronTime: string, handler: () => void) {
    const job = new CronJob(cronTime, handler);

    this.schedulerRegistry.addCronJob(id, job);
    job.start();
    this.logger.verbose(`Task ${id} added cronTime= ${cronTime}`);
  }

  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      let next;
      try {
        next = value.nextDates();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }

  deleteCron(id: string) {
    this.schedulerRegistry.deleteCronJob(id);
    this.logger.warn(`job ${id} deleted!`);
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }
}
