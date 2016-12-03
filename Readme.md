# EventhubJS - Azure Eventhub Uplink
[![npm version](https://badge.fury.io/js/eventhub-js.svg)](https://badge.fury.io/js/eventhub-js)


EventHub JS is a simple integration for [Azure Eventhubs](https://azure.microsoft.com/en-us/services/event-hubs/).
Event Batching support is built in from the start!

## Install

```js
npm install eventhub-js
```

## Usage

```js
const eventhub = require('eventhub-js');

const TOKEN = eventhub.createSASToken(eventhubNamespace, eventhubHubName, key, keyName);
const CLIENT = new eventhub.EventHubClient(TOKEN, {
  // Defaults:
  batching: true,
  batchSize: (1025 * 200),
  intervalTimer: 20
});

// Inherit from this class, to whatever is needed for your eventhub
let event = new eventhub.EventHubEvent();

CLIENT.send(event).then((result: boolean) => {
  // No return
}).catch((err) => {
  // Handle your error
});
```

## Events

EventhubJS uses events to report on its status

```js
CLIENT.on('sendBatch', () => {

});
```

`added` - An Event got added to its batch
`sendBatch` -
`invalidToken` - Authentication Rejected for SASToken
`httpErr` - STATUSCODE - HTTP Error when sending events to eventhub

