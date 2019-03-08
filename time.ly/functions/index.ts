import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

const { google } = require('googleapis')

const userApis = require('./user_apis')
const todoApis = require('./todo_apis')
const schedulesApi = require('./schedule_apis')

const CONFIG = functions.config()
console.log(CONFIG)
const CLIENT_ID = CONFIG || CONFIG.google_calendar.client_id
const CLIENT_SECRET = CONFIG || CONFIG.google_calendar.client_secret

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    ""
);

const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
]

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

admin.initializeApp()

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    res.status(200)
        .send("{'message': 'hello world'}")
})

exports.onUserCreate = functions.auth.user().onCreate(userApis.onUserCreate(db))
exports.onUserDelete = functions.auth.user().onDelete(userApis.onUserDelete(db))

exports.getTodayTodos = functions.https.onCall()