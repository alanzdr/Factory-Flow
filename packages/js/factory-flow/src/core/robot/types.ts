import { Factory } from "@/core/factory";

import Robot from "./robot";
import { Pipeline } from "@/core/pipeline";

interface RobotClass<T extends Robot> {
  new (pipeline: Pipeline): T;
}

export type RobotDerived<T extends Robot> = RobotClass<T>;

export interface IRobotRegistry<T = any> {
  name: string;
  time: number;
  stateProcess: number;
  details?: T;
}
