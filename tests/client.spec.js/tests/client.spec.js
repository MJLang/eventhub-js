"use strict";
const client_1 = require('./../src/client');
const event_1 = require('./../src/models/event');
const auth = require('./../src/auth');
const setup_1 = require('./setup');
const chai_1 = require('chai');
const asPromised = require('chai-as-promised');
const lodash_1 = require('lodash');
const sinon = require('sinon');
const nock = require('nock');
const sourceMaps = require('source-map-support');
sourceMaps.install();
chai_1.use(asPromised);
describe('Client', () => {
    beforeEach(() => {
        nock.cleanAll();
    });
    describe('General', () => {
        it('Should emit an event if the token is wrong', (done) => {
            let token = auth.createSASToken(setup_1.config.namespace, setup_1.config.hubname, 'dasdada', setup_1.config.name);
            let client = new client_1.EventHubClient(token, { batching: false });
            let event = new event_1.BaseEvent({ EventText: 'Test', EventSource: 'Test 1' });
            client.send(event);
            let eventFired = false;
            client.on('invalidToken', () => {
                eventFired = true;
            });
            setTimeout(() => {
                chai_1.expect(eventFired).to.be.true;
                done();
            }, 200);
        });
    });
    describe('#sendSingleEvent(event)', () => {
        it('Should be able to send a single event', () => {
            let token = {
                expiration: 100,
                token: 'abc',
                uri: 'http://test.com/messages',
                namespace: 'what',
                hubname: 'what2',
            };
            let client = new client_1.EventHubClient(token, { batching: false });
            let spy = sinon.spy(client, '_sendSingleEvent');
            let event = new event_1.BaseEvent();
            event.EventText = 'Test';
            event.EventSource = 'EventHubJS 1.0 Test';
            let req = nock('http://test.com')
                .post('/messages', event)
                .reply(200);
            let promise = client.send(event);
            chai_1.expect(spy.calledOnce).to.be.true;
            return chai_1.expect(promise).to.be.fulfilled;
        });
    });
    describe('#sendingBatchEvent(eventArray)', () => {
        it('should batch events and then send them', (done) => {
            let token = {
                expiration: 100,
                token: 'abc',
                uri: 'http://test.com/messages',
                namespace: 'what',
                hubname: 'what2',
            };
            let req = nock('http://test.com')
                .persist()
                .post('/messages')
                .reply(200);
            let client = new client_1.EventHubClient(token, { batching: true, batchSize: (2 * 1024) });
            let wa = lodash_1.times(50, (i) => {
                let event = new event_1.BaseEvent();
                event.EventText = 'Test-Timeout' + i;
                event.EventSource = 'EventHubJS 1.0 Test ' + i;
                return client.send(event);
            });
            let batchSends = 0;
            client.on('sendBatch', () => {
                batchSends = batchSends + 1;
            });
            Promise.all(wa).then(() => {
                setTimeout(() => {
                    chai_1.expect(batchSends).to.be.equal(5);
                    client.stopBatch();
                    done();
                }, 1500);
            }).catch((err) => {
                console.log('EEEEER');
                console.log(err);
                done();
            });
        });
    });
});
