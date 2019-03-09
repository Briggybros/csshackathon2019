export interface Map<T> {
  [id: string]: T;
}

export interface Todo {
  todoId: string;
  name: string;
  scheduledDateTime: number;
  scheduledDuration: number;
  done: boolean;
}

export interface Schedule {
  name: string;
  weeklyFrequency: number;
  preferredDays: string[];
  preferredHours: {
    start: number;
    end: number;
  };
}
