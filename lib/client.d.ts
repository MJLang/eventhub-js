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
    private autoSend;
    private autoSendTimer;
    private batchTimer;
    private autoSendToken;
    constructor(key: SASToken, configParams?: EventHubClientConfig);
    send(event: BaseEvent): Promise<{}>;
    stopBatch(): void;
    startBatch(): void;
    refreshToken(token: SASToken): void;
    sendBatch(): void;
    private _enableAutoSend();
    private _sendSingleEvent(event);
    private _batchEvent(event);
    private _sendEvent(payload);
    private _batchFull(newEvent);
    private _runBatch();
    private _sendBatch();
}
export interface EventHubClientConfig {
    batching?: boolean;
    batchSize?: number;
    intervalTimer?: number;
    autoSend?: boolean;
    autoSendTimer?: number;
}
