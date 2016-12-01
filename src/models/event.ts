import * as uuid from 'node-uuid';
import * as moment from 'moment';

export class BaseEvent {
  public EventId: string = uuid.v4();
  public EventText: string;
  public EventSource: string;

  public UserId: number;
  public OrderId: number;
  public AnonymousId: string;

  private EventCreatedUtcTime: string = moment.utc().format();

  constructor(obj?: any) {
    this.EventText    = obj && obj.EventText    || null;
    this.EventSource  = obj && obj.EventSource  || null;
    this.UserId       = obj && obj.UserId       || null;
    this.OrderId      = obj && obj.OrderId      || null;
    this.AnonymousId  = obj && obj.AnonymousId  || null;
  }
}

