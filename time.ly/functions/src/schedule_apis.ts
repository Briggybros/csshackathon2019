import {
  Timestamp,
  Firestore,
  CollectionReference,
  QueryDocumentSnapshot,
  DocumentSnapshot,
} from '@google-cloud/firestore';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { user } from 'firebase-functions/lib/providers/auth';

export const COLLECTION_NAME = 'schedules';

export enum WeekDay {
  monday = 'monday',
  tuesday = 'tuesday',
  wednesday = 'wednesday',
  thursday = 'thursday',
  friday = 'friday',
  saturday = 'saturday',
  sunday = 'sunday',
}

interface HoursRange {
  start: number;
  end: number;
}

interface ScheduleId {
  scheduleId: string;
}

interface Schedule {
  name: string;
  createdOn: number;
  desiredDurationMins: number;
  weeklyFrequency: number;
  preferredDays: WeekDay[];
  preferredHours: HoursRange;
  deleted: boolean;
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
export function validateSchedule(schedule: Schedule) {
  return (
    typeof schedule === 'object' &&
    schedule.desiredDurationMins &&
    schedule.name &&
    schedule.createdOn &&
    schedule.weeklyFrequency &&
    schedule.preferredDays &&
    Array.isArray(schedule.preferredDays) &&
    typeof schedule.preferredHours === 'object'
  );
}

export function mapQueryToSchedule(s: DocumentSnapshot): Schedule {
  return {
    name: <string>s.get('name'),
    createdOn: <number>s.get('number'),
    desiredDurationMins: <number>s.get('desiredDurationMins'),
    weeklyFrequency: <number>s.get('weeklyFrequency'),
    preferredDays: <WeekDay[]>s.get('preferredDays'),
    preferredHours: <HoursRange>s.get('preferredHours'),
    deleted: <boolean>s.get('deleted'),
  };
}

async function getUserSchedulesCollection(db: Firestore, userId: string): Promise<CollectionReference> {
  const userDoc = db.collection("users").doc(userId);
  return await userDoc
    .get()
    .then(doc => {
      if (!doc.exists) {
        throw new Error("User does not exist!");
      } else {
        return db
          .collection("users")
          .doc(userId)
          .collection(COLLECTION_NAME);
      }
    })
}

export class SchedulesApi {
  constructor(private db: Firestore, private userSchedules: CollectionReference) {
    this.db = db;
  }

  async schedules(): Promise<Schedule[]> {
    if (this.userSchedules == null) {
      return Promise.reject();
    }
    return await this.userSchedules.get().then(result => {
      return result.docs.map(mapQueryToSchedule).filter(s => !s.deleted);
    });
  }

  async scheduleById(id: string): Promise<Schedule> {
    if (this.userSchedules == null) {
      return Promise.reject();
    }
    return await this.userSchedules
      .doc(id)
      .get()
      .then(mapQueryToSchedule);
  }

  async deleteSchedule(id: string): Promise<any> {
    if (this.userSchedules == null) {
      return Promise.reject();
    }
    return await this.userSchedules.doc(id).update({ deleted: true });
  }

  async addSchedules(schedule: Schedule): Promise<ScheduleId> {
    if (this.userSchedules == null) {
      return Promise.reject();
    }
    if (!validateSchedule(schedule)) {
      return Promise.reject('not a valid schedule object');
    }
    const schedDocRef = this.userSchedules.doc();
    const result = await schedDocRef.set(schedule);

    return { scheduleId: schedDocRef.id };
  }
}
/*

  Requests coming in from the frontend 
{ 

    data {
        userId,
        scheduleId,
    }

    data {
      userId
      activityName,
      duration,
      weeklyFrequency,
      preferredDays,
      preferredHours
    }
}


*/

export class ScheduleApiHandlers {
  constructor(private db: Firestore) {}
  async addScheduleHandler(data: any, context: CallableContext): Promise<any> {
    if(context.auth == null) {
      return { status: "forbidden", code: 403, message: "login first" }
    }
    const {
      activityName,
      duration,
      weeklyFrequency,
      preferredDays,
      preferredHours,
    } = data;
    try {
      const ref = await getUserSchedulesCollection(this.db, context.auth.uid)
      const schedulerApi = new SchedulesApi(this.db, ref);
      const schedule: Schedule = {
        name: activityName,
        createdOn: new Date().getTime(),
        desiredDurationMins: duration,
        weeklyFrequency: weeklyFrequency,
        preferredDays: preferredDays,
        preferredHours: preferredHours,
        deleted: false,
      };
    
      return schedulerApi.addSchedules(schedule);
    } catch {
      return { status: 'error', code: 404, message: 'no user' };
    }
  }

  async deleteScheduleHandler(
    data: any,
    context: CallableContext
  ): Promise<any> {
    if (!context.auth) {
      return {
        status: 'forbidden',
        code: 403,
        message: "You're not authorised",
      };
    }
    const userId = context.auth.uid;
    const { scheduleId } = data;
    try {
      const ref = await getUserSchedulesCollection(this.db, userId)
      const schedulerApi = new SchedulesApi(this.db, ref);
      return schedulerApi.deleteSchedule(scheduleId);
    } catch {
      return { status: 'error', code: 404, message: 'no user' };
    }
  }

  async getScheduleHandler(data: any, context: CallableContext): Promise<any> {
    const { scheduleId } = data;
    if (!context.auth) {
      return {
        status: 'forbidden',
        code: 403,
        message: "You're not authorised",
      };
    }
    const userId = context.auth.uid;

    try {
      const ref = await getUserSchedulesCollection(this.db, userId)
      const schedulerApi = new SchedulesApi(this.db, ref);
      return schedulerApi.scheduleById(scheduleId);
    } catch (e) {
      console.error(e)
      return { status: 'error', code: 404, message: 'no user' };
    }
  }

  async getAllSchedulesHandler(
    data: any,
    context: CallableContext
  ): Promise<any> {
    if (!context.auth) {
      return {
        status: "forbidden",
        code: 403,
        message: "You're not authorised"
      };
    }
    const userId = context.auth.uid;
    try {
      const ref = await getUserSchedulesCollection(this.db, userId)
      const schedulerApi = new SchedulesApi(this.db, ref);
      return schedulerApi.schedules();
    } catch (e) {
      return { status: "error", code: 404, message: "no user" };
    }
  }
}
