import { Robot } from "@/core/robot";
import { Factory } from "@/core/factory";
import { IfFlowRobot, IIFFlowState } from "./flow";

export class WorkStation {
  constructor(public robot: Robot) {}
  async run(): Promise<void> {
    await this.robot.run();
  }
}

class MultiStationRobot extends Robot {
  constructor(factory: Factory, public stations: WorkStation[]) {
    super(factory);
  }
  public async execute() {
    for (const station of this.stations) {
      await station.run();
    }
  }
}

export class IfWorkStation extends WorkStation {
  constructor(
    public robot: IfFlowRobot,
    private verify: () => Promise<boolean>
  ) {
    super(robot);
  }

  async run() {
    const condition = await this.verify();
    await this.robot.executeCondition(condition);
  }

  public static create(
    factory: Factory,
    flowState: IIFFlowState,
    verify: () => Promise<boolean>
  ): IfWorkStation {
    return new IfWorkStation(new IfFlowRobot(factory, flowState), verify);
  }
}

export class PipelineWorkStation extends WorkStation {
  constructor(
    public robot: MultiStationRobot,
    private pipelines: string[]
  ) {
    super(robot);
  }

  async run() {
    const pipeline = this.robot.pipeline
    if (pipeline === 'main' || this.pipelines.includes(pipeline)) {
      await this.robot.execute();
    }
  }

  public static create(
    factory: Factory,
    stations: WorkStation[],
    pipelines: string | string[]
  ): PipelineWorkStation {
    const pipelinesArray = Array.isArray(pipelines) ? pipelines : [pipelines];
    return new PipelineWorkStation(new MultiStationRobot(factory, stations), pipelinesArray);
  }
}

export class TryCatchWorkStation extends WorkStation {
  constructor(
    robot: MultiStationRobot,
    private onCatch: (error: Error) => Promise<void>
  ) {
    super(robot);
  }

  async run() {
    try {
      await this.robot.execute();
    } catch (error) {
      await this.onCatch(error as Error);
    }
  }

  public static create(
    factory: Factory,
    stations: WorkStation[],
    onCatch: (error: Error) => Promise<void>
  ): TryCatchWorkStation {
    return new TryCatchWorkStation(
      new MultiStationRobot(factory, stations),
      onCatch
    );
  }
}

export class LoopWorkStation extends WorkStation {
  constructor(
    robot: MultiStationRobot,
    private verify: () => Promise<boolean>
  ) {
    super(robot);
  }

  async run() {
    while (true) {
      const condition = await this.verify();
      if (condition) {
        await this.robot.execute();
      } else {
        break;
      }
    }
  }

  public static create(
    factory: Factory,
    stations: WorkStation[],
    verify: () => Promise<boolean>
  ): LoopWorkStation {
    return new LoopWorkStation(
      new MultiStationRobot(factory, stations),
      verify
    );
  }
}
