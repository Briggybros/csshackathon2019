
COLLECTION_NAME = 'schedules'

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
function validateSchedule (schedule) {
    return  typeof schedule === 'object' &&
            schedule.name && 
            schedule.createdOn &&
            schedule.weeklyFrequency &&
            schedule.preferredDays &&
            Array.isArray(schedule.preferredDays) &&
            typeof schedule.preferredTimes === 'object'
}
class SchedulesApi {
    constructor(db, userId) {
        this.db = db
        this.userId = userId
        this.userSchedules = db
            .collection('users')
            .doc(this.userId)
            .collection(COLLECTION_NAME)
    }

    schedules() {
        return this.schedules.get()
    }
    scheduleById(id) {
        return this.userSchedules
                .doc(id)
                .get()
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