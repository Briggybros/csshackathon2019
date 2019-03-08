const functions = require('firebase-functions');

const { google } = require('googleapis')

const CONFIG = functions.config()
const CLIENT_ID = CONFIG.google_calendar.client_id
const CLIENT_SECRET = CONFIG.google_calendar.client_secret

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
const admin = require('firebase-admin')

admin.initializeApp()

exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    res.send(200, "{'message': 'hello world'}")
})