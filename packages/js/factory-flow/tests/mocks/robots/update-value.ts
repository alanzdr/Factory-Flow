import { Robot } from "factory-flow/core";
import State from "../state";

interface Config {
  value: number;
}

class UpdateValueRobot extends Robot<State, Config> {
  public async execute() {
    this.state.set("value", this.configs.value);
  }
}

export default UpdateValueRobot;
