import {
  Station,
} from "@/core/station";
import { ConditionFunction } from "../types";
import { PipeActions } from "@/core/pipe/pipe.actions";
import { PipeModule } from "./base";

export class LoopPipe<T extends PipeActions = PipeActions> extends PipeModule {
  constructor(
    parent: T,
    protected onEnd: (
      stations: Station[]
    ) => T
  ) {
    super(parent);
  }

  public end() {
    return this.onEnd(this.stations);
  }

  public override main() {
    return this.onEnd(this.stations);
  }
}
