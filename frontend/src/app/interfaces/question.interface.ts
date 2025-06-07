export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'yes_no'
  | 'single_choice'
  | 'multiple_choice'
  | 'number'
  | 'tick'
  | 'count'
  | 'slider';

export interface QuestionTag {
  id?: string;
  name: string;
}

export interface Question {
  id?: string;
  title?: string;
  prompt: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  meta?: any; // For slider config, etc.
  tags?: QuestionTag[];
  groupName?: string;
  groupId?: string;
  exampleAnswer?: string;
}

export interface QuestionGroup {
  id?: string;
  name: string;
  description?: string;
}

export interface QuestionTagAssociation {
  questionId: string;
  tagId: string;
}
