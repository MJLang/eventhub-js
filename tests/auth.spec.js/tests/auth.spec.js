"use strict";
const auth = require('./../src/auth');
const chai_1 = require('chai');
describe('Auth', () => {
    beforeEach(() => {
        auth.resetTokens();
    });
    describe('#createSASToken(string, string, string)', () => {
        it('Should be able to create a SASToken', () => {
            let key = auth.createSASToken('Foo', 'ok', 'Bar', 'Baz');
            chai_1.expect(key).to.not.be.null;
            chai_1.expect(key).to.have.property('token');
            chai_1.expect(key.uri).to.equal('https://Foo.servicebus.windows.net/ok/messages');
        });
        it('Should throw an error if not all properties are there', () => {
            chai_1.expect(() => {
                let key = auth.createSASToken('what', 'ok', undefined, 'eh');
            }).to.throw('Missing Params');
        });
    });
    describe('#findToken(string)', () => {
        it('Should return null if token not found', () => {
            let token = auth.findToken('testurli');
            chai_1.expect(token).to.be.null;
        });
        it('Should return the token if it exists', () => {
            let key = auth.createSASToken('Foo', 'ok', 'Bar', 'Baz');
            let token = auth.findToken('Foo');
            chai_1.expect(token).to.not.be.null;
        });
    });
});
