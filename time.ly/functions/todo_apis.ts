import { Firestore, QueryDocumentSnapshot, DocumentReference } from "@google-cloud/firestore";

const dateutils = require('./dateutils.js')

export interface Todo {
    dateTime: number,
    weeklySequence: number,
    name: string,
}

export interface TodoList {
    id: string,
    userId: string,
    date: string,
    dateTime: Date,
    todos: Todo[],
}

const TODOLIST_COLLECTION_NAME = "todolists"

export class DailyTodoListApi {
    constructor(private db:Firestore, private userId:string, private todoListRef:DocumentReference,private dateStart:Date, private dateEnd:Date) {
        this.db = db
        this.todoListRef = todoListRef
        this.userId = userId
        this.dateStart = dateStart
        this.dateEnd = dateEnd
    }

    async todos():Promise<any[]> {
        return await this.db.collection(TODOLIST_COLLECTION_NAME)
            .where("userId", "==", this.userId)
            .get()
            .then(data => {
                return data.docs.map(s => s.data)
            })
    }
}


export class TodoListsApi {
    
    constructor(private db:Firestore, private userId:string) {
        
    }

    async createTodoListWithTodos(date:Date, todos: Todo[]) {
        var newTodoList = {
            userId: this.userId,
            date: dateutils.yyyy_mm_dd(date),
            dateTime: date.getTime(),
            todos: todos,
        }

        var dateRange = dateutils.todaysDateRange
        return await this.db
            .collection(TODOLIST_COLLECTION_NAME)
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

    async createTodoList(date:Date) {
        return this.createTodoListWithTodos(date, [])
    }

    async getTodayTodos() :Promise<QueryDocumentSnapshot> {
        const query = this.db
            .collection(TODOLIST_COLLECTION_NAME)
            .where('userId', '==', this.userId)
            .where('date', '==', dateutils.yyyy_mm_dd(new Date()))
            .orderBy('datetime')
            .limit(1)
        return query.get().then((result) => {
            console.log('finished querying data', result.docs[0])
            return result.docs[0]
        })
    }

    async getWeeklyTodos():Promise<any[]> {
        const dateRange = dateutils.thisWeeksDateRange()
        const query = this.db
            .collection(TODOLIST_COLLECTION_NAME)
            .where('userId', '==', this.userId)
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.startDate))
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.endDate))
            .limit(7)
        return await query.get().then(result => {
            console.log("get weekly todos data", result.docs)
            return result.docs.map(s => {
                
            })
        })
    }
}

