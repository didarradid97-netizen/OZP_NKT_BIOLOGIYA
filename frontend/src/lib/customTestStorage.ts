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

const TESTS_KEY = "bio_custom_tests";
const RESULTS_KEY = "bio_test_results";

export function getCustomTests(): CustomTest[] {
  const raw = localStorage.getItem(TESTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCustomTest(test: CustomTest): void {
  const tests = getCustomTests();
  const idx = tests.findIndex((t) => t.id === test.id);
  if (idx >= 0) tests[idx] = test;
  else tests.push(test);
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
}

export function getCustomTest(id: string): CustomTest | undefined {
  return getCustomTests().find((t) => t.id === id);
}

export function deleteCustomTest(id: string): void {
  localStorage.setItem(TESTS_KEY, JSON.stringify(getCustomTests().filter((t) => t.id !== id)));
}

export function getTestResults(): TestResult[] {
  const raw = localStorage.getItem(RESULTS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveTestResult(result: TestResult): void {
  const results = getTestResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}
