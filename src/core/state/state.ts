abstract class FactoryState<State extends object = any> {
  public data: State;

  constructor(protected initialState: State) {
    this.data = initialState;
  }

  public abstract initialize(): Promise<boolean>;
  public abstract save(): Promise<void>;

  public set<K extends keyof State>(key: K, value: State[K]) {
    this.data[key] = value;
  }

  public get<K extends keyof State>(key: K): State[K] {
    return this.data[key];
  }
}

export default FactoryState;
