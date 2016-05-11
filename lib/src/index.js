"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var client_1 = require('./client');
exports.EventHubClient = client_1.EventHubClient;
__export(require('./auth'));
