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
  protected initialTime: number = Date.now();
  protected initialStateProcess: number = 0;

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

  protected async init(): Promise<void> {
    this.initialTime = Date.now();
    this.initialStateProcess = this.state.logs.length;
    this.state.setRobotName(this.name);
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
    // Initialize the robot
    await this.init();
    // Execute the robot
    this.log.processInfo("Starting robot execution");
    await this.execute();
    // End the robot
    await this.end();
    this.log.processInfo("Finished");
  }
}

export default Robot;
