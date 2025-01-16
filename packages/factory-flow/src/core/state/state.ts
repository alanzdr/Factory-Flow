import { IRobotRegistry } from "../robot/types";

abstract class FactoryState<State extends object = any> {
  private stateMap: Map<keyof State, State[keyof State]>;
  private robotRegistries: IRobotRegistry[];
  private stateLogs: string[];
  private currentRobot: string;

  constructor(protected initialState?: State) {
    this.stateMap = new Map();
    this.robotRegistries = [];
    this.stateLogs = [];
    this.currentRobot = "";

    if (initialState) {
      for (const key in initialState) {
        this.stateMap.set(key, initialState[key]);
      }
    }
  }

  public abstract initialize(): Promise<boolean>;
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

    this.addLog(`set - ${String(key)}`);
    this.stateMap.set(key, value);
  }

  public setRobotName(robotName: string) {
    this.currentRobot = robotName;
  }

  public addLog(logText: string) {
    const index = String(this.stateLogs.length).padStart(8, "0");
    const date = new Date().toISOString();
    const changeLine = `[${index}-${date}][${this.currentRobot.toUpperCase()}]: ${logText}`;
    this.stateLogs.push(changeLine);
  }

  public get<K extends keyof State>(key: K): State[K] {
    this.addLog(`set - ${String(key)}`);
    return this.stateMap.get(key) as State[K];
  }

  public get size() {
    return this.stateMap.size;
  }

  public get registries() {
    return this.robotRegistries;
  }

  public get logs() {
    return this.stateLogs;
  }

  public addRegistry(registry: IRobotRegistry) {
    this.robotRegistries.push(registry);
  }

  public get data(): State {
    this.addLog("get - full data");
    return Object.fromEntries(this.stateMap) as unknown as State;
  }

  public set data(data: State) {
    this.addLog("init - data");
    for (const key in data) {
      this.stateMap.set(key, data[key]);
    }
  }
}

export default FactoryState;
