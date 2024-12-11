import { expect, test, describe } from "vitest";

import { Factory } from "factory-flow/core";
import State from "./mocks/state";
import AddValueRobot from "./mocks/robots/add-value";
import UpdateValueRobot from "./mocks/robots/update-value";
import SetTextRobot from "./mocks/robots/set-text";
import SetUpdatedRobot from "./mocks/robots/set-updated";

// Should be able to create a factory
describe("FACTORY:PIPE", () => {
  //
  test("should be able to execute a factory flow", async () => {
    const state = new State();

    expect(async () => {
      await Factory.createFlow(state)
        .pipe(AddValueRobot, { value: 1 })
        .pipe(UpdateValueRobot, { value: 2 })
        .execute();
    }).not.toThrow();
  });
  //
  test("should be able to set the state in a robot", async () => {
    const state = new State();

    const text = "Hello, World!";

    const factory = await Factory.createFlow(state)
      .pipe(SetTextRobot, { text })
      // Update others states cannot change the text
      .pipe(UpdateValueRobot, { value: 2 })
      .pipe(SetUpdatedRobot)
      .execute();

    const newText = factory.state.get("text");

    expect(newText).toBe(text);
  });
  //
  test("should be able to update the state on multiple robots", async () => {
    const state = new State();

    const factory = await Factory.createFlow(state)
      .pipe(UpdateValueRobot, { value: 2 })
      .pipe(AddValueRobot, { value: 1 })
      .execute();

    const value = factory.state.get("value");
    expect(value).toBe(3);
  });
});
