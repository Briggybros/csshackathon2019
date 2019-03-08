import { Firestore, QueryDocumentSnapshot, DocumentReference } from "@google-cloud/firestore";
import { CallableContext } from "firebase-functions/lib/providers/https";

import * as dateutils from './dateutils.js'
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export interface Todo {
    scheduledDateTime: number,
    scheduledDurationMins: number, 
    preferredDateTimes: Date[],
    weeklySequence: number,
    done: boolean,
    name: string,
    scheduleId?: string
}

export interface TodoList {
    id?: string,
    userId: string,
    date: string,
    todos: Todo[],
}

export const TODOLIST_COLLECTION_NAME = "todolists"

function mapDocToTodoList(doc: DocumentSnapshot) : TodoList {
    return {
        id: doc.id,
        userId: doc.get("userId"),
        date: doc.get("date"),
        todos: doc.get("todos"),
    }
}
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
    
    constructor(private db:Firestore) {
        
    }

    async createTodoListWithTodos(userId:string, date:Date, todos: Todo[]) {
        const newTodoList: TodoList = {
            id: "",
            userId: userId,
            date: dateutils.yyyy_mm_dd(date),
            todos: todos,
        }

        var dateRange = dateutils.todaysDateRange()
        return await this.db
            .collection(TODOLIST_COLLECTION_NAME)
            .add(newTodoList)
            .then((docRef) => {
                console.log('created new empty todolist for today for user', userId)
                return new DailyTodoListApi(
                    this.db,
                    userId,
                    docRef,
                    dateRange.startDate,
                    dateRange.endDate,
                )
            })
            .catch(err => {
                console.log("error creating new todolist", err)
            })
    }

    async createTodoList(userId:string, date:Date) {
        return this.createTodoListWithTodos(userId, date, [])
    }

    async getTodayTodos(userId:string) :Promise<TodoList> {
        const query = this.db
            .collection(TODOLIST_COLLECTION_NAME)
            .where('userId', '==', userId)
            .where('date', '==', dateutils.yyyy_mm_dd(new Date()))
            .orderBy('datetime')
            .limit(1)
        return query.get().then((result) => {
            console.log('finished querying data', result.docs[0])
            return mapDocToTodoList(result.docs[0])
        })
    }

    async getWeeklyTodos(userId:string):Promise<any[]> {
        const dateRange = dateutils.thisWeeksDateRange()
        const query = this.db
            .collection(TODOLIST_COLLECTION_NAME)
            .where('userId', '==', userId)
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.startDate))
            .where('date', '>=', dateutils.yyyy_mm_dd(dateRange.endDate))
            .limit(7)
        return await query.get().then(result => {
            console.log("get weekly todos data", result.docs)
            return result.docs.map(mapDocToTodoList)
        })
    }
}

export class TodosApiHandler {
    constructor(private db: Firestore) {
        
    }

    getTodaysTodosHandler(data:any, context:CallableContext): any {
        return null
    }
    
    getThisWeekTodosHandler(data: any, context: CallableContext): any {
        return null
    }
    
    addTodosHandler(data: any, context: CallableContext): any {
        return null
    }
}
