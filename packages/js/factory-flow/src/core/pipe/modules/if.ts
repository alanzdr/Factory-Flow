import { Station } from "@/core/station";
import { PipeActions } from "../pipe.actions";
import { PipeModule } from "./base";

export interface IIFPipeStations {
  true: Station[];
  false: Station[];
}


class IfBasePipe<T extends PipeActions = PipeActions> extends PipeModule<T> {
  protected conditionalStations: IIFPipeStations;

  constructor(
    parent: T,
    protected onEnd: (stations: IIFPipeStations) => T,
    stations?: IIFPipeStations
  ) {
    super(parent);
    this.conditionalStations = stations ?? {
      true: [],
      false: [],
    }
  }
}

class ElsePipe<T extends PipeActions = PipeActions> extends IfBasePipe<T> {
  public end() {
    this.conditionalStations.false = this.stations;
    return this.onEnd(this.conditionalStations);
  }
}

export class IfPipe<T extends PipeActions = PipeActions> extends IfBasePipe<T> {
  public else() {
    this.conditionalStations.true = this.stations;
    return new ElsePipe<T>(
      this.parent as T,
      this.onEnd,
      this.conditionalStations
    );
  }

  public end() {
    this.conditionalStations.true = this.stations;
    return this.onEnd(this.conditionalStations);
  }
}

