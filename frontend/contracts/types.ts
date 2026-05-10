export interface BioUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
}

export interface TestResult {
  testId: string;
  title: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: string;
  answers: { questionIndex: number; selected: number; correct: number }[];
}

export interface CustomQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface CustomTest {
  id: string;
  title: string;
  description: string;
  questions: CustomQuestion[];
  createdAt: string;
}
