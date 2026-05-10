const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function aiChat(message: string): Promise<string> {
  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: message }] }),
    });
    const data = await res.json();
    return data.response || "Жауап алынбады";
  } catch {
    return "Қосылыу қатесі";
  }
}

export async function getHint(question: string, options?: string[], hintType: string = "mini"): Promise<string> {
  try {
    const res = await fetch(API_BASE + "/api/hints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options, hintType }),
    });
    const data = await res.json();
    return data.hint || "Нұсқа берілмеді";
  } catch {
    return "Қосылыу қатесі";
  }
}

export async function getExplanation(question: string, options?: string[], correctAnswer?: number): Promise<string> {
  try {
    const res = await fetch(API_BASE + "/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, options, correctAnswer }),
    });
    const data = await res.json();
    return data.explanation || "Түсіндірме берілмеді";
  } catch {
    return "Қосылыу қатесі";
  }
}

export async function generateTests(topic: string, count: number = 10): Promise<any[]> {
  try {
    const res = await fetch(API_BASE + "/api/generate-tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, count }),
    });
    const data = await res.json();
    return data.questions || [];
  } catch {
    return [];
  }
}
ionId);
  if (mission) mission.completed = true;
  localStorage.setItem("bio_daily_missions"