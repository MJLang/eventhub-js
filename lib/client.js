'use strict';
const axios = require('axios');
const events_1 = require('events');
class EventHubClient extends events_1.EventEmitter {
    constructor(key, configParams) {
        super();
        this.key = key;
        this.events = [];
        this.eventPool = [];
        let config = {
            batching: true,
            batchSize: (1025 * 200),
            intervalTimer: 20,
            autoSend: false,
            autoSendTimer: (1000 * 60 * 20)
        };
        Object.assign(config, configParams);
        this.batching = config && config.batching;
        this.batchSize = config && config.batchSize;
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
    send(event) {
        if (!this.batching) {
            return this._sendSingleEvent(event);
        }
        else {
            return this._batchEvent(event).then(() => {
                return this.emit('added');
            });
        }
    }
    stopBatch() {
        this.locked = true;
        if (this.batchTimer) {
            clearInterval(this.batchTimer);
        }
    }
    startBatch() {
        this.locked = false;
        this._runBatch();
    }
    refreshToken(token) {
        this.key = token;
        if (this.batching) {
            this.startBatch();
        }
    }
    sendBatch() {
        this._sendBatch();
    }
    _enableAutoSend() {
        this.autoSendToken = setInterval(() => {
            if (this.events.length > 0) {
                this.sendBatch();
            }
        }, this.autoSendTimer);
    }
    _sendSingleEvent(event) {
        return new Promise((resolve, reject) => {
            this._sendEvent(event).then((res) => {
                return resolve(true);
            })
                .catch((res) => {
                if (res.status === 401) {
                    this.emit('invalidToken');
                }
                else {
                    this.emit('httpErr', res.status);
                }
                return reject(false);
            });
        });
    }
    _batchEvent(event) {
        return new Promise((resolve, reject) => {
            this.eventPool.push(event);
            resolve();
        });
    }
    _sendEvent(payload) {
        return axios.post(this.key.uri, payload, {
            headers: {
                'Authorization': this.key.token,
                'Content-Length': JSON.stringify(payload).length,
                'Content-Type': 'application/atom+xml;type=entry;charset=utf-8'
            }
        });
    }
    _batchFull(newEvent) {
        const arrayCopy = this.events.slice();
        arrayCopy.push(newEvent);
        const json = JSON.stringify(arrayCopy);
        const bytes = Buffer.byteLength(json);
        return bytes >= this.batchSize;
    }
    _runBatch() {
        this.batchTimer = setInterval(() => {
            if (!this.locked) {
                if (this.eventPool.length > 0) {
                    let event = this.eventPool.shift();
                    if (this._batchFull(event)) {
                        this._sendBatch();
                        this.events = [event];
                    }
                    else {
                        this.events.push(event);
                    }
                }
            }
        }, this.intervalTimer);
    }
    _sendBatch() {
        this.stopBatch();
        this.emit('sendBatch');
        this._sendEvent(this.events)
            .then((res) => {
            this.startBatch();
        })
            .catch((res) => {
            if (res.status === 401) {
                this.emit('invalidToken');
            }
            else {
                this.emit('httpErr', res.status);
            }
        });
    }
}
exports.EventHubClient = EventHubClient;
