import * as auth from './../src/auth';
import { expect } from 'chai';

describe('Auth', () => {
  
  beforeEach(() => {
    auth.resetTokens();
  });
  
  describe('#createSASToken(string, string, string)', () => {
    it('Should be able to create a SASToken', () => {
      let key = auth.createSASToken('Foo', 'Bar', 'Baz');
      expect(key).to.not.be.null;
      expect(key).to.have.property('token');
      expect(key.uri).to.equal('Foo');
    });
    
    it('Should throw an error if not all properties are there', () => {
      expect(() => {
        let key = auth.createSASToken('what', undefined, 'eh');
        
      }).to.throw('Missing Params');
    });
  });
  
  describe('#findToken(string)', () => {
    it('Should return null if token not found', () => {
      let token = auth.findToken('testurli');
      expect(token).to.be.null;
    });
    
    it('Should return the token if it exists', () => {
      // Setup
      let key = auth.createSASToken('Foo', 'Bar', 'Baz');
      // Test
      let token = auth.findToken('Foo');
      expect(token).to.not.be.null;
    });
  });

});
