import { useMemo } from "react";
import { getUserStats } from "@/lib/gamification";
import { getTestResults } from "@/lib/customTestStorage";
import { getSyllabus } from "@/lib/syllabusStorage";
import { getStudentProfile } from "@/lib/memorySystem";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { BarChart3, TrendingUp, Target, BookOpen, Zap } from "lucide-react";

export default function ProgressPage() {
  const stats = getUserStats();
  const results = getTestResults();
  const syllabus = getSyllabus();
  const profile = getStudentProfile();

  const chartData = useMemo(() => {
    return results.slice(-10).map((r, i) => ({
      name: `${i + 1}`,
      score: r.score,
      correct: r.correctAnswers,
      total: r.totalQuestions,
    }));
  }, [results]);

  const completedTopics = syllabus.filter((t) => t.completed).length;
  const totalTopics = syllabus.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BarChart3 className="w-6 h-6 text-primary" /> Прогресс</h1>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Деңгей", value: stats.level, icon: Zap, color: "text-yellow-600 bg-yellow-50" },
          { label: "XP", value: stats.xp, icon: Target, color: "text-blue-600 bg-blue-50" },
          { label: "Тесттер", value: stats.totalTests, icon: BookOpen, color: "text-green-600 bg-green-50" },
          { label: "Дәлдік", value: stats.totalTests > 0 ? Math.round((stats.totalCorrect / (stats.totalTests * 20)) * 100) : 0, suffix: "%", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-2`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}{s.suffix || ""}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Тест нәтижелері</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Дұрыс жауаптар</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="correct" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Syllabus progress */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-4">Оқу жоспары</h3>
        <div className="w-full bg-secondary rounded-full h-3 mb-4 overflow-hidden">
          <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0}%` }} />
        </div>
        <p className="text-sm text-muted-foreground mb-4">{completedTopics}/{totalTopics} тақырып аяқталды</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {syllabus.map((topic) => (
            <div key={topic.id} className={`flex items-center justify-between p-3 rounded-lg border ${topic.completed ? "border-green-300 bg-green-50" : "border-border"}`}>
              <div>
                <div className="font-medium text-sm">{topic.title}</div>
                <div className="text-xs text-muted-foreground">{topic.subtopics.length} тақырып</div>
              </div>
              {topic.completed && <span className="text-green-600 font-bold">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Weak topics */}
      {profile.weakTopics.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-red-800"><Target className="w-4 h-4" /> Жетілдіру керек тақырыптар</h3>
          <div className="flex flex-wrap gap-2">
            {profile.weakTopics.map((topic, i) => (
              <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{topic}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
