import { Timestamp, Firestore, CollectionReference, QueryDocumentSnapshot } from "@google-cloud/firestore";

const COLLECTION_NAME = 'schedules'

enum WeekDay {
    monday = "monday",
    tuesday = "tuesday",
    wednesday = "wednesday",
    thursday = "thursday",
    friday = "friday",
    saturday = "saturday",
    sunday = "sunday",
}

interface HoursRange {
    start: number,
    end: number
}

interface Schedule {
    name: string,
    createdOn: number,
    desiredDurationMins: number,
    weeklyFrequency: number,
    preferredDays: WeekDay[],
    preferredHours: HoursRange,
}
/**
 * schedule schema
 * {
 *  name: string,
 *  createdOn: timestamp,
 *  weeklyFrequency: integer,
 *  preferredDays: array of Enum('monday', 'tuesday', ...),
 *  preferredTimes: { 'start' : integer, 'end': integer } // 24 hour format
 * }
 */
function validateSchedule (schedule: Schedule) {
    return  typeof schedule === 'object' &&
            schedule.desiredDurationMins &&
            schedule.name && 
            schedule.createdOn &&
            schedule.weeklyFrequency &&
            schedule.preferredDays &&
            Array.isArray(schedule.preferredDays) &&
            typeof schedule.preferredHours === 'object'
}

function mapQueryToSchedule(s: QueryDocumentSnapshot): Schedule {
    return {
        name: <string>s.get("name"),
        createdOn: <number>s.get("number"),
        desiredDurationMins:<number>s.get("desiredDurationMins"),
        weeklyFrequency: <number>s.get("weeklyFrequency"),
        preferredDays: <WeekDay[]>s.get("preferredDays"),
        preferredHours: <HoursRange>s.get("preferredHours"),
    }
}
class SchedulesApi {
    private userSchedules: CollectionReference
    
    constructor(private db:Firestore, private userId: string) {
        this.db = db
        this.userId = userId
        this.userSchedules = db
            .collection('users')
            .doc(this.userId)
            .collection(COLLECTION_NAME)
    }

    async schedules():Promise<Schedule[]> {
        return await this.userSchedules.get().then(result => {
            return result.docs.map(mapQueryToSchedule)
        })
    }

    async scheduleById(id):Promise<Schedule> {
        return await this.userSchedules
                .doc(id)
                .get()
                .then(mapQueryToSchedule)
    }
    
    addSchedules(schedule) {
        if (!validateSchedule(schedule)) {
            return Promise.reject('not a valid schedule object')
        }

        return this
            .userSchedules
            .doc()
            .set(schedule)
    }
}