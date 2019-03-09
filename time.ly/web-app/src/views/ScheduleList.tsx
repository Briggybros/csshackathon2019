import * as React from 'react';
import { functions } from 'firebase';
import styled from 'styled-components';

import { Entry, Info, Name, Description } from '../components/List';
import { Footer } from '../components/Footer';

import { capitalise } from '../util';
import { Schedule } from '../types';
import { Button } from '../components/Buttons';

const ScheduleButton = styled(Button)`
  width: 100%;
`;

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
      <ScheduleButton>Schedule Now!</ScheduleButton>
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
