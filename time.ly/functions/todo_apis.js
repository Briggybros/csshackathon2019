const dateutils = require('./dateutils.js')

class DailyTodoListApi {
    constructor(db, userId, todoListId, dateStart, dateEnd) {
        this.db = db
        this.todoListId = todoListId
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

    }
}

function CreateNewTodoList() {

}
class TodoListsApi {
    constuctor(db, userId) {
        this.db = db
    }

    createTodoList(date) {
        
    }

    getTodayTodos() {
        dateRange = todaysDateRange()
        dailyTodo = new DailyTodoListApi(this.db, userId, dateRange.startDate, dateRange.endDate)
        return dailyTodo
    }

    getWeeklyTodos() {

    }

    registerFunctionEndpoints(exports, functions) {

    }
}

exports.TodoListsApi = TodoListsApi