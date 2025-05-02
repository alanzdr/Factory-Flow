import { LogModule } from "@/modules/log";

import { FactoryState } from "@/core/state";
import { Pipeline } from "@/core/pipeline";
import { Station } from "@/core/station";
import { IFactoryConfigs } from "./types";

export const EXECUTION_STOPPED = "EXECUTION_STOPPED";

class Factory<State extends FactoryState = any> {
  public log: LogModule;
  public name: string;
  public pipelines: Map<string, Pipeline>;

  constructor(public state: State, public configs: IFactoryConfigs = {}) {
    this.name = configs.name || "Factory";

    this.log = new LogModule(this.name, configs.log);
    this.log.info("Env:", process.env.NODE_ENV);
    this.log.info("State:", state.constructor.name);

    this.pipelines = new Map();
  }

  public async add(key: string, pipeline: Pipeline) {
    this.pipelines.set(key, pipeline);
  }

  /** @EXECUTE */

  private async executeStations(stations: Station[]) {
    this.log.processInfo("Starting Factory");
    this.log.separator();

    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      try {
        // Run the station
        await station.run();
        // Save all state used
        await this.state.save();
        // Clean all excess state for memory safety
        this.state.cleanExcess()
        //
        this.log.separator();
      } catch (error) {
        if ((error as Error).message === EXECUTION_STOPPED) {
          this.log.processInfo("User finished the factory");
          break;
        }
        throw error;
      }
    }
  }

  async execute(pipeline: Pipeline): Promise<void>
  async execute(pipeline: string): Promise<void>
  async execute(pipeline: string | Pipeline): Promise<void> {
    if (typeof pipeline === "string") {
      const pipelineRef = this.pipelines.get(pipeline);
      if (!pipelineRef) {
        throw new Error(`Pipeline ${pipeline} not found`);
      }
      pipeline = pipelineRef;
    }

    pipeline.setFactory(this);

    const stations = pipeline.getStations();
    await this.executeStations(stations);
  }
}

export default Factory;
