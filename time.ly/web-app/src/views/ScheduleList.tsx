import * as React from 'react';
import { functions } from 'firebase';
import { Entry, Info, Name, Description } from '../components/List';
import { Footer } from '../components/Footer';

import { days, capitalise } from '../util';
import { Map, Schedule } from '../types';

interface Props {
  user: firebase.User;
}

export const ScheduleList = ({ user }: Props) => {
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);

  React.useEffect(() => {
    if (user) {
      functions()
        .httpsCallable('getAllSchedulesForUser')()
        .then(response => {
          return setSchedules(response.data);
        })
        .catch(console.error);
    }
  }, [user]);

  return (
    <>
      {schedules.map(schedule => (
        <Entry key={schedule.name}>
          <Info>
            <Name>{schedule.name}</Name>
            <Description>
              {schedule.weeklyFrequency === 1
                ? 'Once'
                : `${schedule.weeklyFrequency} times`}{' '}
              a week between {schedule.preferredHours.start}:00 and{' '}
              {schedule.preferredHours.end}:00 on{' '}
              {schedule.preferredDays.map(day => `${capitalise(day)} `)}
            </Description>
          </Info>
        </Entry>
      ))}
      <Footer />
    </>
  );
};
