import { Factory } from "@/core/factory";
import { Pipe } from "../pipe";
import { Station } from '@/core/station';
import EventEmitter from "events";

export class Pipeline {
  protected stations: Station[];
  protected factoryRef: Factory<any> | null = null;
  public events: EventEmitter;

  constructor() {
    this.stations = [];
    this.events = new EventEmitter();
    this.events.setMaxListeners(100);
  }


  /** @EVENTS */

  public once(eventName: string, callback: (...args: any[]) => void) {
    this.events.once(eventName, callback.bind(this));
    return this;
  }

  public on(eventName: string, callback: (...args: any[]) => void) {
    this.events.on(eventName, callback.bind(this));
    return this;
  }

  public emit(eventName: string, ...args: any[]) {
    this.events.emit(eventName, ...args);
  }

  public addStation(station: Station | Station[]) {
    if (Array.isArray(station)) {
      this.stations.push(...station);
      return;
    }
    this.stations.push(station);
  }

  public getStations() {
    return this.stations;
  }

  public setFactory(factory: Factory<any>) {
    this.factoryRef = factory;
  }


  public get factory() {
    if (!this.factoryRef) {
      throw new Error("Pipeline not initialized with factory");
    }
    return this.factoryRef;
  }

  public createFlow() {
    this.stations = []
    const initialPipe = new Pipe(this);
    return initialPipe;
  }

  static createFlow() {
    const pipeline = new Pipeline();
    return pipeline.createFlow();
  }
}