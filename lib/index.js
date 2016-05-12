"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var client_1 = require('./client');
exports.EventHubClient = client_1.EventHubClient;
var event_1 = require('./models/event');
exports.BaseEvent = event_1.BaseEvent;
__export(require('./auth'));
