import { Factory } from "@/core";

export type ConditionFunction =
  | ((factory: Factory<any>) => Promise<boolean> | boolean)
  | boolean;
