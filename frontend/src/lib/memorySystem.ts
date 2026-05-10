export interface StudentProfile {
  weakTopics: string[];
  strongTopics: string[];
  totalQuestions: number;
  correctAnswers: number;
  lastStudyDate: string;
}

const PROFILE_KEY = "bio_student_profile";

export function getStudentProfile(): StudentProfile {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (raw) return JSON.parse(raw);
  return { weakTopics: [], strongTopics: [], totalQuestions: 0, correctAnswers: 0, lastStudyDate: "" };
}

export function recordWrongAnswer(topic: string): void {
  const profile = getStudentProfile();
  if (!profile.weakTopics.includes(topic)) {
    profile.weakTopics.push(topic);
  }
  profile.totalQuestions += 1;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function recordCorrectAnswer(topic: string): void {
  const profile = getStudentProfile();
  if (!profile.strongTopics.includes(topic)) {
    profile.strongTopics.push(topic);
  }
  profile.totalQuestions += 1;
  profile.correctAnswers += 1;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getDailyPlan(): string[] {
  const profile = getStudentProfile();
  const weak = profile.weakTopics.slice(0, 5);
  if (weak.length === 0) return ["Жалпы биологияға дайындалу"];
  return weak.map((t) => `Тақырыпты қайталау: ${t}`);
}
