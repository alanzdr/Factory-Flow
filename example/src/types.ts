import { JSONState } from "factory-flow/core";

export interface IImageData {
  url: string,
  downloadedFile: string | null,
  width: number,
  height: number,
}

export interface State {
  images: Record<string, IImageData>;
  count: number;
  nextPage: number;
}

export type RobotState = JSONState<State>;