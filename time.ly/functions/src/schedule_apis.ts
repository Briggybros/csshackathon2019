import { Timestamp, Firestore, CollectionReference, QueryDocumentSnapshot, DocumentSnapshot } from "@google-cloud/firestore";
import { CallableContext } from "firebase-functions/lib/providers/https";

export const COLLECTION_NAME = 'schedules'

export enum WeekDay {
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
export function validateSchedule (schedule: Schedule) {
    return  typeof schedule === 'object' &&
            schedule.desiredDurationMins &&
            schedule.name && 
            schedule.createdOn &&
            schedule.weeklyFrequency &&
            schedule.preferredDays &&
            Array.isArray(schedule.preferredDays) &&
            typeof schedule.preferredHours === 'object'
}

export function mapQueryToSchedule(s: DocumentSnapshot): Schedule {
    return {
        name: <string>s.get("name"),
        createdOn: <number>s.get("number"),
        desiredDurationMins:<number>s.get("desiredDurationMins"),
        weeklyFrequency: <number>s.get("weeklyFrequency"),
        preferredDays: <WeekDay[]>s.get("preferredDays"),
        preferredHours: <HoursRange>s.get("preferredHours"),
    }
}
export class SchedulesApi {
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

    async scheduleById(id:string):Promise<Schedule> {
        return await this.userSchedules
                .doc(id)
                .get()
                .then(mapQueryToSchedule)
    }
    
    async addSchedules(schedule: Schedule) {
        if (!validateSchedule(schedule)) {
            return Promise.reject('not a valid schedule object')
        }

        return await this
            .userSchedules
            .doc()
            .set(schedule)
    }
}

export class ScheduleApiHandlers {

    constructor(private db: Firestore) {

    }
    addScheduleHandler(data: any, context: CallableContext): any {
        return null
    }
    
    deleteScheduleHandler(data: any, context: CallableContext): any {
        return null
    }
    
    getSchedulesHandler(data: any, context: CallableContext): any {
        return null
    }
}