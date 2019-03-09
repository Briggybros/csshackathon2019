import * as React from 'react';
import { functions } from 'firebase';
import styled from 'styled-components';

import { Button } from '../components/Buttons';

import { Schedule } from '../types';
import { History } from 'history';

const hours = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
];
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const Row = styled.span`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  margin: 0.25rem 1rem;
`;

const ButtonRow = styled(Row)`
  margin-top: auto;
  margin-bottom: 2rem;
  justify-content: center;

  & > button {
    width: 100%;
  }
`;

const DayList = styled.div`
  display: flex;
  flex-direction: column;
  & > span {
    margin-left: 0.25rem;
  }
`;

interface Props {
  history: History;
}

export const AddSchedule = ({ history }: Props) => {
  const [schedule, setSchedule] = React.useState<Schedule>({
    name: 'New Schedule',
    createdOn: Date.now(),
    weeklyFrequency: 1,
    preferredDays: [0],
    preferredHours: {
      from: 6,
      to: 21,
    },
  });

  return (
    <>
      <Row>
        <label>Name:</label>
        <input
          value={schedule.name}
          onChange={e => setSchedule({ ...schedule, name: e.target.value })}
        />
      </Row>
      <Row>
        <label>Frequency:</label>
        <input
          value={schedule.weeklyFrequency}
          onChange={e =>
            setSchedule({
              ...schedule,
              weeklyFrequency: parseInt(e.target.value),
            })
          }
          type="number"
        />
      </Row>
      <Row>
        <DayList>
          <label>Preferred Days:</label>
          {days.map((day, idx) => (
            <span key={day}>
              <input
                type="checkbox"
                checked={schedule.preferredDays.includes(idx)}
                onChange={e => {
                  if (e.target.checked) {
                    setSchedule({
                      ...schedule,
                      preferredDays: [...schedule.preferredDays, idx],
                    });
                  } else {
                    setSchedule({
                      ...schedule,
                      preferredDays: schedule.preferredDays.filter(
                        day => day !== idx
                      ),
                    });
                  }
                }}
              />
              {day}
            </span>
          ))}
        </DayList>
      </Row>
      <Row>
        <label>Preferred Hours:</label>
      </Row>
      <Row>
        <label>From:</label>
        <select
          value={schedule.preferredHours.from}
          onChange={e =>
            setSchedule({
              ...schedule,
              preferredHours: {
                from: parseInt(e.target.value),
                to: schedule.preferredHours.to,
              },
            })
          }
        >
          {hours.map(hour => (
            <option key={hour} value={hour}>
              {hour}:00
            </option>
          ))}
        </select>
      </Row>
      <Row>
        <label>To:</label>
        <select
          value={schedule.preferredHours.to}
          onChange={e =>
            setSchedule({
              ...schedule,
              preferredHours: {
                from: schedule.preferredHours.from,
                to: parseInt(e.target.value),
              },
            })
          }
        >
          {hours.map(hour => (
            <option key={hour} value={hour}>
              {hour}:00
            </option>
          ))}
        </select>
      </Row>
      <ButtonRow>
        <Button
          onClick={() =>
            functions()
              .httpsCallable('addScheduleForUser')(schedule)
              .then(response => {
                history.push('/');
              })
              .catch(console.error)
          }
        >
          Create
        </Button>
      </ButtonRow>
    </>
  );
};
