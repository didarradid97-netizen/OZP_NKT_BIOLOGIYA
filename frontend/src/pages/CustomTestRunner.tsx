import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomTest, saveTestResult, type CustomTest } from "@/lib/customTestStorage";
import { getHint, getExplanation } from "@/lib/aiRouter";
import { recordWrongAnswer } from "@/lib/memorySystem";
import { addXp } from "@/lib/gamification";
import { getMotivationMessage } from "@/lib/mentorStorage";
import {
  Clock, ChevronLeft, ChevronRight, Lightbulb, BookOpen,
  GraduationCap, Volume2, AlertTriangle, CheckCircle, RotateCcw, Save
} from "lucide-react";

const HINT_API = "/api/hints";
const EXPLAIN_API = "/api/explain";

function getLocalHint(q: string): string {
  const lower = q.toLowerCase();
  const hints: Record<string, string> = {
    "фотосинтез": "Жарық энергиясын химиялық энергияға айналдыру процесі.",
    "митохондрия": "Энергияны өндіретін жасуша органоиді.",
    "днк": "Генетикалық ақпаратты сақтайтын молекула.",
    "митоз": "Соматикалық жасушалардың бөлінуі.",
    "мейоз": "Жыныстық жасушалардың түзілуі.",
  };
  for (const [key, val] of Object.entries(hints)) {
    if (lower.includes(key)) return "💡 " + val;
  }
  return "💡 Сұрақты мұқият оқыңыз.";
}

