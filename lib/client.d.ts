/// <reference types="node" />
import { SASToken } from './interfaces/token';
import { BaseEvent } from './models/event';
import { EventEmitter } from 'events';
export declare class EventHubClient extends EventEmitter {
    private key;
    events: Array<BaseEvent>;
    eventPool: Array<BaseEvent>;
    private batching;
    private batchSize;
    private locked;
    private intervalTimer;
    private batchTimer;
    constructor(key: SASToken, configParams?: EventHubClientConfig);
    send(event: BaseEvent): Promise<{}>;
    stopBatch(): void;
    startBatch(): void;
    refreshToken(token: SASToken): void;
    private _sendSingleEvent(event);
    private _batchEvent(event);
    private _sendEvent(payload);
    private _batchFull(newEvent);
    private _runBatch();
}
export interface EventHubClientConfig {
    batching?: boolean;
    batchSize?: number;
    intervalTimer?: number;
}
