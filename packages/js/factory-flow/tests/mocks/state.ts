import { FactoryState } from "factory-flow/core";

export interface IMockData {
  text: string;
  value: number;
  updated: boolean;
}

class MockState extends FactoryState<IMockData> {
  constructor() {
    super({
      text: "",
      value: 0,
      updated: false,
    });
  }

  public async initialize() {
    return;
  }

  public async save() {
    return;
  }
}

export default MockState;
