import { useState } from "react";
import { speakText, stopSpeaking, isSpeaking, AudioRecorder, transcribeAudio } from "@/lib/voiceAI";
import { Mic, Volume2, Square, Play, RotateCcw, Sparkles } from "lucide-react";

const DEMO_QUESTIONS = [
  { q: "Фотосинтез процесінде қандай газ қажет?", options: ["Оттегі", "Көміртегі", "Азот", "Сутегі"], correct: 1 },
  { q: "Митохондрияны жасушаның қай органоиді деп атайды?", options: ["Энергетикалық станция", "Ас қорыту қоймасы", "Генетикалық орталық", "Тасымалдау жүйесі"], correct: 0 },
  { q: "ДНҚ-ның толық атауы қандай?", options: ["Дезоксирибонуклеин қышқылы", "Рибонуклеин қышқылы", "Аденозин трифосфат", "Никотинамид аденин динуклеотид"], correct: 0 },
];

export default function VoiceQuizPage() {
  const [current, setCurrent] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState<AudioRecorder | null>(null);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [finished, setFinished] = useState(false);
  const [feedback, setFeedback] = useState("");

  const q = DEMO_QUESTIONS[current];

  const startRecording = async () => {
    const rec = new AudioRecorder();
    await rec.start();
    setRecorder(rec);
    setRecording(true);
    setTranscript("");
  };

  const stopRecording = async () => {
    if (!recorder) return;
    const blob = await recorder.stop();
    setRecording(false);
    const text = await transcribeAudio(blob);
    setTranscript(text);
    checkAnswer(text);
  };

  const checkAnswer = (text: string) => {
    const lower = text.toLowerCase();
    const correctText = q.options[q.correct].toLowerCase();
    const isCorrect = lower.includes(correctText) || lower.includes(String.fromCharCode(65 + q.correct).toLowerCase());
    setAnswers((prev) => ({ ...prev, [current]: text }));
    setFeedback(isCorrect ? "Дұрыс! ✅" : `Дұрыс жауап: ${q.options[q.correct]}`);
  };

  const speakQuestion = () => {
    const text = `${q.q} Нұсқалар: ${q.options.map((o, i) => String.fromCharCode(65 + i) + ") " + o).join(", ")}`;
    speakText(text, "ru-RU");
  };

  const nextQuestion = () => {
    if (current < DEMO_QUESTIONS.length - 1) {
      setCurrent((p) => p + 1);
      setTranscript("");
      setFeedback("");
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Дыбыстық тест аяқталды!</h1>
        <p className="text-muted-foreground mb-6">{Object.keys(answers).length} сұраққа жауап бердіңіз</p>
        <button onClick={() => { setCurrent(0); setAnswers({}); setFinished(false); setTranscript(""); setFeedback(""); }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"><RotateCcw className="w-4 h-4 inline mr-2" />Қайталау</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><Mic className="w-6 h-6 text-primary" /> Дыбыстық тест</h1>
        <p className="text-muted-foreground">Сұрақты дауыстап оқыңыз, жауабыңызды айтып беріңіз</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Сұрақ {current + 1}/{DEMO_QUESTIONS.length}</span>
          <button onClick={speakQuestion} className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4">{q.q}</h2>
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
              <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{String.fromCharCode(65 + idx)}</span>
              <span className="text-sm">{opt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recording controls */}
      <div className="flex justify-center mb-4">
        {!recording ? (
          <button onClick={startRecording} className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition shadow-lg">
            <Mic className="w-5 h-5" /> Жауап беру
          </button>
        ) : (
          <button onClick={stopRecording} className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-full font-medium animate-pulse">
            <Square className="w-5 h-5" /> Тоқтату
          </button>
        )}
      </div>

      {transcript && (
        <div className="bg-accent rounded-xl p-4 mb-4">
          <p className="text-sm font-medium mb-1">Танылған мәтін:</p>
          <p className="text-sm">{transcript}</p>
        </div>
      )}

      {feedback && (
        <div className={`rounded-xl p-4 mb-4 text-center font-medium ${feedback.includes("Дұрыс") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {feedback}
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={() => speakQuestion()} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent">
          <Play className="w-4 h-4" /> Тыңдау
        </button>
        <button onClick={nextQuestion} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
          {current < DEMO_QUESTIONS.length - 1 ? "Келесі" : "Аяқтау"} <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
