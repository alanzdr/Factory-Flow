import { Robot } from "@/core/robot";
import { RobotDerived } from "@/core/robot/types";
import {
  Station,
  TryCatchWorkStation,
  LoopWorkStation,
  IfWorkStation,
  FunctionalStation,
} from "@/core/station";
import type { FactoryState } from "@/core/state";
import type { ConditionFunction } from "./types";
import { PipeInterface } from "./pipe.interface";
import { EXECUTION_STOPPED } from "../factory";

export class PipeActions<State extends FactoryState = FactoryState> extends PipeInterface<State>{

  /** @EVENTS */

  public once(eventName: string, callback: (...args: any[]) => void) {
    this.pipeline.once(eventName, callback);
    return this;
  }

  public on(eventName: string, callback: (...args: any[]) => void) {
    this.pipeline.on(eventName, callback);
    return this;
  }

  /** @ROBOTS */

  public pipe<T extends Robot>(Robot: RobotDerived<T>, ...params: Parameters<T["initialize"]>) {
    const station = new Station(this.pipeline, Robot, params)
    this.addStation(station);
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
    const verifyCondition = this.conditionVerify(condition);

    const flow = new this.modules.IfPipe<typeof this>(
      this,
      (state) => {
        const onGetStations = async () => {
          const result = await verifyCondition()
          if (result) {
            return state.true
          } else {
            return state.false
          }
        }

        this.addStation(
          IfWorkStation.create(
            this.pipeline,
            onGetStations
          )
        );

        return this;
      }
    );

    return flow;
  }

  public loop(condition: ConditionFunction) {
    const flow = new this.modules.LoopPipe<typeof this>(
      this,
      (stations) => {
        this.addStation(
          LoopWorkStation.create(
            this.pipeline,
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
    const flow = new this.modules.TryPipe(
      this,
      (stations, catchStations, onCatch) => {
        this.addStation(
          TryCatchWorkStation.create(this.pipeline, stations, catchStations, onCatch)
        );
        return this;
      }
    );

    return flow;
  }

  public stop() {
    const station = new FunctionalStation(
      this.pipeline,
      () => {
        throw new Error(EXECUTION_STOPPED);
      })
    this.addStation(station);
    return this;
  }
}