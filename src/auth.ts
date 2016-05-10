import * as moment from 'moment';
import { createHmac } from 'crypto';
import { SASToken } from './interfaces/token';

export let currentTokens: {[uri: string]: SASToken} = {};

export function createSASToken(uri: string, key: string, keyName: string): SASToken {
  if (!uri || !key || !keyName) {
    throw new Error('Missing Params');
  }
  const expiration = moment().add(15, 'days').unix();
  const toSign = `${encodeURIComponent(uri)}\n${expiration}`;
  const hmac = createHmac('sha256', key);
  hmac.update(toSign);

  const encodeHmac = hmac.digest('base64');
  const token = `SharedAccessSignature sr=${encodeURIComponent(uri)}&sig=${encodeURIComponent(encodeHmac)}&se=${expiration}&skn=${keyName}`;

  const sasToken = {
    token: token,
    expiration: expiration,
    uri: uri
  };
  currentTokens[uri] = sasToken;
  return sasToken;
}

export function findToken(uri: string): SASToken {
  if (currentTokens[uri] && moment().unix() < currentTokens[uri].expiration) {
    return currentTokens[uri];
  } else {
    return null;
  }
}

export function resetTokens(): void {
  currentTokens = {};
}

