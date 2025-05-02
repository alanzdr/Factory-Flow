import { Robot } from "@/core/robot";
import { Pipeline } from "@/core/pipeline";
import { RobotDerived } from "../robot/types";

export class Station<T extends Robot = Robot> {
  constructor(protected pipeline: Pipeline, protected Robot?: RobotDerived<T>, protected params?: Parameters<T['initialize']>) {}

  async run(): Promise<void> {
    if (!this.Robot) {
      return
    }

    const robot = new this.Robot(this.pipeline);
    await robot.initialize(...(this.params || []));
    await robot.run();
  }
}

export class FunctionalStation extends Station {
  constructor(pipeline: Pipeline, private callback: () => void | Promise<void>) {
    super(pipeline);
  }

  async run() {
    await Promise.resolve(this.callback());
  }
}

export class IfWorkStation extends Station {
  protected stations: Station[];

  constructor(
    protected pipeline: Pipeline,
    private getStations: () => Promise<Station[]>
  ) {
    super(pipeline);
    this.stations = [];
  }

  async run() {
    const stations = await this.getStations()
    for (const station of stations) {
      await station.run();
    }
  }

  public static create(
    pipeline: Pipeline, 
    getStations: () => Promise<Station[]>
  ): IfWorkStation {
    return new IfWorkStation(pipeline, getStations);
  }
}

export class TryCatchWorkStation extends Station {
  constructor(
    pipeline: Pipeline, 
    private stations: Station[],
    private catchStation: Station[],
    private onCatch: (error: Error) => Promise<void>
  ) {
    super(pipeline);
  }

  async run() {
    try {
      for (const station of this.stations) {
        await station.run();
      }
    } catch (error) {
      await this.onCatch(error as Error);
      for (const station of this.catchStation) {
        await station.run();
      }
    }
  }

  public static create(
    pipeline: Pipeline, 
    stations: Station[],
    catchStation: Station[],
    onCatch: (error: Error) => Promise<void>
  ): TryCatchWorkStation {
    return new TryCatchWorkStation(pipeline, stations, catchStation, onCatch);
  }
}

export class LoopWorkStation extends Station {
  constructor(
    pipeline: Pipeline, 
    private stations: Station[],
    private verify: () => Promise<boolean>
  ) {
    super(pipeline);
  }

  async run() {
    while (await this.verify()) {
      for (const station of this.stations) {
        await station.run();
      }
    }
  }

  public static create(
    pipeline: Pipeline, 
    stations: Station[],
    verify: () => Promise<boolean>
  ): LoopWorkStation {
    return new LoopWorkStation(pipeline, stations, verify );
  }
}
