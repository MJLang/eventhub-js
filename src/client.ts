'use strict';

import * as axios from 'axios';
import {SASToken} from './interfaces/token';
import {BaseEvent} from './models/event';
import {EventEmitter} from 'events';


export class EventHubClient extends EventEmitter {
  public events: Array<BaseEvent> = [];
  public eventPool: Array<BaseEvent> = [];
  private batching: boolean;
  private batchSize: number;
  private locked: boolean;
  private intervalTimer: number;
  private autoSend: boolean;
  private autoSendTimer: number;


  private batchTimer: NodeJS.Timer;
  private autoSendToken: NodeJS.Timer;

  constructor(private key: SASToken, configParams?: EventHubClientConfig) {
    super();
    let config: EventHubClientConfig = {
      batching: true,
      batchSize: (1025 * 200),
      intervalTimer: 20,
      autoSend: false,
      autoSendTimer: (1000 * 60 * 20) // 20 Minutes
    };
    Object.assign(config, configParams);
    this.batching = config && config.batching;
    this.batchSize = config && config.batchSize;  // 200kb default
    this.intervalTimer = config && config.intervalTimer;
    this.autoSend = config && config.autoSend;
    this.autoSendTimer = config && config.autoSendTimer;

    if (this.batching) {
      this.startBatch();

      if (this.autoSend) {
        this._enableAutoSend();
      }
    }

  }

  public send(event: BaseEvent) {
    if (!this.batching) {
      return this._sendSingleEvent(event);
    } else {
      return this._batchEvent(event).then(() => {
        return this.emit('added');
      });
    }
  }


  public stopBatch() {
    this.locked = true;
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
  }

  public startBatch() {
    this.locked = false;
    this._runBatch();
  }

  public refreshToken(token: SASToken) {
    this.key = token;
    if (this.batching) {
      this.startBatch();
    }
  }

  public sendBatch() {
    this._sendBatch();
  }

  private _enableAutoSend() {
    this.autoSendToken = setInterval(() => {
      if (this.events.length > 0) {
        this.sendBatch();
      }
    }, this.autoSendTimer);
  }

  private _sendSingleEvent(event: BaseEvent) {
    return new Promise((resolve, reject) => {
      this._sendEvent(event).then((res) => {
        return resolve(true);
      })
      .catch((res) => {
        if (res.status === 401) {
          this.emit('invalidToken');
        } else {
          this.emit('httpErr', res.status);
        }
        return reject(false);
      });
    });
  }

  private _batchEvent(event: BaseEvent) {
    return new Promise((resolve, reject) => {
      this.eventPool.push(event);
      resolve();
    });
  }

  private _sendEvent(payload: BaseEvent | Array<BaseEvent>): Axios.IPromise<Axios.AxiosXHR<{}>> {
    // console.log(payload);
    return axios.post(this.key.uri, payload, {
      headers: {
        'Authorization': this.key.token,
        'Content-Length': JSON.stringify(payload).length,
        'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
      }
    });
  }

  private _batchFull(newEvent: BaseEvent): boolean {
    const arrayCopy = this.events.slice();
    arrayCopy.push(newEvent);
    const json = JSON.stringify(arrayCopy);
    const bytes = Buffer.byteLength(json);
    return bytes >= this.batchSize;
  }


  private _runBatch(): void {
    this.batchTimer = setInterval(() => {
      if (!this.locked) {
        if (this.eventPool.length > 0) {
          let event = this.eventPool.shift();
          if (this._batchFull(event)) {
            this._sendBatch();
            this.events = [event];
          } else {
            this.events.push(event);
          }
        }
      }
    }, this.intervalTimer);

  }

  private _sendBatch() {
    this.stopBatch();
    this.emit('sendBatch');
    this._sendEvent(this.events)
        .then((res) => {
          this.startBatch();
        })
        .catch((res: Axios.AxiosXHR<{}>) => {
          if (res.status === 401) {
            this.emit('invalidToken');
          } else {
            this.emit('httpErr', res.status);
          }
        });
  }
}


export interface EventHubClientConfig {
  batching?: boolean;
  batchSize?: number;
  intervalTimer?: number;
  autoSend?: boolean;
  autoSendTimer?: number;
}
