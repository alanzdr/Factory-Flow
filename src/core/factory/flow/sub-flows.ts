import EventEmitter from "node:events";

import { WorkStation } from "./workstations";
import Factory from "../factory";
import FactoryFlow from "./flow";
import { Robot } from "@/core/robot";
import { ConditionFunction } from "./types";

export class SubFactoryFlow extends FactoryFlow {
  public override execute(): void {
    throw new Error("Sub factory flow cannot be executed");
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
