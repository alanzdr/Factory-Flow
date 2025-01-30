import { Factory } from "@/core/factory";
import { LogModule } from "@/modules/log";
import { FactoryState } from "../state";
import { IRobotRegistry } from "./types";

abstract class Robot<
  State extends FactoryState<any> = FactoryState,
  Config = any
> {
  public log: LogModule;
  private name: string;

  constructor(
    protected factory: Factory<State>,
    public configs: Config = null as Config
  ) {
    this.name = this.constructor.name;
    this.log = new LogModule(this.name, factory.log.level);
  }

  public setName(name: string) {
    this.name = name;
    this.log.setName(name);
  }

  public getName(): string {
    return this.name;
  }

  protected get state(): State {
    return this.factory.state;
  }

  abstract execute(): Promise<void>;

  public async run(): Promise<void> {
    this.log.processInfo("Starting robot execution");
    await this.execute();
    this.log.processInfo("Finished");
  }
}

export default Robot;
