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
exports.TODOLIST_COLLECTION_NAME = "todolists";
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
    todos() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db.collection(exports.TODOLIST_COLLECTION_NAME)
                .where("userId", "==", this.userId)
                .get()
                .then(data => {
                return data.docs.map(s => s.data);
            });
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
            var newTodoList = {
                userId: userId,
                date: dateutils.yyyy_mm_dd(date),
                dateTime: date.getTime(),
                todos: todos,
            };
            var dateRange = dateutils.todaysDateRange();
            return yield this.db
                .collection(exports.TODOLIST_COLLECTION_NAME)
                .add(newTodoList)
                .then((docRef) => {
                console.log('created new empty todolist for today for user', userId);
                return new DailyTodoListApi(this.db, userId, docRef, dateRange.startDate, dateRange.endDate);
            })
                .catch(err => {
                console.log("error creating new todolist", err);
            });
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
            return query.get().then((result) => {
                console.log('finished querying data', result.docs[0]);
                return result.docs[0];
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
                .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.endDate))
                .limit(7);
            return yield query.get().then(result => {
                console.log("get weekly todos data", result.docs);
                return result.docs.map(s => {
                });
            });
        });
    }
}
exports.TodoListsApi = TodoListsApi;
class TodosApiHandler {
    constructor(db) {
        this.db = db;
    }
    getTodaysTodosHandler(data, context) {
        return null;
    }
    getThisWeekTodosHandler(data, context) {
        return null;
    }
    addTodosHandler(data, context) {
        return null;
    }
}
exports.TodosApiHandler = TodosApiHandler;
//# sourceMappingURL=todo_apis.js.map