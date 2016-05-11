"use strict";
const moment = require('moment');
const crypto_1 = require('crypto');
exports.currentTokens = {};
function resetTokens() {
    exports.currentTokens = {};
}
exports.resetTokens = resetTokens;
function createSASToken(hubnamespace, hubname, key, keyName) {
    if (!hubnamespace || !key || !keyName) {
        throw new Error('Missing Params');
    }
    const uri = `https://${hubnamespace}.servicebus.windows.net/${hubname}/messages`;
    const expiration = moment().add(15, 'days').unix();
    const toSign = `${encodeURIComponent(uri)}\n${expiration}`;
    const hmac = crypto_1.createHmac('sha256', key);
    hmac.update(toSign);
    const encodeHmac = hmac.digest('base64');
    const token = `SharedAccessSignature sr=${encodeURIComponent(uri)}&sig=${encodeURIComponent(encodeHmac)}&se=${expiration}&skn=${keyName}`;
    const sasToken = {
        token: token,
        expiration: expiration,
        namespace: hubnamespace,
        hubname: hubname,
        uri: uri
    };
    exports.currentTokens[hubnamespace] = sasToken;
    return sasToken;
}
exports.createSASToken = createSASToken;
function findToken(uri) {
    if (exports.currentTokens[uri] && moment().unix() < exports.currentTokens[uri].expiration) {
        return exports.currentTokens[uri];
    }
    else {
        return null;
    }
}
exports.findToken = findToken;
