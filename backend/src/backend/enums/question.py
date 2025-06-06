from enum import Enum

class QuestionType(str, Enum):
    SHORT_TEXT = "short_text"
    LONG_TEXT = "long_text"
    YES_NO = "yes_no"
    SINGLE_CHOICE = "single_choice"
    MULTIPLE_CHOICE = "multiple_choice"
    NUMBER = "number"
    COUNT = "count"
    SLIDER = "slider"