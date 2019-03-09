import { Firestore } from '@google-cloud/firestore';
import { CallableContext } from 'firebase-functions/lib/providers/https';
import * as functions from 'firebase-functions';
import { SchedulesApi, getUserSchedulesCollection } from './schedule_apis';
import { TodoListsApi, TodoList } from './todo_apis';
import { CalendarSync } from './calendarsync';
import { google } from 'googleapis';

export class SchedularApis {
  constructor(private db: Firestore) {
    const weeklyTodoListsHandler = async (
      data: any,
      context: CallableContext
    ): Promise<any> => {
      if (context.auth == null) {
        return Promise.reject(
          new functions.https.HttpsError('unauthenticated', 'not logged in')
        );
      }
      const userId = context.auth.uid;
      const ref = await getUserSchedulesCollection(this.db, context.auth.uid);
      console.log('userid', context.auth.uid);
      console.log('users ref', ref);
      const schedulesApi = new SchedulesApi(this.db, ref);

      const schedules = await schedulesApi.schedules();

      // TODO: Call python script and AWAIT

      const returnedTodos: TodoList[] = <TodoList[]>(<any>null); // python script returns

      const todoAPI = new TodoListsApi(this.db);
      for (var i = 0; i < returnedTodos.length; i++) {
        await todoAPI.createTodoListWithTodos(
          userId,
          new Date(Date.parse(returnedTodos[i].date)),
          returnedTodos[i].todos
        );
      }
      const oauthClient = new google.auth.OAuth2({
        clientId: '',
        clientSecret: '',
        redirectUri: '',
      });
      const cred = await this.db
        .collection('users')
        .doc(userId)
        .get()
        .then(userDoc => ({
          accessToken: userDoc.get('accessToken'),
          refreshToken: userDoc.get('refreshToken'),
        }));

      oauthClient.setCredentials({
        refresh_token: cred.refreshToken,
        access_token: cred.accessToken,
      });
      const calendarSync = new CalendarSync(userId, oauthClient);

      await calendarSync.syncWeeklyTodos(returnedTodos);
      /**
       * 1. Read userId from context
       * 2. Load [schedules]
       * 3. call python script (with whatever context / json)
       * 4. recieve the output, toDo strucutre
       * 5. use Todo apis to save todo to database
       * 6. sync events to calendar!
       */
    };
  }
}
