import { getVariableMemorySize } from "@/utils/memory";

interface StateContract<T> {
  value: T | null;
  size: number;
  loaded: boolean;
}

abstract class FactoryState<State extends object = any> {
  protected contractMap: Map<keyof State, StateContract<State[keyof State]>>;
  private size: number = 0;

  private memoryUsageLimit: number

  constructor(protected initialState: State) {
    const memoryLimit = process.env.FACTORY_MEMORY_LIMIT;
  
    if (memoryLimit) {
      this.memoryUsageLimit = parseInt(memoryLimit);
    } else {
      const processMemory = process.memoryUsage().heapTotal;
      // Set the memory limit to 50% of the total memory
      this.memoryUsageLimit = processMemory * 0.5;
    }
    
    this.contractMap = new Map();
  }

  protected abstract onLoad(key: string): Promise<any>;
  protected abstract onSave(key: string, value: any): Promise<void>;

  private onSet(key: keyof State, value: State[keyof State], loaded = false) {
    // calculate the size of the value
    const size = getVariableMemorySize(value);
    this.size += size;
    
    this.contractMap.set(key, {
      value,
      size,
      loaded,
    });
  }

  public set<K extends keyof State>(
    key: K,
    value: (current: State[K]) => State[K] | Promise<State[K]>
  ): Promise<void>;
  public set<K extends keyof State>(key: K, value: State[K]): void;
  public set<K extends keyof State>(
    key: K,
    value: (current: State[K]) => State[K] | Promise<State[K]>
  ): void | Promise<void> {
    if (typeof value === "function") {
      return new Promise(async (resolve) => {
        const current = await this.contractMap.get(key) as State[K];
        const next = await Promise.resolve(value(current))
        this.onSet(key, next);
        resolve()
      })
    }
    this.onSet(key, value);
  }

  public get sizeInBytes(): number {
    return this.size;
  }

  public async get<K extends keyof State>(key: K): Promise<State[K]> {
    const contract = this.contractMap.get(key);

    if (contract) {
      return contract.value as State[K];
    }

    let value: State[K] = await this.onLoad(String(key));
    if (!value) {
      value = (this.initialState[key] || undefined) as State[K];
    }

    this.onSet(key, value, true)
    return value
  }

  public setMemoryLimit(limit: number) {
    this.memoryUsageLimit = limit;
  }

  public async save (): Promise<void> {
    const keys = Array.from(this.contractMap.keys());

    for (const key of keys) {
      const contract = this.contractMap.get(key);

      if (!contract || contract.loaded) {
        continue;
      }

      await this.onSave(String(key), contract.value);
    }
  }

  private removeBiggestEntry() {
    let biggestKey: keyof State | null = null;
    let biggestSize = 0;

    for (const [key, value] of this.contractMap) {
      if (value.size > biggestSize) {
        biggestSize = value.size;
        biggestKey = key;
      }
    }

    if (biggestKey === null) {
      // Prevent infinite loop
      if (this.contractMap.size !== 0) {
        this.contractMap.clear();
        this.size = 0;
      }
      return;
    }

    this.size -= biggestSize;
    this.contractMap.delete(biggestKey);
  }

  public cleanExcess(): void {
    let memory = process.memoryUsage().heapUsed

    while (memory > this.memoryUsageLimit && this.size > 0) {
      if (this.contractMap.size === 0) {
        this.size = 0;
        break;
      }
      this.removeBiggestEntry()
      memory = process.memoryUsage().heapUsed
    }
  }

  public replace(data: State) {
    for (const key in data) {
      this.onSet(key, data[key]);
    }
  }
}

export default FactoryState;
