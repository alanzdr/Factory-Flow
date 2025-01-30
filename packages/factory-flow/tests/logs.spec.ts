import { expect, test, describe } from "vitest";

import { Factory } from "factory-flow/core";
import State from "./mocks/state";
import ProgressBar from "./mocks/robots/progress-bar";

describe("MODULES:LOG", async () => {
  //
  test("should be able to create a progress bar", async () => {
    const state = new State();

    expect(async () => {
      await Factory.createFlow(state).pipe(ProgressBar).execute();
    }).not.toThrow();
  });
  //
});
