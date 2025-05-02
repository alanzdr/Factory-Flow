import { Factory } from "@/core/factory";
import { LogModule } from "@/modules/log";
import { FactoryState } from "../state";
import { IRobotRegistry } from "./types";
import { Pipeline } from "@/core/pipeline";

abstract class Robot<
  State extends FactoryState<any> = FactoryState,
  InitializerArgs extends any[] = any[]
> {
  public log: LogModule;
  public name: string;

  constructor(
    protected pipeline: Pipeline
  ) {
    this.name = this.constructor.name;
    const logLevel = this.pipeline.factory.log.level
    this.log = new LogModule(this.name, logLevel);
  }


  public setName(name: string) {
    this.name = name;
    this.log.setName(name);
  }

  public getName(): string {
    return this.name;
  }

  public get factory(): Factory<State> {
    return this.pipeline.factory
  }

  protected get state(): State {
    return this.factory.state;
  }

  public emit(eventName: string, ...args: any[]) {
    this.pipeline.emit(eventName, ...args);
  }

  public abstract execute(): Promise<void>;
  public abstract initialize(...args: InitializerArgs): Promise<void>;

  public async run(): Promise<void> {
    this.log.processInfo("Starting robot execution");
    await this.execute();
    this.log.processInfo("Finished");
  }
}

export default Robot;
