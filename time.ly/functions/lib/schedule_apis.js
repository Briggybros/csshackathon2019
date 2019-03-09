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
    return typeof schedule === 'object' &&
        schedule.desiredDurationMins &&
        schedule.name &&
        schedule.createdOn &&
        schedule.weeklyFrequency &&
        schedule.preferredDays &&
        Array.isArray(schedule.preferredDays) &&
        typeof schedule.preferredHours === 'object';
}
exports.validateSchedule = validateSchedule;
function mapQueryToSchedule(s) {
    return {
        name: s.get("name"),
        createdOn: s.get("number"),
        desiredDurationMins: s.get("desiredDurationMins"),
        weeklyFrequency: s.get("weeklyFrequency"),
        preferredDays: s.get("preferredDays"),
        preferredHours: s.get("preferredHours"),
    };
}
exports.mapQueryToSchedule = mapQueryToSchedule;
class SchedulesApi {
    constructor(db, userId) {
        this.db = db;
        this.userId = userId;
        this.db = db;
        this.userId = userId;
        this.userSchedules = db
            .collection('users')
            .doc(this.userId)
            .collection(exports.COLLECTION_NAME);
    }
    schedules() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSchedules.get().then(result => {
                return result.docs.map(mapQueryToSchedule);
            });
        });
    }
    scheduleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSchedules
                .doc(id)
                .get()
                .then(mapQueryToSchedule);
        });
    }
    addSchedules(schedule) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!validateSchedule(schedule)) {
                return Promise.reject('not a valid schedule object');
            }
            return yield this
                .userSchedules
                .doc()
                .set(schedule);
        });
    }
}
exports.SchedulesApi = SchedulesApi;
class ScheduleApiHandlers {
    constructor(db) {
        this.db = db;
    }
    addScheduleHandler(data, context) {
        return null;
    }
    deleteScheduleHandler(data, context) {
        return null;
    }
    getSchedulesHandler(data, context) {
        return null;
    }
}
exports.ScheduleApiHandlers = ScheduleApiHandlers;
//# sourceMappingURL=schedule_apis.js.map