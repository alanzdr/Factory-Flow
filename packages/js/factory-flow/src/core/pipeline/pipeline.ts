
import { FactoryFlow } from "../flow";
import PipelineCLI from './cli'

type FlowFunction = () => FactoryFlow;

class FactoryPipeline {
  private flows: Map<string, FactoryFlow[]>;

  constructor() {
    this.flows = new Map();
  }

  public add(key: string, flow: FlowFunction) : void;
  public add(key: string, flow: FactoryFlow): void;
  public add(key: string, flow: FactoryFlow | FlowFunction) : void {
    const pipelineFlow = typeof flow === "function" ? flow() : flow;

    const existingFlow = this.flows.get(key);
    if (existingFlow) {
      existingFlow.push(pipelineFlow);
      return;
    }

    this.flows.set(key, [pipelineFlow]);
  }

  async execute(key: string) {
    const flow = this.flows.get(key);
    if (!flow) {
      throw new Error(`Flow with key ${key} not found`);
    }

    for (const f of flow) {
      await f.execute(key);
    }
  }

  public createCLI() {
    return new PipelineCLI(this);
  }

  public getFlows() {
    return this.flows;
  }

  static fromFlow(
    flow: FactoryFlow
  ): FactoryPipeline {
    const pipeline = new FactoryPipeline();
    const main = flow.main()

    pipeline.add("main", main);

    const keys = main.getPipelines()

    for (const key of keys) {
      pipeline.add(key, main);
    }

    return pipeline;
  }
}

export default FactoryPipeline;