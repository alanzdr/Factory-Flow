import { Factory } from "@/core/factory";
import { LogModule } from "@/modules/log";
import { FactoryState } from "../state";
import { FactoryModules } from "../modules";
import { IRobotRegistry } from "./types";

abstract class Robot<
  State extends FactoryState<any> = FactoryState,
  Config = any
> {
  public log: LogModule;
  private initialTime: number = Date.now();
  private initialStateProcess: number = 0;

  constructor(
    protected factory: Factory<State>,
    public configs: Config = null as Config
  ) {
    this.log = new LogModule(this.constructor.name);
  }

  protected get state(): State {
    return this.factory.state;
  }

  protected get modules(): FactoryModules {
    return this.factory.modules;
  }

  protected async init(): Promise<void> {
    this.initialTime = Date.now();
    this.initialStateProcess = this.state.logs.length;
  }

  abstract execute(): Promise<void>;

  protected async getRegistry(): Promise<IRobotRegistry> {
    return {
      name: this.constructor.name,
      time: Date.now() - this.initialTime,
      stateProcess: this.state.logs.length - this.initialStateProcess,
    };
  }

  protected async end() {
    const registry = await this.getRegistry();
    this.state.addRegistry(registry);
  }

  public async run(): Promise<void> {
    this.log.processInfo("Starting robot execution");
    // Initialize the robot
    await this.init();
    // Execute the robot
    await this.execute();
    // End the robot
    await this.end();
    this.log.processInfo("Finished");
  }
}

export default Robot;
