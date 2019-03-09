import * as React from 'react';

import { Entry, Info, Name, Description } from '../components/List';
import { Footer } from '../components/Footer';

import { days } from '../util';
import { Map, Schedule } from '../types';

export const ScheduleList = () => {
  const [scheduleMap, setScheduleMap] = React.useState<Map<Schedule>>({
    ididd: {
      name: 'Go to the gym',
      createdOn: Date.now(),
      weeklyFrequency: 3,
      preferredDays: [0, 1, 2, 3, 4],
      preferredHours: {
        from: 7,
        to: 21,
      },
    },
  });

  return (
    <>
      {Object.entries(scheduleMap).map(([id, schedule]) => (
        <Entry key={id}>
          <Info>
            <Name>{schedule.name}</Name>
            <Description>
              {schedule.weeklyFrequency === 1
                ? 'Once'
                : `${schedule.weeklyFrequency} times`}{' '}
              a week between {schedule.preferredHours.from}:00 and{' '}
              {schedule.preferredHours.to}:00 on{' '}
              {schedule.preferredDays.map(day => `${days[day]} `)}
            </Description>
          </Info>
        </Entry>
      ))}
      <Footer />
    </>
  );
};
