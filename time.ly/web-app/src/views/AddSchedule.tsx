import * as React from 'react';
import { functions } from 'firebase';

import { History } from 'history';
import styled from 'styled-components';

import { Button } from '../components/Buttons';

import { days, hours } from '../util';
import { Schedule } from '../types';

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
    weeklyFrequency: 1,
    preferredDays: ['monday'],
    preferredHours: {
      start: 6,
      end: 21,
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
                checked={schedule.preferredDays.includes(day.toLowerCase())}
                onChange={e => {
                  if (e.target.checked) {
                    setSchedule({
                      ...schedule,
                      preferredDays: [
                        ...schedule.preferredDays,
                        day.toLowerCase(),
                      ],
                    });
                  } else {
                    setSchedule({
                      ...schedule,
                      preferredDays: schedule.preferredDays.filter(
                        fday => fday !== day.toLowerCase()
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
          value={schedule.preferredHours.start}
          onChange={e =>
            setSchedule({
              ...schedule,
              preferredHours: {
                start: parseInt(e.target.value),
                end: schedule.preferredHours.end,
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
          value={schedule.preferredHours.end}
          onChange={e =>
            setSchedule({
              ...schedule,
              preferredHours: {
                start: schedule.preferredHours.start,
                end: parseInt(e.target.value),
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
                console.log(response);
                if (response.data.status === 'error') {
                  console.error(response.data.message);
                } else {
                  history.push('/');
                }
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
