const { Firestore } = require('@google-cloud/firestore')

const admin = require('firebase-admin')

function onUserCreate(db) {
    return async ({uid}) => {
        const userRecord = await admin.auth().getUser(uid);
        const uUser = {
            displayName: userRecord.displayName || `${userRecord.uid}`,

        };
    
        const user = validateUser(uUser);
    
        if (!user) {
            console.error('Signin created a bad user: ', uUser);
            return false;
        }

        try {
            await db
            .collection('users')
            .doc(userRecord.uid)
            .set(user);
            return true;
        } catch (error) {
            console.error('Failed to add user to database');
            return false;
        }
    };
  }

function onUserDelete(db) {
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

exports.onUserCreate = onUserCreate
exports.onUserDelete = onUserDelete
