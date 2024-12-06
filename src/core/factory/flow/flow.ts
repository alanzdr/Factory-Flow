import EventEmitter from "node:events";

import { Robot } from "@/core/robot";
import { RobotDerived } from "@/core/robot/derived";
import { FactoryState } from "@/core/state";
import {
  WorkStation,
  TryCatchWorkStation,
  LoopWorkStation,
  IfWorkStation,
} from "./workstations";
import Factory from "../factory";
import {
  DoWhileFactoryFlow,
  IfFactoryFlow,
  IIFFlowState,
  TryCatchFactoryFlow,
} from "./sub-flows";
import { ConditionFunction } from "./types";

class FactoryFlow<State extends object = any> {
  protected stations: WorkStation[];

  constructor(
    protected factory: Factory<State>,
    protected events: EventEmitter
  ) {
    this.stations = [];
  }

  /** @EVENTS */

  public once(eventName: string, callback: (...args: any[]) => void) {
    this.factory.once(eventName, callback);
    return this;
  }

  public on(eventName: string, callback: (...args: any[]) => void) {
    this.factory.on(eventName, callback);
    return this;
  }

  /** @ROBOTS */

  public pipe<T extends Robot>(Robot: RobotDerived<T>, configs?: T["configs"]) {
    const robot = new Robot(this.factory, configs);
    this.stations.push(new WorkStation(robot));
    return this;
  }

  private conditionVerify(condition: ConditionFunction) {
    return async () => {
      if (typeof condition === "boolean") {
        return condition;
      }
      if (condition instanceof Promise) {
        return condition(this.factory);
      }
      return condition(this.factory);
    };
  }

  public if(condition: ConditionFunction) {
    const flow = new IfFactoryFlow(
      this.factory,
      this.events,
      (ifState: IIFFlowState) => {
        this.stations.push(
          IfWorkStation.create(
            this.factory,
            ifState,
            this.conditionVerify(condition)
          )
        );

        return this;
      }
    );

    return flow;
  }

  public do() {
    const flow = new DoWhileFactoryFlow(
      this.factory,
      this.events,
      (stations, condition) => {
        this.stations.push(
          LoopWorkStation.create(
            this.factory,
            stations,
            this.conditionVerify(condition)
          )
        );
        return this;
      }
    );

    return flow;
  }

  public try() {
    const flow = new TryCatchFactoryFlow(
      this.factory,
      this.events,
      (stations, onCatch) => {
        this.stations.push(
          TryCatchWorkStation.create(this.factory, stations, onCatch)
        );
        return this;
      }
    );

    return flow;
  }

  public stop() {
    this.factory.emit("stop");
    return this;
  }

  public execute() {
    this.factory
      .runStations(this.stations)
      .then(() => {
        this.factory.log.processInfo("Factory execution completed");
      })
      .catch((error) => {
        this.factory.log.error("Error while running factory");
        this.factory.log.error(error);
      });
  }
}

const FirstRobot = undefined as unknown as RobotDerived<Robot>;
const SecondRobot = undefined as unknown as RobotDerived<Robot>;
const factoryState = undefined as unknown as FactoryState;

Factory.createFlow(factoryState)
  .if(true)
  .pipe(FirstRobot)
  .else()
  .pipe(SecondRobot)
  .endif();

export default FactoryFlow;
