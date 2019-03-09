
interface ScheduleState {

}

interface ScheduleAction {
    type: string,
    data: any,
}

const Actions = [
    "schedules.get",
    "schedules.add",
    "schedules.delete",
]

export function schedules(state: ScheduleState, action: ScheduleAction): ScheduleState {
    return state
}
