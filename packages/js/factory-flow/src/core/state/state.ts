import { IRobotRegistry } from "../robot/types";

abstract class FactoryState<State extends object = any> {
  private stateMap: Map<keyof State, State[keyof State]>;

  constructor(protected initialState?: State) {
    this.stateMap = new Map();

    if (initialState) {
      for (const key in initialState) {
        this.stateMap.set(key, initialState[key]);
      }
    }
  }

  public abstract initialize(): Promise<void>;
  public abstract save(): Promise<void>;

  public set<K extends keyof State>(
    key: K,
    value: (current: State[K]) => State[K]
  ): void;
  public set<K extends keyof State>(key: K, value: State[K]): void;
  public set<K extends keyof State>(
    key: K,
    value: (current: State[K]) => State[K] | State[K]
  ): void {
    if (typeof value === "function") {
      const current = this.stateMap.get(key) as State[K];
      this.stateMap.set(key, value(current));
      return;
    }
    this.stateMap.set(key, value);
  }

  public get<K extends keyof State>(key: K): State[K] {
    return this.stateMap.get(key) as State[K];
  }

  public get size() {
    return this.stateMap.size;
  }

  public get data(): State {
    return Object.fromEntries(this.stateMap) as unknown as State;
  }

  public set data(data: State) {
    for (const key in data) {
      this.stateMap.set(key, data[key]);
    }
  }
}

export default FactoryState;
