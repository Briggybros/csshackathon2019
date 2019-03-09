import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import { google } from "googleapis";

const userApis = require("./user_apis");
import { TodosApiHandler } from "./todo_apis";
import { ScheduleApiHandlers } from "./schedule_apis";

const CONFIG = functions.config();
console.log("config", CONFIG);
const CREDENTIALS = CONFIG["google_calendar"];

const oauth2Client = new google.auth.OAuth2(
  <string>(CREDENTIALS && CREDENTIALS["client_id"]),
  <string>(CREDENTIALS && CREDENTIALS["client_secret"]),
  ""
);

const scopes = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.events"
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
  timestampsInSnapshots: true
});

console.log("db", db)

exports.addMessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  res.status(200).send("{'message': 'hello world'}");
});

exports.onUserCreate = functions.auth
  .user()
  .onCreate(userApis.onUserCreate(db));
exports.onUserDelete = functions.auth
  .user()
  .onDelete(userApis.onUserDelete(db));

const todosHandlers = new TodosApiHandler(db);
const scheduleHandlers = new ScheduleApiHandlers(db);

console.log("scheduleHandlers", scheduleHandlers)

exports.getTodaysTodosForUser = functions.https.onCall(
  todosHandlers.getTodaysTodosHandler
);
exports.getThisWeekTodosForUser = functions.https.onCall(
  todosHandlers.getThisWeekTodosHandler
);
exports.addTodosForUser = functions.https.onCall(todosHandlers.addTodosHandler);

exports.addScheduleForUser = functions.https.onCall(
  scheduleHandlers.addScheduleHandler
);
exports.deleteScheduleForUser = functions.https.onCall(
  scheduleHandlers.deleteScheduleHandler
);
exports.getScheduleForUser = functions.https.onCall(
  scheduleHandlers.getScheduleHandler
);
exports.getAllSchedulesForUser = functions.https.onCall(
  scheduleHandlers.getAllSchedulesHandler
)
