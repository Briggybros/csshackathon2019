"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLECTION_NAME = 'schedules';
var WeekDay;
(function (WeekDay) {
    WeekDay["monday"] = "monday";
    WeekDay["tuesday"] = "tuesday";
    WeekDay["wednesday"] = "wednesday";
    WeekDay["thursday"] = "thursday";
    WeekDay["friday"] = "friday";
    WeekDay["saturday"] = "saturday";
    WeekDay["sunday"] = "sunday";
})(WeekDay = exports.WeekDay || (exports.WeekDay = {}));
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
function validateSchedule(schedule) {
    return (typeof schedule === 'object' &&
        schedule.desiredDurationMins &&
        schedule.name &&
        schedule.createdOn &&
        schedule.weeklyFrequency &&
        schedule.preferredDays &&
        Array.isArray(schedule.preferredDays) &&
        typeof schedule.preferredHours === 'object');
}
exports.validateSchedule = validateSchedule;
function mapQueryToSchedule(s) {
    return {
        name: s.get('name'),
        createdOn: s.get('number'),
        desiredDurationMins: s.get('desiredDurationMins'),
        weeklyFrequency: s.get('weeklyFrequency'),
        preferredDays: s.get('preferredDays'),
        preferredHours: s.get('preferredHours'),
        deleted: s.get('deleted'),
    };
}
exports.mapQueryToSchedule = mapQueryToSchedule;
function getUserSchedulesCollection(db, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDoc = db.collection('users').doc(userId);
        return yield userDoc.get().then(doc => {
            if (!doc.exists) {
                throw new Error('User does not exist!');
            }
            else {
                return db
                    .collection('users')
                    .doc(userId)
                    .collection(exports.COLLECTION_NAME);
            }
        });
    });
}
class SchedulesApi {
    constructor(db, userSchedules) {
        this.db = db;
        this.userSchedules = userSchedules;
        this.db = db;
    }
    schedules() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userSchedules == null) {
                return Promise.reject();
            }
            return yield this.userSchedules.get().then(result => {
                return result.docs.map(mapQueryToSchedule).filter(s => !s.deleted);
            });
        });
    }
    scheduleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userSchedules == null) {
                return Promise.reject();
            }
            return yield this.userSchedules
                .doc(id)
                .get()
                .then(mapQueryToSchedule);
        });
    }
    deleteSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userSchedules == null) {
                return Promise.reject();
            }
            return yield this.userSchedules.doc(id).update({ deleted: true });
        });
    }
    addSchedules(schedule) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.userSchedules == null) {
                return Promise.reject();
            }
            if (!validateSchedule(schedule)) {
                return Promise.reject('not a valid schedule object');
            }
            const schedDocRef = this.userSchedules.doc();
            const result = yield schedDocRef.set(schedule);
            return { scheduleId: schedDocRef.id };
        });
    }
}
exports.SchedulesApi = SchedulesApi;
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
class ScheduleApiHandlers {
    constructor(db) {
        this.db = db;
        console.log('scheduleHandlers-db', this.db);
    }
    addScheduleHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('addScheduleHandler');
            if (context.auth == null) {
                return { status: 'forbidden', code: 403, message: 'login first' };
            }
            const { activityName, duration, weeklyFrequency, preferredDays, preferredHours, } = data;
            try {
                console.log('scheduleHandlers-db', this.db);
                const ref = yield getUserSchedulesCollection(this.db, context.auth.uid);
                console.log('userid', context.auth.uid);
                console.log('users ref', ref);
                const schedulerApi = new SchedulesApi(this.db, ref);
                const schedule = {
                    name: activityName,
                    createdOn: new Date().getTime(),
                    desiredDurationMins: duration,
                    weeklyFrequency: weeklyFrequency,
                    preferredDays: preferredDays,
                    preferredHours: preferredHours,
                    deleted: false,
                };
                return schedulerApi.addSchedules(schedule);
            }
            catch (e) {
                console.log('this.db', this.db);
                console.error(e);
                return { status: 'error', code: 404, message: 'no user' };
            }
        });
    }
    deleteScheduleHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('deleteScheduleHandler');
            if (!context.auth) {
                return {
                    status: 'forbidden',
                    code: 403,
                    message: "You're not authorised",
                };
            }
            console.log('db', this.db);
            const userId = context.auth.uid;
            const { scheduleId } = data;
            try {
                const ref = yield getUserSchedulesCollection(this.db, userId);
                const schedulerApi = new SchedulesApi(this.db, ref);
                return schedulerApi.deleteSchedule(scheduleId);
            }
            catch (_a) {
                return { status: 'error', code: 404, message: 'no user' };
            }
        });
    }
    getScheduleHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`getScheduleHandler data:${data}`);
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
                const ref = yield getUserSchedulesCollection(this.db, userId);
                const schedulerApi = new SchedulesApi(this.db, ref);
                return schedulerApi.scheduleById(scheduleId);
            }
            catch (e) {
                console.error(e);
                return { status: 'error', code: 404, message: 'no user' };
            }
        });
    }
    getAllSchedulesHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!context.auth) {
                return {
                    status: 'forbidden',
                    code: 403,
                    message: "You're not authorised",
                };
            }
            const userId = context.auth.uid;
            try {
                const ref = yield getUserSchedulesCollection(this.db, userId);
                const schedulerApi = new SchedulesApi(this.db, ref);
                return schedulerApi.schedules();
            }
            catch (e) {
                return { status: 'error', code: 404, message: 'no user' };
            }
        });
    }
}
exports.ScheduleApiHandlers = ScheduleApiHandlers;
//# sourceMappingURL=schedule_apis.js.map