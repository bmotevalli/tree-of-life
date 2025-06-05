export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'yes_no'
  | 'single_choice'
  | 'multiple_choice'
  | 'number'
  | 'slider';

export interface Question {
  id?: string;
  title?: string;
  prompt: string;
  type: QuestionType;
  options?: string[]; // For multiple choice
  meta?: any; // For slider config, etc.
  tags?: string[];
}

export interface QuestionGroup {
  id?: string;
  name: string;
  description?: string;
  // createdAt?: Date;
  // updatedAt?: Date;
  // createdBy?: string;
  // updatedBy?: string;
}
