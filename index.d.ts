declare module 'eventhub-js' {
  function resetToken(): void;
  function createSASToken(hubnamespace: string, hubname: string, key: string, keyName: string): SASToken;
  function findToken(uri: string): SASToken;

  interface SASToken {
    uri: string;
    token: string;
    expiration: number;
    namespace: string;
    hubname: string;
  }

  interface EventHubClientConfig {
    batching?: boolean;
    batchSize?: number;
    intervalTimer?: number;
  }

  class BaseEvent {
    public EventId: string;
    public EventText: string;
    public EventSource: string;

    public UserId: number;
    public OrderId: number;
    public AnonymousId: number;

    constructor(obj?: any);
  }


  class EventHubClient {
    public events: Array<BaseEvent>;
    public eventPool: Array<BaseEvent>;

    constructor(key: SASToken, configParams?: EventHubClientConfig);

    public send(event: BaseEvent): void;
    public stopBatch(): void;
    public refreshToken(token: SASToken): void;

  }
}