export default function CustomTestRunner() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [test, setTest] = useState<CustomTest | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [hint, setHint] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState<"mini" | "full" | "explain">("mini");
  const [errorInfo, setErrorInfo] = useState("");
  const [motivationMsg, setMotivationMsg] = useState("");

  useEffect(() => {
    if (!testId) return;
    const found = getCustomTest(testId);
    if (found) {
      setTest(found);
      setTimeLeft(found.questions.length * 60);
    }
  }, [testId]);

  useEffect(() => {
    if (finished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(timer);
  }, [finished, timeLeft]);

  const getHintLocal = useCallback(async (type?: "mini" | "full" | "explain") => {
    if (!test) return;
    const q = test.questions[current];
    const useType = type || hintType;
    setHintLoading(true); setShowHint(true); setErrorInfo("");
    try {
      const result = await getHint(q.text, q.options, useType);
      setHint(result);
    } catch {
      setHint(useType === "explain" ? "Түсіндірме берілмеді" : getLocalHint(q.text));
      setErrorInfo("Серверге қосылу мүмкін емес");
    } finally { setHintLoading(false); }
  }, [test, current, hintType]);

  const handleAnswer = (opt: number) => {
    if (finished || !test) return;
    setAnswers((prev) => ({ ...prev, [current]: opt }));
    const q = test.questions[current];
    if (opt !== q.correctAnswer) {
      const topic = q.text.split(" ").slice(0, 3).join(" ");
      recordWrongAnswer(topic);
    }
    const correctCount = Object.entries({ ...answers, [current]: opt })
      .filter(([i, a]) => test.questions[Number(i)]?.correctAnswer === a).length;
    const totalAnswered = Object.keys({ ...answers, [current]: opt }).length;
    setMotivationMsg(getMotivationMessage(correctCount, totalAnswered, 0));
  };

  const handleFinish = () => {
    if (!test) return;
    const correct = test.questions.filter((_, i) => answers[i] === test.questions[i].correctAnswer).length;
    const total = test.questions.length;
    const timeSpent = test.questions.length * 60 - timeLeft;
    saveTestResult({
      testId: test.id, title: test.title,
      score: Math.round((correct / total) * 100), totalQuestions: total,
      correctAnswers: correct, timeSpent,
      completedAt: new Date().toISOString(),
      answers: Object.entries(answers).map(([i, selected]) => ({
        questionIndex: Number(i), selected,
        correct: test.questions[Number(i)].correctAnswer
      }))
    });
    addXp(Math.round((correct / total) * 50));
    setFinished(true);
  };

  const handleSaveResult = () => {
    navigate("/progress");
  };

  if (!test) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Тест табылмады</h2>
        <p className="text-muted-foreground">ID: {testId}</p>
        <button onClick={() => navigate("/")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">Басты бет</button>
      </div>
    );
  }

  const minutes = Math.floor(Math.max(0, timeLeft) / 60);
  const seconds = Math.max(0, timeLeft) % 60;

  if (finished) {
    const correct = test.questions.filter((_, i) => answers[i] === test.questions[i].correctAnswer).length;
    const pct = Math.round((correct / test.questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${pct >= 70 ? "bg-green-100" : pct >= 40 ? "bg-yellow-100" : "bg-red-100"}`}>
            {pct >= 70 ? <CheckCircle className="w-10 h-10 text-green-600" /> : <AlertTriangle className="w-10 h-10 text-yellow-600" />}
          </div>
          <h1 className="text-3xl font-bold mb-1">{pct}%</h1>
          <p className="text-muted-foreground mb-4">{correct}/{test.questions.length} дұрыс</p>
          <div className="flex justify-center gap-3 mb-6">
            <button onClick={() => { setCurrent(0); setAnswers({}); setFinished(false); setTimeLeft(test.questions.length * 60); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"><RotateCcw className="w-4 h-4" /> Қайталау</button>
            <button onClick={handleSaveResult} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent"><Save className="w-4 h-4" /> Сақтау</button>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {test.questions.map((q, i) => (
            <div key={i} className={`bg-card border rounded-xl p-4 ${answers[i] === q.correctAnswer ? "border-green-300" : "border-red-300"}`}>
              <p className="font-medium mb-2">{i + 1}. {q.text}</p>
              <p className="text-sm">Сіздің жауабыңыз: {q.options[answers[i]] || "Жоқ"} • Дұрыс: {q.options[q.correctAnswer]}</p>
              {q.explanation && <p className="text-sm text-muted-foreground mt-1">💡 {q.explanation}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const q = test.questions[current];
  const progress = ((current + 1) / test.questions.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-accent"><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">{current + 1} / {test.questions.length}</p>
        </div>
        <div className={`flex items-center gap-1 font-mono text-sm ${timeLeft < 60 ? "text-red-500" : ""}`}>
          <Clock className="w-4 h-4" />{String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
      </div>

      {/* Motivation */}
      {motivationMsg && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-800">{motivationMsg}</div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Сұрақ №{current + 1}</span>
              <span className={`text-xs ${answers[current] !== undefined ? "text-green-600" : "text-muted-foreground"}`}>{answers[current] !== undefined ? "Жауап берілді" : "○ Жауапсыз"}</span>
            </div>
            <h2 className="text-lg font-semibold mb-4 leading-relaxed">{q.text}</h2>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition ${answers[current] === idx ? "bg-primary/10 border-primary/30" : "bg-white/[0.04] border-border hover:bg-accent"}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${answers[current] === idx ? "bg-primary text-white" : "bg-secondary"}`}>{String.fromCharCode(65 + idx)}</span>
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary disabled:opacity-30"><ChevronLeft className="w-4 h-4" /> Алдыңғы</button>
            <div className="flex gap-1">
              {test.questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === current ? "bg-primary w-6" : answers[idx] !== undefined ? "bg-blue-400" : "bg-secondary"}`} />
              ))}
            </div>
            {current < test.questions.length - 1 ? (
              <button onClick={() => setCurrent(current + 1)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground">Келесі <ChevronRight className="w-4 h-4" /></button>
            ) : (
              <button onClick={handleFinish} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white font-semibold">Аяқтау <CheckCircle className="w-4 h-4" /></button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* AI Help */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> AI Көмек</h3>
              <span className="text-xs text-muted-foreground">{errorInfo || "Groq AI"}</span>
            </div>
            <select value={hintType} onChange={(e) => setHintType(e.target.value as any)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm mb-2">
              <option value="mini">Жеңіл нұсқа</option>
              <option value="full">Толық шешу</option>
              <option value="explain">Түсіндірме</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => getHintLocal("mini")} disabled={hintLoading} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-yellow-50 text-yellow-700 rounded-lg text-sm hover:bg-yellow-100 transition"><Lightbulb className="w-3 h-3" /> Жеңіл</button>
              <button onClick={() => getHintLocal("full")} disabled={hintLoading} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition"><BookOpen className="w-3 h-3" /> Толық</button>
            </div>
            <button onClick={() => getHintLocal("explain")} disabled={hintLoading} className="w-full mt-2 flex items-center justify-center gap-1 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition"><GraduationCap className="w-3 h-3" /> Түсіндірме</button>
            {showHint && (
              <div className="mt-3 p-3 bg-accent rounded-lg text-sm">
                {hintLoading ? "Жүктелуде..." : hint}
              </div>
            )}
          </div>

          {/* Question list */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Сұрақтар тізімі</h3>
            <div className="grid grid-cols-5 gap-1.5">
              {test.questions.map((_, idx) => (
                <button key={idx} onClick={() => setCurrent(idx)} className={`w-full aspect-square rounded-lg text-xs font-medium transition ${idx === current ? "bg-primary text-white" : answers[idx] !== undefined ? "bg-green-100 text-green-700" : "bg-secondary"}`}>{idx + 1}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
