
interface DateRange {
    startDate: Date,
    endDate: Date,
}
export function dateRangeForDate(d: Date) : DateRange {
    let d1 = new Date(d)
    d1.setHours(0,0,0,0)
    let d2 = new Date(d)
    d2.setHours(23,59,59,999)
    return {
        startDate: d1,
        endDate: d2,
    }
}

export function todaysDateRange() : DateRange {
    return dateRangeForDate(new Date())
}

export function getMonday(d: Date) : Date {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
    d = new Date(d.setDate(diff));
    d.setHours(0,0,0,0)
    return d
}

export function thisWeeksDateRange(): DateRange {
    let d1 = getMonday(new Date())
    let d2 = new Date() 
    d2.setHours(23,59,59,9999)
    return {
        startDate: d1,
        endDate: d2,
    }
}

export function yyyy_mm_dd (date: Date): string {
    return date.toISOString().split('T')[0]
}