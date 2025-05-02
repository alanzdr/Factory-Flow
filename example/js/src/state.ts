import { FactoryState, JSONState } from "factory-flow/core";
import { State } from "./types";

const initialState: State = {
  images: {},
  count: 0,
  nextPage: 1,
};

export const state = new JSONState(initialState, 'state');

export default state;