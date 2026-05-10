import { useState } from "react";
import { ScanLine, Upload, Sparkles, BookOpen } from "lucide-react";

export default function SmartScan() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const topics = ["Фотосинтез", "Митоз", "Генетика", "Экология", "Эволюция"];
      const found = topics.filter((t) => text.toLowerCase().includes(t.toLowerCase()));
      setAnalysis(`Талдау нәтижесі:

Табылған тақырыптар: ${found.join(", ") || "тақырып анықталмады"}

Сұрақтар саны: ${(text.match(/\?/g) || []).length}
Белгілер: ${text.length} таңба`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><ScanLine className="w-6 h-6 text-primary" /> Smart Scan</h1>
        <p className="text-muted-foreground">Мәтінді талдау, негізгі ұғымдарды табу</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Мәтінді осы жерге қойыңыз..."
          className="w-full h-40 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none text-sm"
        />
        <div className="flex gap-3 mt-4">
          <button onClick={analyzeText} disabled={loading || !text.trim()} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">
            <Sparkles className="w-4 h-4" /> {loading ? "Талдауда..." : "Талдау"}
          </button>
          <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition cursor-pointer">
            <Upload className="w-4 h-4" /> Файл жүктеу
            <input type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = (ev) => setText(ev.target?.result as string); r.readAsText(f); } }} />
          </label>
        </div>
      </div>

      {analysis && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <pre className="whitespace-pre-wrap text-sm">{analysis}</pre>
        </div>
      )}

      <div className="mt-6 bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Қолдану нұсқалары</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Оқулық мәтінін талдау</li>
          <li>• Негізгі ұғымдарды табу</li>
          <li>• Сұрақтарды анықтау</li>
          <li>• Тақырыптарды жіктеу</li>
        </ul>
      </div>
    </div>
  );
}
