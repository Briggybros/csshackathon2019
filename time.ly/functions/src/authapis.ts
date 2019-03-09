import { CallableContext } from 'firebase-functions/lib/providers/https';
import { Firestore } from '@google-cloud/firestore';

export class AuthApis {
    constructor(private db: Firestore,
        private clientId: string,
        private clientSecret: string) {
        this.handleStoreToken = this.handleStoreToken.bind(this)
    }

    async handleStoreToken(data: any, context: CallableContext): Promise<any> {
        console.log("handle store token data", JSON.stringify(data))
        const { code, accessToken, refreshToken } = data
        if(context.auth == null) {
            return Promise.reject("not logged in")
        }
        
        const userId = context.auth.uid
        try {
            await this.db
                .collection("users")
                .doc(userId)
                .update({
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                })
            return {success: true}
        } catch (e) {
            console.error("handleStoreToken-error", e)
        }
    }
}