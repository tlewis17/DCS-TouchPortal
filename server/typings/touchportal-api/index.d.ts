declare module 'touchportal-api' {
  export class Client {
    constructor();

    choiceUpdate(id: string, choices: string[]): void;
    choiceUpdateSpecific(id: string, value: string, instanceId?: string): void;
    connect(connectOptions: IConnectOptions): void;
    createState(id: string, description: string, defaultValue: string): void;
    on(type: string, callback: ICallback): void;
    stateUpdate(stateId: string, value: string, instanceId?: string): void;
    stateUpdateMany(states: IState[]): void;
  }

  interface ICallback {
    (value: any): void;
  }

  interface IConnectOptions {
    pluginId: string;
  }

  export interface IState {
    id: string;
    value: string;
  }

  export interface IAction {
    data: IActionData[];
    pluginId: string;
    actionId: string;
    type: string;
    instanceId?: string;
  }

  export interface IActionData {
    id: string;
    value: string;
  }
}
