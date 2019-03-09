import styled from 'styled-components'

enum Weekdays {
    monday = "Monday",
    tuesday = "Tuesday",
    wednesday = "Wednesday",
    thursday = "Monday",
    friday = "Monday",
    saturday = "Monday",
}

interface HourRange {
    start: number,
    end: number,
}
interface ScheduleProps {
    name: string,
    desiredDuration: number,
    preferredDays: Weekdays[],
    preferredHours: HourRange,
    weeklyFrequency: number,
}

interface SchedulesListProps {
    schedules: ScheduleProps[]
}


const ScheduleItem = (props: ScheduleProps) => (
    <div>
        <span>{props.name}</span>
        <span>{props.desiredDuration} minutes</span>
        <span>{props.weeklyFrequency} times a week</span>
        <span>{props.name}</span>
        <div>
            {
                props.preferredDays.map(d => {<span>{d}</span>})
            }
        </div>
    </div>
)

const ScheduleList = (props: SchedulesListProps) => (
    <div>

    </div>
)