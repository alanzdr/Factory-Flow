import FactoryState from "../state";

interface StateCache {
  lastUpdate: Date;
  current: any;
}

const __cache: StateCache = {
  lastUpdate: new Date(),
  current: null,
};

class MemoryState<State extends object> extends FactoryState<State> {
  constructor(initialState: State) {
    super(initialState);
  }

  public async initialize() {
    if (__cache.current) {
      this.data = __cache.current as State;
    }
  }

  public async save() {
    __cache.lastUpdate = new Date();
    __cache.current = this.data;
  }
}

export default MemoryState;
