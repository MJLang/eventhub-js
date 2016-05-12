'use strict';
const uuid = require('node-uuid');
const moment = require('moment');
class BaseEvent {
    constructor(obj) {
        this.EventId = uuid.v4();
        this.EventCreatedUtcTime = moment.utc().format();
        this.EventText = obj && obj.EventText || null;
        this.EventSource = obj && obj.EventSource || null;
        this.UserId = obj && obj.UserId || null;
        this.OrderId = obj && obj.OrderId || null;
        this.AnonymousId = obj && obj.AnonymousId || null;
    }
}
exports.BaseEvent = BaseEvent;
