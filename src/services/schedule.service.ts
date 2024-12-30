import { RedisService } from './redis.service';

export class ScheduleService {
  private mapFn: Record<string, () => void> = {};
  private redisService: RedisService;
  private static instance: ScheduleService;
  constructor() {
    this.redisService = RedisService.getInstance();
    this.mapFn = {};
  }
  public static getInstance(): ScheduleService {
    if (!ScheduleService.instance) {
      ScheduleService.instance = new ScheduleService();
    }
    return ScheduleService.instance;
  }

  async schedule(taskId: string, fn: () => void, timestamp: number) {
    this.mapFn[taskId] = fn;
    console.log(`Scheduled new task with ID ${taskId} and timestamp ${timestamp}`);
    await this.redisService.addToSortedSet('sortedTasks', `${taskId}`, `${timestamp}`);
  }

  async start() {
    const findNextTask = async () => {
      let taskId;
      do {
        taskId = await this.redisService.getFirstInSortedSet('sortedTasks');
        console.log(taskId);
        if (taskId) {
          try {
            console.log(this.mapFn[taskId]);
            this.mapFn[taskId]?.();
            console.log(`Running function for task ${taskId}`);
            this.redisService.removeFromSortedSet('sortedTasks', taskId);
            this.redisService.del(`task:${taskId}`);
          } catch (err) {
            console.error(err);
          }
        }
      } while (taskId);

      setTimeout(findNextTask, 1000);
    };
    findNextTask();
  }
}
