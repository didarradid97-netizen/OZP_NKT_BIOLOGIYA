import { useState } from "react";
import { getStudentProfile } from "@/lib/memorySystem";
import { getMistakes } from "@/lib/mistakeBrain";
import { getUserStats } from "@/lib/gamification";
import { getTestResults } from "@/lib/customTestStorage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Sparkles, AlertTriangle, TrendingUp, BookOpen, Target } from "lucide-react";

export default function AIDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const profile = getStudentProfile();
  const mistakes = getMistakes();
  const stats = getUserStats();
  const results = getTestResults();

  const runDiagnosis = () => {
    setLoading(true);
    setTimeout(() => {
      const accuracy = stats.totalTests > 0 ? Math.round((stats.totalCorrect / (stats.totalTests * 20)) * 100) : 0;
      const weakAreas = profile.weakTopics.slice(0, 3).join(", ") || "анықталмаған";
      const advice = accuracy > 80
        ? "Керемет нәтиже! Қазіргі деңгейіңіз бойынша NKT-де жоғары балл жинауыңызға болады. Әлсіз тақырыптарды қайталаңыз."
        : accuracy > 60
        ? `Жақсы прогресс. ${weakAreas} тақырыптарын тереңірек үйренсеңіз, нәтиже 15-20% өседі.`
        : `Негізгі ұғымдарды қайталау керек. ${weakAreas} тақырыптарынан бастаңыз.`;
      setDiagnosis(`Диагностика нәтижесі:\n\nЖалпы дәлдік: ${accuracy}%\nТесттер саны: ${stats.totalTests}\nҚателер: ${mistakes.length}\n\n${advice}`);
      setLoading(false);
    }, 1500);
  };

  const topicData = profile.weakTopics.map((t, i) => ({ name: t, count: mistakes.filter((m) => m.topic === t).length || 1, fill: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6"][i % 5] }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-primary" /> AI Диагностика</h1>
        <button
          onClick={runDiagnosis}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Талдауда..." : "Диагностика жүргізу"}
        </button>
      </div>

      {diagnosis && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <pre className="whitespace-pre-wrap text-sm">{diagnosis}</pre>
        </div>
      )}

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Тесттер", value: stats.totalTests, icon: BookOpen, color: "text-blue-600 bg-blue-50" },
          { label: "Дәлдік (%)", value: stats.totalTests > 0 ? Math.round((stats.totalCorrect / (stats.totalTests * 20)) * 100) : 0, icon: TrendingUp, color: "text-green-600 bg-green-50" },
          { label: "Қателер", value: mistakes.length, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
          { label: "Деңгей", value: stats.level, icon: Target, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Тақырыптар бойынша қателер</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Прогресс бөлінісі</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={[{ name: "Дұрыс", value: stats.totalCorrect }, { name: "Қате", value: Math.max(0, stats.totalTests * 20 - stats.totalCorrect) }]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                <Cell fill="#10b981" /><Cell fill="#ef4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
