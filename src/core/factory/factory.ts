import { LogModule } from "@/modules/log";
import EventEmitter from "node:events";

import { FactoryState } from "@/core/state";
import { FactoryFlow, WorkStation } from "@/core/flow";
import { FactoryModules } from "@/core/modules";

const EXECUTION_STOPPED = "EXECUTION_STOPPED";

class Factory<State extends FactoryState = FactoryState> {
  public log: LogModule;
  public events: EventEmitter;
  public modules: FactoryModules;

  constructor(public state: State) {
    this.events = new EventEmitter();
    this.modules = new FactoryModules();

    this.log = new LogModule("Factory");
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
    for (const station of stations) {
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
    state: FactoryState<State>
  ): FactoryFlow<FactoryState<State>> {
    const factory = new Factory(state);
    const flow = new FactoryFlow(factory, factory.events);
    return flow;
  }
}

export default Factory;
