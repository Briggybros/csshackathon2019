"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function dateRangeForDate(d) {
    let d1 = new Date(d);
    d1.setHours(0, 0, 0, 0);
    let d2 = new Date(d);
    d2.setHours(23, 59, 59, 999);
    return {
        startDate: d1,
        endDate: d2,
    };
}
exports.dateRangeForDate = dateRangeForDate;
function todaysDateRange() {
    return dateRangeForDate(new Date());
}
exports.todaysDateRange = todaysDateRange;
function getMonday(dd) {
    let d = new Date(dd);
    let day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    d = new Date(d.setDate(diff));
    d.setHours(0, 0, 0, 0);
    return d;
}
exports.getMonday = getMonday;
function thisWeeksDateRange() {
    let d1 = getMonday(new Date());
    let d2 = new Date();
    d2.setHours(23, 59, 59, 9999);
    return {
        startDate: d1,
        endDate: d2,
    };
}
exports.thisWeeksDateRange = thisWeeksDateRange;
function yyyy_mm_dd(date) {
    return date.toISOString().split('T')[0];
}
exports.yyyy_mm_dd = yyyy_mm_dd;
//# sourceMappingURL=dateutils.js.map