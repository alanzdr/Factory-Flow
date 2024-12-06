import { sleep } from "@/utils";

type ParallelCallback = () => Promise<void>;
type CycleCallback = (index: number, total: number) => void;

class ParallelModule {
  private promises: ParallelCallback[];
  private running: number;
  private index: number;

  constructor(private readonly parallelCalls: number) {
    this.promises = [];
    this.running = 0;
    this.index = 0;
  }

  public add(callback: ParallelCallback): void {
    this.promises.push(callback);
  }

  private async next() {
    const promise = this.promises.shift();
    if (promise) {
      this.running++;
      await promise();
      this.running--;
    }
  }

  private async wait() {
    while (this.running >= this.parallelCalls) {
      await sleep(10);
    }
  }

  public async execute(callback: CycleCallback) {
    const total = this.promises.length;

    while (this.promises.length > 0) {
      if (this.running >= this.parallelCalls) {
        await this.wait();
      }
      void this.next();
      callback(this.index, total);
      this.index++;
    }
  }

  public reset() {
    this.promises = [];
    this.running = 0;
    this.index = 0;
  }
}

export default ParallelModule;
