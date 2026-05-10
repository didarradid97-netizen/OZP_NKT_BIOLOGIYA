export interface MistakeEntry {
  question: string;
  topic: string;
  wrongAnswer: string;
  correctAnswer: string;
  date: string;
  reviewCount: number;
  nextReview: string;
}

const MISTAKES_KEY = "bio_mistakes";

export function getMistakes(): MistakeEntry[] {
  const raw = localStorage.getItem(MISTAKES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function addMistake(question: string, topic: string, wrong: string, correct: string): void {
  const mistakes = getMistakes();
  const now = new Date().toISOString();
  mistakes.push({
    question,
    topic,
    wrongAnswer: wrong,
    correctAnswer: correct,
    date: now,
    reviewCount: 0,
    nextReview: new Date(Date.now() + 864e5).toISOString(),
  });
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
}

export function getDueReviews(): MistakeEntry[] {
  const now = Date.now();
  return getMistakes().filter((m) => new Date(m.nextReview).getTime() <= now);
}

export function scheduleReview(mistake: MistakeEntry): void {
  const mistakes = getMistakes();
  const idx = mistakes.findIndex((m) => m.question === mistake.question);
  if (idx === -1) return;
  mistakes[idx].reviewCount += 1;
  const intervals = [1, 3, 7, 14, 30];
  const days = intervals[Math.min(mistakes[idx].reviewCount, intervals.length - 1)];
  mistakes[idx].nextReview = new Date(Date.now() + days * 864e5).toISOString();
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
}
