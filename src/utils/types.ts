

export const DifficultyValues = { "easy": "Easy", "medium": "Medium", "hard": "hard" } as const
export type Difficulty = keyof typeof DifficultyValues

export const CategoryValues = {
  "9": "Entertainment: Books",
  "10": "Entertainment: Books",
  "11": "Entertainment: Film",
  "12": "Entertainment: Music",
  "13": "Entertainment: Musicals & Theatres",
  "14": "Entertainment: Television",
  "15": "Entertainment: Video Games",
  "16": "Entertainment: Board Games",
  "17": "Science & Nature",
  "18": "Science: Computers",
  "19": "Science: Mathematics",
  "20": "Mythology",
  "21": "Sports",
  "22": "Geography",
  "23": "History",
  "24": "Politics ",
  "25": "Art",
  "26": "Celebrities",
  "27": "Animals",
  "28": "Vehicles",
  "29": "Entertainment: Comics",
  "30": "Science: Gadgets",
  "31": "Entertainment: Japanese Anime & Manga",
  "32": "Entertainment: Cartoon & Animations",
} as const
export type Category = keyof typeof CategoryValues

export const QuestionTypeValues = {
  "multiple": "Multiple Choice",
  "boolean": "True or False"

} as const
export type QuestionType = keyof typeof QuestionTypeValues

export type QuestionResponse = {
  category: string,
  correct_answer: string,
  difficulty: string,
  incorrect_answers: string[],
  question: string,
  type: string
}


export type OpenTDBResponse = {
  response_code: number,
  results: QuestionResponse[]
}

export interface MultiSelectOption { value: string; label: string }

export type RoomData = {
  roomId?: string;
  roomName: string;
  gameId?: string;
  currentQuestion: number;
  isPublic: boolean;
  isEnded: boolean;
  isStarted: boolean;
  roomLeaderId?: string;
  roomLeaderName?: string;
  triviaQuestions: QuestionResponse[];
};
