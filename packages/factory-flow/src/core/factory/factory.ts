import { LogModule } from "@/modules/log";
import EventEmitter from "node:events";

import { FactoryState } from "@/core/state";
import { FactoryFlow, WorkStation } from "@/core/flow";
import { IFactoryConfigs } from "./types";

const EXECUTION_STOPPED = "EXECUTION_STOPPED";

class Factory<State extends FactoryState = FactoryState> {
  public log: LogModule;
  public events: EventEmitter;
  public name: string;

  constructor(public state: State, public configs: IFactoryConfigs = {}) {
    this.events = new EventEmitter();

    this.name = configs.name ?? "Factory";

    this.log = new LogModule(this.name, configs.log);
    this.log.info("Env:", process.env.NODE_ENV);
    this.log.info("State:", state.constructor.name);
  }

  /** @EVENTS */

  public once(eventName: string, callback: (...args: any[]) => void) {
    this.events.once(eventName, callback.bind(this));
    return this;
  }

  public on(eventName: string, callback: (...args: any[]) => void) {
    this.events.on(eventName, callback.bind(this));
    return this;
  }

  public emit(eventName: string, ...args: any[]) {
    this.events.emit(eventName, ...args);
  }

  /** @STATE */

  public async save() {
    await this.state.save();
  }

  public set<K extends keyof State>(key: K, value: State[K]) {
    this.state.set(key, value);
  }

  public get<K extends keyof State>(key: K): State[K] {
    return this.state.get(key);
  }

  public async runStations(stations: WorkStation[]) {
    await this.state.initialize();

    this.emit("start", this);
    this.once("stop", () => {
      throw new Error(EXECUTION_STOPPED);
    });

    this.log.processInfo("Starting Factory");
    this.log.separator();

    for (let i = 0; i < stations.length; i++) {
      const station = stations[i];
      try {
        await station.run();
        await this.state.save();
        this.log.separator();
      } catch (error) {
        this.emit("error", error);
        if ((error as Error).message === EXECUTION_STOPPED) {
          this.log.processInfo("User finished the factory");
          break;
        }
        throw error;
      }
    }

    this.emit("finish", this);
  }

  static createFlow<State extends object>(
    state: FactoryState<State>,
    configs?: IFactoryConfigs
  ): FactoryFlow<FactoryState<State>> {
    const factory = new Factory(state, configs);
    const flow = new FactoryFlow(factory, factory.events);
    return flow;
  }
}

export default Factory;
