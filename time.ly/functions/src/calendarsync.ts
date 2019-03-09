import * as todoListApis from './todo_apis'
import { google, GoogleApis, calendar_v3} from 'googleapis'


class CalendarSync {
    private calendarClient : calendar_v3.Calendar
    constructor(private userId:string,
        private googleApiToken: string, 
        private clientId: string,
        private clientSecret: string) {
            const oauthClient = new google.auth.OAuth2(
                clientId,
                clientSecret,
                ""
            );
            this.calendarClient = google.calendar({
                version: "v3",
                auth: oauthClient,
            })
            this.syncWeeklyTodos = this.syncWeeklyTodos.bind(this)
            this.getCalendarEvents = this.getCalendarEvents.bind(this)
    }
    
    async syncWeeklyTodos(todoLists: todoListApis.TodoList[]) : Promise<any> {
        return Promise.resolve({ success: true})
    }

    async getCalendarEvents(calendarId: string, dateFrom: Date, dateTo: Date): Promise<any> {
        const events = await this.calendarClient.events.list({
            calendarId,
            timeMin: dateFrom.toISOString(),
            timeMax: dateTo.toISOString(),
        })
        return events.data.items
    }
}