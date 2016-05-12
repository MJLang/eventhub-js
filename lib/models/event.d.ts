export declare class BaseEvent {
    EventId: string;
    EventText: string;
    EventSource: string;
    UserId: number;
    OrderId: number;
    AnonymousId: string;
    private EventCreatedUtcTime;
    constructor(obj?: any);
}
