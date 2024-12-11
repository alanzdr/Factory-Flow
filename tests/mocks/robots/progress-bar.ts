import { Robot } from "factory-flow/core";
import State from "../state";
import { sleep } from "@/utils";

class ProgressBarRobot extends Robot<State> {
  public async execute() {
    const limit = 200;
    const progressBar = this.log.progress("Progress", limit);

    for (let i = 0; i < limit; i++) {
      await sleep(100);
      progressBar.update(i);
    }

    this.log.info("Progress bar completed");
  }
}

export default ProgressBarRobot;
