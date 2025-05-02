
import type { FactoryState } from "@/core/state";
import { PipeActions } from "./pipe.actions";

export class Pipe<State extends FactoryState = FactoryState> extends PipeActions<State>{
  public end() {
    return this.pipeline
  }
}