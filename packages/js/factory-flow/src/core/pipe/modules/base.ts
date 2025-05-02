import { Station } from "@/core/station";
import { PipeActions } from "../pipe.actions";

export class PipeModule<T extends PipeActions = PipeActions> extends PipeActions {
  protected stations: Station[] = [];

  constructor(parent: T) {
    super(parent.getPipeline());
    this.parent = parent;
  }

  public addStation(station: Station | Station[]) {
    if (Array.isArray(station)) {
      this.stations.push(...station);
      return;
    }
    this.stations.push(station);
  }
}