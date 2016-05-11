'use strict';

import * as uuid from 'node-uuid';
import * as moment from 'moment';

export class BaseEvent {
  EventText: string;
  EventId: string = uuid.v4();
  EventSource: string;
  EventCreatedUtcTime: string = moment.utc().format();
  
  constructor() {
    
  }
}
