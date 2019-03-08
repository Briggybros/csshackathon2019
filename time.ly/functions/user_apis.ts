import { Firestore } from "@google-cloud/firestore";

const admin = require('firebase-admin')

export function onUserCreate(db: Firestore) {
    return async ({uid}) => {
        const userRecord = await admin.auth().getUser(uid);
        const uUser = {
            displayName: userRecord.displayName || `${userRecord.uid}`,
            createdOn: new Date().getTime(),
        };

        try {
            await db
            .collection('users')
            .doc(userRecord.uid)
            .set(uUser);
            return true;
        } catch (error) {
            console.error('Failed to add user to database');
            return false;
        }
    };
  }

export function onUserDelete(db:Firestore) {
    return async (userRecord) => {
        try {
        await db
            .collection('users')
            .doc(userRecord.uid)
            .delete();
            return true;
        } catch (error) {
            console.error('Failed to delete user from database');
            return false;
        }
    };
}