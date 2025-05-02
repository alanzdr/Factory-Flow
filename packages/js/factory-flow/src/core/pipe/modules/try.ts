import { PipeActions } from "../pipe.actions";
import { Station } from "@/core/station";
import { PipeModule } from "./base";

export class CatchPipe extends PipeModule {
  constructor(
    parent: PipeActions,
    private defaultStation: Station[],
    protected onEnd: (
      stations: Station[],
      catchStation: Station[],
      callback: (error: Error) => Promise<void>
    ) => PipeActions,
    private callback: (error: Error) => Promise<void>,
  ) {
    super(parent);
  }

  public end() {
    return this.onEnd(this.defaultStation, this.stations, this.callback);
  }
}

export class TryPipe extends PipeModule {
  constructor(
    parent: PipeActions,
    protected onEnd: (
      stations: Station[],
      catchStation: Station[],
      callback: (error: Error) => Promise<void>
    ) => PipeActions
  ) {
    super(parent);
  }

  public catch(callback: (error: Error) => Promise<void>) {
    return new CatchPipe(
      this,
      this.stations,
      this.onEnd,
      callback,
    )
  }

  public end() {
    return this.onEnd(this.stations, [], async (error) => {
      throw error;
    });
  }

  override main() {
    return this.end()
  }
}
