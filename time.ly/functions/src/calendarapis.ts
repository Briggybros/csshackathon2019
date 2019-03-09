import { Firestore } from '@google-cloud/firestore';
import * as functions from 'firebase-functions'
import {google} from 'googleapis'
import { CalendarSync } from './calendarsync'
import { mapDocToTodoList, TodoList } from './todo_apis'
import { yyyy_mm_dd } from './dateutils'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

export class CalendarApis {
    constructor(private db: Firestore) {
        this.syncCalendarHandler = this.syncCalendarHandler.bind(this)
    }
    
    async getPrimaryCalendar(userId: string): Promise<any> {
        const oauthClient = new google.auth.OAuth2({
            clientId: '',
            clientSecret: '',
            redirectUri: '',
        })
    
        const cred = await this.db
            .collection('users')
            .doc(userId)
            .get()
            .then(userDoc => ({
                accessToken: userDoc.get("accessToken"),
                refreshToken: userDoc.get("refreshToken"),
            }))
        console.log("getPrimaryCalendar-cred set credentials", cred)
        oauthClient.setCredentials({
            refresh_token: cred.refreshToken,
            access_token: cred.accessToken,
        })

        const calendarSync = new CalendarSync(userId, oauthClient)
        return await calendarSync.getPrimaryCalendar()
    }

    async syncCalendarHandler(doc: DocumentSnapshot, context: functions.EventContext) {
        let userId: string = ""
        if (context.auth == null) {
            userId = doc.get("userId")
            if(!userId) {
                return Promise.reject(
                    new functions.https.HttpsError('unauthenticated', "not logged in")
                )
            }
        }
        else {
            userId = context.auth.uid
        }
        
        const oauthClient = new google.auth.OAuth2({
            clientId: '',
            clientSecret: '',
            redirectUri: '',
        })
        
        const todoList: TodoList = mapDocToTodoList(doc)

        try {
            const cred = await this.db
                .collection('users')
                .doc(userId)
                .get()
                .then(userDoc => ({
                    accessToken: userDoc.get("accessToken"),
                    refreshToken: userDoc.get("refreshToken"),
                }))

            oauthClient.setCredentials({
                refresh_token: cred.refreshToken,
                access_token: cred.accessToken,
            })
            const calendarSync = new CalendarSync(userId, oauthClient)
            return await calendarSync.syncWeeklyTodos([todoList])
        } catch(e) {
            console.error("SyncCalendarHandler-", e)
            return new functions.https.HttpsError("unavailable","")
        }
    }
}