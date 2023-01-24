import EventEmitter from "events";

export interface WebEmitterEvents {
  gotoDestination: Function;
  walletError: Function;
  reload: Function;
}

export declare interface WebEventEmitter {
  on(eventName: keyof WebEmitterEvents, cb: Function): any;
  emit(eventName: keyof WebEmitterEvents, ...args: any[]): any;
}
export class WebEventEmitter extends EventEmitter {}

const WebEvents = new WebEventEmitter();

export default WebEvents;
