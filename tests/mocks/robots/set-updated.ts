import { Robot } from "factory-flow/core";
import State from "../state";

class SetUpdatedRobot extends Robot<State> {
  public async execute() {
    this.state.set("updated", true);
  }
}

export default SetUpdatedRobot;
