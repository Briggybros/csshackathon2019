export interface Map<T> {
  [id: string]: T;
}

export interface Todo {
  name: string;
  datetime: number;
  duration: number;
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
