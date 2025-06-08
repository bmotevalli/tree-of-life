import { Question } from './question.interface';

export interface QuestionTimetable {
  id?: string;
  timetableId: string;
  questionId: string;
}

export interface QuestionTimetableRead {
  id?: string;
  timetableId: string;
  questionId: string;
  question: Question;
}

export interface UserTimetable {
  id?: string;
  startDate: string;
  endDate: string;
  notes?: string;
  title?: string;
  isSubmitted?: boolean; // Indicates if the timetable is currently submitted
  questions?: QuestionTimetableRead[];
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
