import { Robot } from "factory-flow/core";
import State from "../state";

interface Config {
  text: string;
}

class SetTextRobot extends Robot<State, Config> {
  public async execute() {
    this.state.set("text", this.configs.text);
  }
}

export default SetTextRobot;
