import { Factory } from "@/core/factory";
import { LogModule } from "@/modules/log";

abstract class Robot<Config = any> {
  public log: LogModule;
  constructor(
    protected factory: Factory,
    public configs: Config = null as Config
  ) {
    this.log = new LogModule(this.constructor.name);
  }

  protected get state() {
    return this.factory.state;
  }

  abstract execute(): Promise<void>;

  public async run() {
    this.log.processInfo("Starting robot execution");
    await this.execute();
    this.log.processInfo("Finished");
  }
}

export default Robot;
