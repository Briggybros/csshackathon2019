"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dateutils = require("./dateutils.js");
exports.TODOLIST_COLLECTION_NAME = 'todolists';
exports.TODOS_COLLECTION_NAME = 'todos';
function mapToTodoItem(doc) {
    return {
        scheduledDateTime: doc.get('scheduledDateTime'),
        scheduledDurationMins: doc.get('scheduledDurationMins'),
        done: doc.get('done'),
        todoId: doc.id,
        name: doc.get("name"),
        scheduleId: doc.get("scheduleId"),
        doneAt: doc.get("doneAt")
    };
}
function mapDocToTodoList(doc) {
    return {
        id: doc.id,
        userId: doc.get('userId'),
        date: doc.get('date'),
        todos: doc.get('todos').map(mapToTodoItem),
    };
}
class DailyTodoListApi {
    constructor(db, userId, todoListRef, dateStart, dateEnd) {
        this.db = db;
        this.userId = userId;
        this.todoListRef = todoListRef;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
        this.db = db;
        this.todoListRef = todoListRef;
        this.userId = userId;
        this.dateStart = dateStart;
        this.dateEnd = dateEnd;
    }
    getTodos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .collection(exports.TODOLIST_COLLECTION_NAME)
                .where('userId', '==', this.userId)
                .get()
                .then(data => {
                return data.docs.map(s => s.data);
            });
        });
    }
    addTodos(todos) {
        return __awaiter(this, void 0, void 0, function* () {
            const todosRef = this.todoListRef.collection(exports.TODOS_COLLECTION_NAME);
            const batch = this.db.batch();
            for (let i = 0; i < todos.length; i++) {
                const singleTodoRef = todosRef.doc();
                batch.set(singleTodoRef, todos[i]);
            }
            return batch.commit();
        });
    }
}
exports.DailyTodoListApi = DailyTodoListApi;
class TodoListsApi {
    constructor(db) {
        this.db = db;
    }
    createTodoListWithTodos(userId, date, todos) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTodoList = {
                id: '',
                userId: userId,
                date: dateutils.yyyy_mm_dd(date),
                todos: todos,
            };
            var dateRange = dateutils.todaysDateRange();
            return yield this.db
                .collection(exports.TODOLIST_COLLECTION_NAME)
                .add(newTodoList)
                .then(docRef => {
                console.log('created new empty todolist for today for user', userId);
                const todoListApi = new DailyTodoListApi(this.db, userId, docRef, dateRange.startDate, dateRange.endDate);
                return todoListApi.addTodos(todos);
            })
                .catch(err => {
                console.log('error creating new todolist', err);
            });
        });
    }
    tickTodo(todoId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db
                .collection(exports.TODOS_COLLECTION_NAME)
                .doc(todoId)
                .update({ done: true, doneAt: new Date() });
        });
    }
    createTodoList(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createTodoListWithTodos(userId, date, []);
        });
    }
    getTodayTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = this.db
                .collection(exports.TODOLIST_COLLECTION_NAME)
                .where('userId', '==', userId)
                .where('date', '==', dateutils.yyyy_mm_dd(new Date()))
                .orderBy('datetime')
                .limit(1);
            return query.get().then(result => {
                console.log('finished querying data', result.docs[0]);
                return mapDocToTodoList(result.docs[0]);
            });
        });
    }
    getWeeklyTodos(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateRange = dateutils.thisWeeksDateRange();
            const query = this.db
                .collection(exports.TODOLIST_COLLECTION_NAME)
                .where('userId', '==', userId)
                .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.startDate))
                .where('date', '<=', dateutils.yyyy_mm_dd(dateRange.endDate))
                .limit(7);
            return yield query.get().then(result => {
                console.log('get weekly todos data', result.docs);
                return result.docs.map(mapDocToTodoList);
            });
        });
    }
}
exports.TodoListsApi = TodoListsApi;
/**
 *    data
 *        {
 *        name,
 *        datetime,
 *        duration,
 *        done
 *        }
 *
 */
class TodosApiHandler {
    constructor(db) {
        this.db = db;
    }
    getTodaysTodosHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const listsApi = new TodoListsApi(this.db);
            if (!context.auth) {
                return {
                    status: 'forbidden',
                    code: 403,
                    message: "You're not authorised",
                };
            }
            const userId = context.auth.uid;
            return listsApi.getTodayTodos(userId);
        });
    }
    getThisWeekTodosHandler(data, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const listsApi = new TodoListsApi(this.db);
            if (!context.auth) {
                return {
                    status: 'forbidden',
                    code: 403,
                    message: "You're not authorised",
                };
            }
            const userId = context.auth.uid;
            return listsApi.getWeeklyTodos(userId);
        });
    }
    addTodosHandler(data, context) {
        const listsApi = new TodoListsApi(this.db);
        if (!context.auth) {
            return {
                status: 'forbidden',
                code: 403,
                message: "You're not authorised",
            };
        }
        const userId = context.auth.uid;
        const { name, datetime, duration, scheduleId } = data;
        const thisToDo = {
            scheduledDateTime: datetime,
            scheduledDurationMins: duration,
            done: false,
            name: name,
            scheduleId: scheduleId,
        };
        const todoListApiDB = listsApi.createTodoListWithTodos(userId, datetime, [
            thisToDo,
        ]);
        return todoListApiDB;
    }
    tickToDo(data, context) {
        const { todoId } = data;
        const listsApi = new TodoListsApi(this.db);
        if (!context.auth) {
            return {
                status: "forbidden",
                code: 403,
                message: "You're not authorised"
            };
        }
        const userId = context.auth.uid;
        return listsApi.tickTodo(todoId);
    }
}
exports.TodosApiHandler = TodosApiHandler;
/** TODO:
 * 2. Front end handlers
 *    - Get TODOLISTS
 *          - Get ToDoLIST
 *              - Get ToDo
 * 3. Fix createTodoListWithTodos
 */
//# sourceMappingURL=todo_apis.js.map