import EventEmitter from "node:events";

import { Robot } from "@/core/robot";
import { RobotDerived } from "@/core/robot/types";
import {
  WorkStation,
  TryCatchWorkStation,
  LoopWorkStation,
  IfWorkStation,
  PipelineWorkStation,
} from "./workstations";
import { Factory } from "@/core/factory";
import { FactoryState } from "@/core/state";
import { ConditionFunction } from "./types";
import { FactoryPipeline } from "../pipeline";

class FactoryFlow<State extends FactoryState = FactoryState> {
  protected stations: WorkStation[];
  protected pipelines: string[];
  protected parent?: FactoryFlow;

  constructor(
    protected factory: Factory<State>,
    protected events: EventEmitter
  ) {
    this.stations = [];
    this.pipelines = [];
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
      this,
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

  public addPipelinesNames(pipelines: string[]) {
    if (this.parent) {
      this.parent.addPipelinesNames(pipelines);
    } else {
      this.pipelines = [...new Set([...this.pipelines, ...pipelines])];
    }
  }

  public describe(pipeline: string | string[]): PipelineFactoryFlow {
    const pipelineArray = Array.isArray(pipeline) ? pipeline : [pipeline];
    this.addPipelinesNames(pipelineArray);

    const flow = new PipelineFactoryFlow(
      this,
      pipelineArray,
      (station) => {
        return this.station(station);
      }
    );

    return flow
  }


  public do() {
    const flow = new DoWhileFactoryFlow(
      this,
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
      this,
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

  public station(station: WorkStation) {
    this.stations.push(station);
    return this;
  }

  public main() : FactoryFlow {
    return this.parent?.main() || this;
  }

  public toPipeline() {
    return FactoryPipeline.fromFlow(this);
  }

  public getPipelines() {
    return this.pipelines;
  }

  public getFactory() {
    return this.factory;
  }

  public getEventsEmitter() {
    return this.events;
  }

  public async execute(pipeline?: string) {
    try {
      await this.factory.executeStations(this.main().stations, pipeline);
      this.factory.log.processInfo("Factory execution completed");
    } catch (error) {
      this.factory.log.error("Error while running factory");
      this.factory.log.error(error);
    }
    return this.factory;
  }
}


export class SubFactoryFlow extends FactoryFlow {
  constructor(parent: FactoryFlow) {
    super(parent.getFactory(), parent.getEventsEmitter());
    this.parent = parent;
  }
}

export class PipelineFactoryFlow extends SubFactoryFlow {
  constructor(
    parent: FactoryFlow,
    private pipelineValues: string[],
    protected onClose: (station: PipelineWorkStation) => FactoryFlow
  ) {
    super(parent);
  }

  public override describe(pipeline: string | string[]): PipelineFactoryFlow {
    const parentFlow = this.onClose(PipelineWorkStation.create(this.factory, this.stations, this.pipelineValues));
    return parentFlow.describe(pipeline);
  }

  public override main() : FactoryFlow {
    return this.onClose(PipelineWorkStation.create(this.factory, this.stations, this.pipelineValues));
  }

  public override async execute(pipeline?: string) {
    const parentFlow = this.onClose(PipelineWorkStation.create(this.factory, this.stations, this.pipelineValues));
    return parentFlow.execute(pipeline);
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
    parent: FactoryFlow,
    protected onClose: (
      stations: WorkStation[],
      condition: ConditionFunction
    ) => FactoryFlow
  ) {
    super(parent);
  }

  while(condition: ConditionFunction) {
    return this.onClose(this.stations, condition);
  }

  override main() {
    return this.onClose(this.stations, () => true);
  }
}


export class TryCatchFactoryFlow extends SubFactoryFlow {
  constructor(
    parent: FactoryFlow,
    protected onClose: (
      stations: WorkStation[],
      callback: (error: Error) => Promise<void>
    ) => FactoryFlow
  ) {
    super(parent);
  }

  catch(callback: (error: Error) => Promise<void>) {
    return this.onClose(this.stations, callback);
  }

  override main() {
    return this.onClose(this.stations, async (error) => {
      this.factory.emit("error", error);
    });
  }
}

class IfBaseFactoryFlow extends SubFactoryFlow {
  protected ifState: IIFFlowState;

  constructor(
    parent: FactoryFlow,
    protected onClose: (ifState: IIFFlowState) => FactoryFlow,
    ifState?: IIFFlowState
  ) {
    super(parent);
    this.ifState = ifState ?? {
      true: [],
      false: [],
    };
    this.parent = parent;
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
      this,
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
