import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { google } from 'googleapis';

const userApis = require('./user_apis');
import { TodosApiHandler } from './todo_apis';
import { ScheduleApiHandlers } from './schedule_apis';

const CONFIG = functions.config();
console.log('config', CONFIG);
const CREDENTIALS = CONFIG['google_calendar'];

const oauth2Client = new google.auth.OAuth2(
  CREDENTIALS && (CREDENTIALS['client_id'] as string),
  CREDENTIALS && (CREDENTIALS['client_secret'] as string),
  ''
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

admin.initializeApp();

const db = admin.firestore();
db.settings({
  timestampsInSnapshots: true,
});

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

exports.getTodaysTodosForUser = functions.https.onCall(
  todosHandlers.getTodaysTodosHandler
);
exports.getThisWeekTodosForUser = functions.https.onCall(
  todosHandlers.getThisWeekTodosHandler
);
exports.addTodosForUser = functions.https.onCall(todosHandlers.addTodosHandler);

const scheduleHandlers = new ScheduleApiHandlers(db);

exports.addScheduleForUser = functions.https.onCall(
  scheduleHandlers.addScheduleHandler
);
exports.deleteScheduleForUser = functions.https.onCall(
  scheduleHandlers.deleteScheduleHandler
);
exports.getSchedulesForUser = functions.https.onCall(
  scheduleHandlers.getSchedulesHandler
);
