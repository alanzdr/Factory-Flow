import FactoryState from "../state";

interface StateCache {
  lastUpdate: Date;
  current: any;
}

class MemoryState<State extends object> extends FactoryState<State> {
  protected async onLoad(key: string): Promise<any> {
    return (this.initialState as any)[key] || undefined ;
  }

  protected async onSave(key: string, value: any): Promise<void> {
  
  }

  constructor(initialState: State) {
    super(initialState);
  }


  public override cleanExcess() {
    // No need to clean excess memory in memory state
  }

}

export default MemoryState;
