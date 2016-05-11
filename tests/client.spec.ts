import {EventHubClient} from './../src/client';
import {BaseEvent} from './../src/models/event';
import * as auth from './../src/auth';
import {config}from './setup';
import {expect, use as chaiuse} from 'chai';
import * as asPromised from 'chai-as-promised';
import {times} from 'lodash';
import * as sinon from 'sinon';
import * as nock from 'nock';
import * as sourceMaps from 'source-map-support';

sourceMaps.install();
chaiuse(asPromised);

describe('Client', () => {
  beforeEach(() => {
    nock.cleanAll();
  });
  
  describe('#sendSingleEvent(event)', () => {
    it('Should be able to send a single event', () => {
      
      // Setup
      let token = {
        expiration: 100,
        token: 'abc',
        uri: 'http://test.com/messages',
        namespace: 'what',
        hubname: 'what2',
      }
      
      let client = new EventHubClient(token, {batching: false});
      let spy = sinon.spy(client, '_sendSingleEvent');
      let event = new BaseEvent();
      event.EventText = 'Test';
      event.EventSource = 'EventHubJS 1.0 Test';
      let req = nock('http://test.com')
                    .post('/messages', event)
                    .reply(200);
      // Execution
      let promise = client.send(event);

      // Assertions
      expect(spy.calledOnce).to.be.true;
      return expect(promise).to.be.fulfilled;
      
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
      
      //  let token = auth.createSASToken(config.namespace, config.hubname, config.key, config.name);
      let client = new EventHubClient(token, {batching: true, batchSize: (2 * 1024)});
      let wa = times(50, (i) => {
        let event = new BaseEvent();
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
          expect(batchSends).to.be.equal(4);
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
