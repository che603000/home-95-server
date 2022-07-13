import { Injectable, Logger } from '@nestjs/common';
import { CronJob } from 'cron';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry, //private logger: LoggerService,
  ) {
    this.addTask('test', '00:46', 1);
    this.removeTasks('test');
    this.getCrons();
  }

  addTask(name: string, time: string, wait: number) {
    const [hours, minutes] = time.split(':').map((t) => parseInt(t));

    this.addCronJob(
      `${name}:start`,
      this.createCronTime(hours, minutes),
      () => {
        console.log('start');
      },
    );
    this.addCronJob(
      `${name}:stop`,
      this.createCronTime(hours, minutes, wait),
      () => {
        console.log('stop');
      },
    );
  }

  removeTasks(name: string) {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key) => {
      if (key.indexOf(name) === 0) this.schedulerRegistry.deleteCronJob(key);
    });
  }

  createCronTime(hours: number, minutes: number, waitMinutes = 0) {
    const date = new Date(
      hours * 60 * 60 * 1000 + (minutes + waitMinutes) * 60 * 1000,
    );
    const h = date.getUTCHours();
    const m = date.getUTCMinutes();
    return `0 ${m} ${h} * * *`;
  }

  addCronJob(name: string, cronTime: string, handler: () => void) {
    const job = new CronJob(cronTime, handler);

    this.schedulerRegistry.addCronJob(name, job);
    job.start();
    this.logger.warn(`Task ${name} added cronTime=${cronTime}`);
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

  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job ${name} deleted!`);
  }

  // @Interval(10000)
  // handleInterval() {
  //   this.logger.debug('Called every 10 seconds');
  // }
}
