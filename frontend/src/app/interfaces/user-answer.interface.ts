export interface UserAnswerRead {
  questionId: string;
  timetableId: string;
  dayOfPlan: number;
  answer?: any;
  isSubmitted: boolean;
}

export interface UserAnswerSave {
  questionId: string;
  timetableId: string;
  dayOfPlan: number;
  answer?: any;
  isSubmitted: boolean;
}
