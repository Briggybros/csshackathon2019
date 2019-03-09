import * as todoListApis from './todo_apis'
import { google, GoogleApis, calendar_v3} from 'googleapis'
import { OAuth2Client } from 'googleapis-common';


export class CalendarSync {
    private calendarClient : calendar_v3.Calendar
    constructor(private userId:string, private oauthClient: OAuth2Client) {
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

    async getCalendarEvents(dateFrom: Date, dateTo: Date): Promise<any> {
        const events = await this.calendarClient.events.list({
            timeMin: dateFrom.toISOString(),
            timeMax: dateTo.toISOString(),
        })
        return events.data.items
    }
    
}