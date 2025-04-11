import { JSONState } from "factory-flow/core";
import { State } from "./types";

const initialState: State = {
  images: {},
  count: 0,
  nextPage: 1,
};

const state = new JSONState<State>(initialState, 'state.json');

export default state;