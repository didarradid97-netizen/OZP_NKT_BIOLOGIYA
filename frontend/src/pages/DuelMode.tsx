import { useState } from "react";
import { Swords, User, Bot, Trophy } from "lucide-react";

const DEMO_QUESTIONS = [
  { q: "Фотосинтез қай органоидте өтеді?", options: ["Митохондрия", "Хлоропласт", "Рибосома", "Ядро"], correct: 1 },
  { q: "ДНҚ-ның толық атауы?", options: ["Рибонуклеин қышқылы", "Дезоксирибонуклеин қышқылы", "Аденозин трифосфат", "Никотинамид"], correct: 1 },
  { q: "Мейоз нәтижесінде неше гамета түзіледі?", options: ["2", "4", "8", "16"], correct: 1 },
];

export default function DuelMode() {
  const [mode, setMode] = useState<"menu" | "playing" | "result">("menu");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [botAnswers] = useState<Record<number, number>>({ 0: 1, 1: 1, 2: 0 });

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [current]: idx }));
    if (current < DEMO_QUESTIONS.length - 1) {
      setTimeout(() => setCurrent((p) => p + 1), 500);
    } else {
      setTimeout(() => setMode("result"), 500);
    }
  };

  const playerCorrect = Object.entries(answers).filter(([i, a]) => DEMO_QUESTIONS[Number(i)].correct === a).length;
  const botCorrect = Object.entries(botAnswers).filter(([i, a]) => DEMO_QUESTIONS[Number(i)].correct === a).length;

  if (mode === "menu") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Swords className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Дуэль режимі</h1>
        <p className="text-muted-foreground mb-8">AI қарсыласпен жарысыңыз</p>
        <button onClick={() => { setMode("playing"); setCurrent(0); setAnswers({}); }} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition">
          Бастау
        </button>
      </div>
    );
  }

  if (mode === "playing") {
    const q = DEMO_QUESTIONS[current];
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /><span className="font-bold">Сіз</span></div>
          <div className="text-sm text-muted-foreground">{current + 1}/{DEMO_QUESTIONS.length}</div>
          <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-muted-foreground" /><span className="font-medium">AI</span></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">{q.q}</h2>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)} className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-accent transition text-left">
                <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">{String.fromCharCode(65 + idx)}</span>
                <span className="text-sm">{opt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <Trophy className={`w-16 h-16 mx-auto mb-4 ${playerCorrect >= botCorrect ? "text-yellow-500" : "text-gray-400"}`} />
      <h1 className="text-3xl font-bold mb-4">
        {playerCorrect > botCorrect ? "Жеңіс! 🎉" : playerCorrect === botCorrect ? "Тең! 🤝" : "Ұтылу 😢"}
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold text-primary">{playerCorrect}</div>
          <div className="text-sm text-muted-foreground">Сіз</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-3xl font-bold">{botCorrect}</div>
          <div className="text-sm text-muted-foreground">AI</div>
        </div>
      </div>
      <button onClick={() => setMode("menu")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Жаңа дуэль</button>
    </div>
  );
}
