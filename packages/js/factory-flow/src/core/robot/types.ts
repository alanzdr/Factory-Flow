import { Factory } from "@/core/factory";

import Robot from "./robot";

interface RobotClass<T extends Robot> {
  new (factory: Factory<any>, configs: any): T;
}

export type RobotDerived<T extends Robot> = RobotClass<T>;

export interface IRobotRegistry<T = any> {
  name: string;
  time: number;
  stateProcess: number;
  details?: T;
}
