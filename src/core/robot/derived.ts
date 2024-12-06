import { Factory } from "@/core/factory";

import Robot from "./robot";

interface RobotClass<T extends Robot> {
  new (state: Factory, configs: any): T;
}

export type RobotDerived<T extends Robot> = RobotClass<T>;
