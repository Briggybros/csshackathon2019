import { Firestore } from '@google-cloud/firestore';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as functions from 'firebase-functions'
import {google} from 'googleapis'
import { CalendarSync } from './calendarsync'

import { yyyy_mm_dd } from './dateutils'

export class CalendarApis {
    constructor(private db: Firestore) {
        this.SyncCalendarHandler = this.SyncCalendarHandler.bind(this)
    }
    
    async SyncCalendarHandler(data: any, context: CallableContext) {
        if (context.auth == null) {
            return Promise.reject(
                new functions.https.HttpsError('unauthenticated', "not logged in")
            )
        }
        const userId = context.auth.uid
        const oauthClient = new google.auth.OAuth2({
            clientId: '',
            clientSecret: '',
            redirectUri: '',
        })

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
            return await calendarSync.syncWeeklyTodos([{
                id: "1234",
                userId: "1234",
                date: yyyy_mm_dd(new Date()),
                todos: [{
                    todoId: '12345',
                    scheduledDateTime: new Date().getTime(),
                    done: false,
                    scheduledDurationMins: 60,
                    name: 'gym',
                }]
            }])
        } catch(e) {
            console.error("SyncCalendarHandler-", e)
            return new functions.https.HttpsError("unavailable","")
        }
    }
}