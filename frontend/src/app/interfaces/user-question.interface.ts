export interface UserTimetable {
  id?: string;
  startDate: string;
  endDate: string;
  notes?: string;
  title?: string;
  isSubmitted?: boolean; // Indicates if the timetable is currently submitted
  questions?: any[];
}

export interface UserTimetableSave {
  id?: string;
  startDate: string;
  endDate: string;
  notes?: string;
  title?: string;
  isSubmitted?: boolean; // Indicates if the timetable is currently submitted
  questionIds?: string[];
}

export interface QuestionTimetable {
  id?: string;
  timetableId: string;
  questionId: string;
}

export interface QuestionTimetableBulkInsert {
  timetableId: string;
  questionIds: string[];
}
