import { Firestore } from '@google-cloud/firestore';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as functions from 'firebase-functions'
import {google} from 'googleapis'
import { CalendarSync } from './calendarsync'
import { user } from 'firebase-functions/lib/providers/auth';
export class CalendarApis {
    constructor(private db: Firestore) {
    }
    
    async SyncCalendarHandler(data: any, context: CallableContext) {
        if (context.auth == null) {
            return Promise.reject(
                new functions.https.HttpsError('permission-denied', "not logged in")
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
            await calendarSync.syncWeeklyTodos
        } catch(e) {
            console.error("SyncCalendarHandler-", e)
        }
    }

    async scheduleEvents(data: any, context: CallableContext) {

    }
}