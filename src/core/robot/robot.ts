import { Factory } from "@/core/factory";
import { LogModule } from "@/modules/log";
import { FactoryState } from "../state";
import { FactoryModules } from "../modules";

abstract class Robot<
  State extends FactoryState<any> = FactoryState,
  Config = any
> {
  public log: LogModule;
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

  abstract execute(): Promise<void>;

  public async run() {
    this.log.processInfo("Starting robot execution");
    await this.execute();
    this.log.processInfo("Finished");
  }
}

export default Robot;
