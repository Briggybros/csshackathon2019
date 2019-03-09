import * as todoListApis from './todo_apis'
import { google, GoogleApis, calendar_v3} from 'googleapis'
import { OAuth2Client } from 'googleapis-common';
import {  getMonday } from './dateutils'

export class CalendarSync {
    private calendarClient : calendar_v3.Calendar
    constructor(private userId:string, private oauthClient: OAuth2Client) {
            this.calendarClient = google.calendar({
                version: "v3",
                auth: oauthClient,
            })

            this.syncWeeklyTodos = this.syncWeeklyTodos.bind(this)
            this.getCalendarEvents = this.getCalendarEvents.bind(this)
            this.getPrimaryCalendar = this.getPrimaryCalendar.bind(this)
    }
    async getPrimaryCalendar(): Promise<any> {
        const now = new Date()
        const monday = getMonday(now)
        const lastMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() - 7)
        const nextMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7)
        return await this.calendarClient.events.list({
            calendarId:"primary",
            timeMin: lastMonday.toISOString(),
            timeMax: nextMonday.toISOString(),
        }).then(result => {
            return result.data
        })
    }

    async syncWeeklyTodos(todoLists: todoListApis.TodoList[]) : Promise<any> {
        for(let i = 0; i < todoLists.length; i++) {
            let todos = todoLists[i].todos
            if(!todos) {
                continue
            }

            for(let j = 0; j < todos.length; j++) {
                let todo:todoListApis.Todo = todos[j]
                const start: Date = new Date(todo.scheduledDateTime)
                const end: Date = new Date(start.setMinutes(start.getMinutes() + todo.scheduledDurationMins))
                await this.calendarClient.events.insert({
                    calendarId: "primary",
                    requestBody: {
                        start: { dateTime: start.toISOString()},
                        end: { dateTime: end.toISOString()},
                        summary: todo.name,
                        reminders: {
                            useDefault: true,
                        }
                    },
                    sendNotifications: true,
                })
            }
        }
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