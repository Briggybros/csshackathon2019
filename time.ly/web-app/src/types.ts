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
  createdOn: number;
  weeklyFrequency: number;
  preferredDays: number[];
  preferredHours: {
    from: number;
    to: number;
  };
}
