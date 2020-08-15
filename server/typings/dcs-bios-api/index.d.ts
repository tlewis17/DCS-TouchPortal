declare module 'dcs-bios-api' {
  export interface DcsBiosApiOptions {
    receivePort?: number;
    sendPort?: number;
    multicastAddress?: string;
    emitAllUpdates?: boolean;
    logLevel?: string;
    autoStartListening?: boolean;
  }

  export default class DcsBiosApi {
    constructor(options?: DcsBiosApiOptions);
    on(id: string): Promise<void>;
    on(id: string, callback: (value: string) => any): void;
    sendMessage(id: string): Promise<void>;
    startListening(): void;
    stopListening(): void;
    removeControlListeners(): void;
  }
}
