import {google} from 'googleapis'
import { CallableContext } from 'firebase-functions/lib/providers/https';
import { Firestore } from '@google-cloud/firestore';

export class AuthApis {
    constructor(private db: Firestore,
        private clientId: string,
        private clientSecret: string) {
        this.handleStoreToken = this.handleStoreToken.bind(this)
    }

    async handleStoreToken(data: any, context: CallableContext): Promise<any> {
        const { code, accessToken, refreshToken } = data
        if(context.auth == null) {
            return Promise.reject("not logged in")
        }
        const userId = context.auth.uid
        return Promise.resolve({success: true})
    }
}