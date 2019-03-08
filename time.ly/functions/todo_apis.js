const dateutils = require('./dateutils.js')

class DailyTodoListApi {
    constructor(db, userId, todoListRef, dateStart, dateEnd) {
        this.db = db
        this.todoListRef = todoListRef
        this.userId = userId
        this.dateStart = dateStart
        this.dateEnd = dateEnd
    }

    createTodoList(name, datetime) {
        if (this.dateStart > datetime || datetime > this.dateEnd) {
            return Promise.reject(`datetime outside date range ${this.startDate} ~ ${this.endDate}`)
        }
        
        this.db.collection("todolists")
    }

    getTodos() {
        this.db.collection("todolists")
            .doc()
    }
}

const COLLECTION_NAME = "todolists"

class TodoListsApi {
    
    constuctor(db, userId) {
        this.db = db
    }

    createTodoListWithTodos(date, todos) {
        var newTodoList = {
            userId: this.userId,
            date: dateutils.yyyy_mm_dd(d),
            dateTime: date.getTime(),
            todos: todos,
        }

        var dateRange = dateutils.todaysDateRange
        return this.db
            .collection(COLLECTION_NAME)
            .add(newTodoList)
            .then((docRef) => {
                console.log('created new empty todolist for today for user', this.userId)
                return new DailyTodoListApi(
                    this.db,
                    this.userId,
                    docRef,
                    dateRange.startDate,
                    dateRange.endDate,
                )
            })
            .catch(err => {
                console.log("error creating new todolist", err)
            })
    }

    createTodoList(date) {
        return this.createTodoListWithTodos(date, [])
    }

    getTodayTodos() {
        const query = this.db
            .collection(COLLECTION_NAME)
            .where('userId', '==', this.userId)
            .where('date', '==', dateutils.yyyy_mm_dd(new Date()))
            .orderBy('datetime')
            .limit(1)
        return query.then((result) => {
            console.log('finished querying data', result.data())
        })
    }

    getWeeklyTodos() {
        const dateRange = dateutils.thisWeeksDateRange()
        const query = this.db
            .collection(COLLECTION_NAME)
            .where('userId', '==', this.userId)
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.startDate))
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.endDate))
            .limit(7)
        return query.then(result => {
            console.log("get weekly todos data", result.data())
        })
    }

    registerFunctionEndpoints(exports, functions) {

    }
}

exports.TodoListsApi = TodoListsApi