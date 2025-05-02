
import type { FactoryState } from "@/core/state";
import { IPipeModulesExportType } from './modules/export'

import { createRequire } from 'node:module'
import { Pipeline } from "@/core/pipeline";

import { Station } from "@/core/station";
const require = createRequire(import.meta.url);

export abstract class PipeInterface<State extends FactoryState = FactoryState> {
  protected parent?: PipeInterface<State>;
  private modulesMap: IPipeModulesExportType | null = null

  constructor(
    protected pipeline: Pipeline
  ) {}

  protected get modules(): IPipeModulesExportType {
    if (this.modulesMap) {
      return this.modulesMap;
    }

    const modules = require('./modules') as unknown as IPipeModulesExportType;

    this.modulesMap = modules 
    return modules 
  }

  public main() : PipeInterface<State>{
    return this.parent?.main() || this;
  }

  protected get factory () {
    return this.pipeline.factory
  }

  public addStation(station: Station | Station[]) {
    if (this.parent) {
      this.parent.addStation(station);
      return
    }

    if (!this.pipeline) {
      throw new Error("Pipe executed without pipeline");
    }

    this.pipeline.addStation(station);
  }

  // public getEventsEmitter() {
  //   return this.pipeline.ev;
  // }

  public getPipeline() {
    return this.pipeline;
  }

}