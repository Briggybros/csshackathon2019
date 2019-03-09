"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const googleapis_1 = require("googleapis");
const userApis = require('./user_apis');
const todo_apis_1 = require("./todo_apis");
const schedule_apis_1 = require("./schedule_apis");
const CONFIG = functions.config();
console.log("config", CONFIG);
const CREDENTIALS = CONFIG['google_calendar'];
const oauth2Client = new googleapis_1.google.auth.OAuth2((CREDENTIALS && CREDENTIALS['client_id']), (CREDENTIALS && CREDENTIALS['client_secret']), "");
const scopes = [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
];
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp();
const db = admin.firestore();
db.settings({
    timestampsInSnapshots: true,
});
exports.addMessage = functions.https.onRequest((req, res) => {
    const original = req.query.text;
    res.status(200)
        .send("{'message': 'hello world'}");
});
exports.onUserCreate = functions.auth.user().onCreate(userApis.onUserCreate(db));
exports.onUserDelete = functions.auth.user().onDelete(userApis.onUserDelete(db));
const todosHandlers = new todo_apis_1.TodosApiHandler(db);
exports.getTodaysTodosForUser = functions.https.onCall(todosHandlers.getTodaysTodosHandler);
exports.getThisWeekTodosForUser = functions.https.onCall(todosHandlers.getThisWeekTodosHandler);
exports.addTodosForUser = functions.https.onCall(todosHandlers.addTodosHandler);
const scheduleHandlers = new schedule_apis_1.ScheduleApiHandlers(db);
exports.addScheduleForUser = functions.https.onCall(scheduleHandlers.addScheduleHandler);
exports.deleteScheduleForUser = functions.https.onCall(scheduleHandlers.deleteScheduleHandler);
exports.getSchedulesForUser = functions.https.onCall(scheduleHandlers.getSchedulesHandler);
//# sourceMappingURL=index.js.map