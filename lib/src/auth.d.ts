import { SASToken } from './interfaces/token';
export declare let currentTokens: {
    [uri: string]: SASToken;
};
export declare function resetTokens(): void;
export declare function createSASToken(hubnamespace: string, hubname: string, key: string, keyName: string): SASToken;
export declare function findToken(uri: string): SASToken;
