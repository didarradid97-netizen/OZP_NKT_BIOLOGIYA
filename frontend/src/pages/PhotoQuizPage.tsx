import { useState, useRef } from "react";
import { recognizeText, generateQuestionsFromText, type GeneratedQuestion } from "@/lib/photoQuiz";
import { Camera, Upload, Sparkles, RotateCcw } from "lucide-react";

export default function PhotoQuizPage() {
  const [image, setImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "scan" | "quiz">("upload");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setLoading(true);
    setStep("scan");
    const text = await recognizeText(file);
    setRecognizedText(text);
    const qs = await generateQuestionsFromText(text);
    setQuestions(qs);
    setLoading(false);
    if (qs.length > 0) setStep("quiz");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: idx }));
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ((p) => p + 1), 500);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setImage(null);
    setRecognizedText("");
    setQuestions([]);
    setStep("upload");
    setCurrentQ(0);
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><Camera className="w-6 h-6 text-primary" /> Фото тест</h1>
        <p className="text-muted-foreground">Суреттен мәтін танып, автоматты тест жасау</p>
      </div>

      {step === "upload" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary/50 hover:bg-accent/50 transition cursor-pointer"
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium mb-1">Сурет жүктеу</p>
          <p className="text-sm text-muted-foreground">JPEG, PNG (макс. 5MB)</p>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      )}

      {step === "scan" && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="font-medium">Сурет талдануда...</p>
          {image && <img src={image} alt="Uploaded" className="mt-4 max-h-48 rounded-lg mx-auto" />}
        </div>
      )}

      {step === "quiz" && questions.length > 0 && !showResult && (
        <div>
          {image && <img src={image} alt="Uploaded" className="max-h-32 rounded-lg mb-4 mx-auto" />}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Сұрақ {currentQ + 1}/{questions.length}</span>
              <span className="text-sm text-primary">{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
            </div>
            <h2 className="text-lg font-semibold mb-4">{questions[currentQ].text}</h2>
            <div className="space-y-2">
              {questions[currentQ].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition hover:bg-accent ${answers[currentQ] === idx ? "border-primary bg-primary/10" : "border-border"}`}
                >
                  <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-sm">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResult && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Нәтиже</h2>
          <p className="text-lg mb-4">
            {questions.filter((q, i) => answers[i] === q.correctAnswer).length}/{questions.length} дұрыс
          </p>
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg mx-auto">
            <RotateCcw className="w-4 h-4" /> Жаңа сурет
          </button>
        </div>
      )}

      {recognizedText && (
        <div className="mt-6 bg-accent rounded-xl p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Танылған мәтін:</p>
          <p className="text-sm line-clamp-4">{recognizedText}</p>
        </div>
      )}
    </div>
  );
}
