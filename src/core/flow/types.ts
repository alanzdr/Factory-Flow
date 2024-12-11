import { Factory } from "@/core";

export type ConditionFunction =
  | ((factory: Factory) => Promise<boolean> | boolean)
  | boolean;
