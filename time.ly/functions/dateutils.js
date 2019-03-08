
exports.todaysDateRange = function todaysDateRange() {
    d1 = new Date()
    d1.setHours(0,0,0,0)
    d2 = new Date()
    d2.setHours(23,59,59,999)
    return {
        startDate: d1,
        endDate: d2,
    }
}

exports.getMonday = function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    d = new Date(d.setDate(diff));
    d.setHours(0,0,0,0)
    return d
}

exports.thisWeeksDateRange = function thisWeeksDateRange() {
    d1 = getMonday(new Date())
    d2 = new Date() 
    d2.setHours(23,59,59,9999)
    return {
        startDate: d1,
        endDate: d2,
    }
}
