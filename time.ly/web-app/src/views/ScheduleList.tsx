import * as React from 'react';

import { Map, Schedule } from '../types';

export const ScheduleList = () => {
  const [scheduleMap, setScheduleMap] = React.useState<Map<Schedule>>({});

  return (
    <div>
      {Object.entries(scheduleMap).map(([id, schedule]) => (
        <span key={id}>{schedule.name}</span>
      ))}
    </div>
  );
};
