import Tesseract from "tesseract.js";

export async function recognizeText(imageData: string | File): Promise<string> {
  try {
    const result = await Tesseract.recognize(imageData, "kaz+rus+eng", {
      logger: () => {},
    });
    return result.data.text;
  } catch {
    return "";
  }
}

export interface GeneratedQuestion {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateQuestionsFromText(text: string): Promise<GeneratedQuestion[]> {
  const lines = text.split("\n").filter((l) => l.trim().length > 10);
  const questions: GeneratedQuestion[] = [];

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim();
    if (line.length < 20) continue;

    const words = line.split(" ");
    const keyword = words.find((w) => w.length > 4) || "биология";

    questions.push({
      text: `Мәтіндегі негізгі ұғым: ${line.substring(0, 80)}...`,
      options: [keyword, "фотосинтез", "митоз", "ДНҚ", "экология"],
      correctAnswer: 0,
      explanation: `Дұрыс жауап: ${keyword}. Бұл мәтінде негізгі ұғым.`,
    });
  }

  return questions;
}
