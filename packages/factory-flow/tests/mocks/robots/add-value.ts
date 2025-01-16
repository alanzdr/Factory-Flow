import { Robot } from "factory-flow/core";
import State from "../state";

interface Config {
  value: number;
}

class AddValueRobot extends Robot<State, Config> {
  public async execute() {
    this.state.set("value", (current) => {
      return current + this.configs.value;
    });
  }
}

export default AddValueRobot;
