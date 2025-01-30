import EventEmitter from "node:events";

import { Robot } from "@/core/robot";
import { RobotDerived } from "@/core/robot/types";
import {
  WorkStation,
  TryCatchWorkStation,
  LoopWorkStation,
  IfWorkStation,
} from "./workstations";
import { Factory } from "@/core/factory";
import { FactoryState } from "@/core/state";
import { ConditionFunction } from "./types";

class FactoryFlow<State extends FactoryState = FactoryState> {
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

  public async execute() {
    try {
      await this.factory.executeStations(this.stations);
      this.factory.log.processInfo("Factory execution completed");
    } catch (error) {
      this.factory.log.error("Error while running factory");
      this.factory.log.error(error);
    }
    return this.factory;
  }
}

export class SubFactoryFlow extends FactoryFlow {
  public override async execute() {
    throw new Error("Sub factory flow cannot be executed");
    return this.factory;
  }
}

export interface IIFFlowState {
  true: WorkStation[];
  false: WorkStation[];
}

export class IfFlowRobot extends Robot {
  constructor(factory: Factory, public flowState: IIFFlowState) {
    super(factory);
  }

  public async executeCondition(condition: boolean) {
    const stations = condition ? this.flowState.true : this.flowState.false;
    if (stations) {
      for (const station of stations) {
        await station.run();
      }
    }
  }

  execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export class DoWhileFactoryFlow extends SubFactoryFlow {
  constructor(
    protected factory: Factory,
    protected events: EventEmitter,
    protected onClose: (
      stations: WorkStation[],
      condition: ConditionFunction
    ) => FactoryFlow
  ) {
    super(factory, events);
  }

  while(condition: ConditionFunction) {
    return this.onClose(this.stations, condition);
  }
}

export class TryCatchFactoryFlow extends SubFactoryFlow {
  constructor(
    protected factory: Factory,
    protected events: EventEmitter,
    protected onClose: (
      stations: WorkStation[],
      callback: (error: Error) => Promise<void>
    ) => FactoryFlow
  ) {
    super(factory, events);
  }

  catch(callback: (error: Error) => Promise<void>) {
    return this.onClose(this.stations, callback);
  }
}

class IfBaseFactoryFlow extends SubFactoryFlow {
  protected ifState: IIFFlowState;

  constructor(
    protected factory: Factory,
    protected events: EventEmitter,
    protected onClose: (ifState: IIFFlowState) => FactoryFlow,
    ifState?: IIFFlowState
  ) {
    super(factory, events);
    this.ifState = ifState ?? {
      true: [],
      false: [],
    };
  }
}

class ElseFactoryFlow extends IfBaseFactoryFlow {
  endif() {
    this.ifState.false = this.stations;
    return this.onClose(this.ifState);
  }
}

export class IfFactoryFlow extends IfBaseFactoryFlow {
  else() {
    this.ifState.true = this.stations;
    return new ElseFactoryFlow(
      this.factory,
      this.events,
      this.onClose,
      this.ifState
    );
  }

  endif() {
    this.ifState.true = this.stations;
    return this.onClose(this.ifState);
  }
}

export default FactoryFlow;
