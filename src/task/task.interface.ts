export interface ITask {
  id: string;
  type: string;
  title: string;
  topic: string;
  disable: boolean;
  startTime: string[];
  waitTime: number;
}
