import * as React from 'react';

interface Schedule {
  name: string;
  createdOn: number;
  weeklyFrequency: number;
  preferredDay: number;
  preferredHour: number;
}

interface ScheduleMap {
  [id: string]: Schedule;
}

export const ScheduleList = () => {
  const [scheduleMap, setScheduleMap] = React.useState<ScheduleMap>({});

  return (
    <div>
      {Object.entries(scheduleMap).map(([id, schedule]) => (
        <span key={id}>{schedule.name}</span>
      ))}
    </div>
  );
};
