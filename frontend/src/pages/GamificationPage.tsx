import { getUserStats, ACHIEVEMENT_NAMES, ACHIEVEMENT_ICONS } from "@/lib/gamification";
import { Trophy, Zap, Target, Star } from "lucide-react";

export default function GamificationPage() {
  const stats = getUserStats();
  const allAchievements = Object.keys(ACHIEVEMENT_NAMES);
  const earned = stats.achievements;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Жетістіктер</h1>
        <p className="text-muted-foreground">Ойында қол жеткізген марапаттарыңыз</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: "Деңгей", value: stats.level, icon: Star, color: "text-yellow-600 bg-yellow-50" },
          { label: "XP", value: stats.xp, icon: Zap, color: "text-blue-600 bg-blue-50" },
          { label: "Тесттер", value: stats.totalTests, icon: Target, color: "text-green-600 bg-green-50" },
          { label: "Жетістіктер", value: earned.length, icon: Trophy, color: "text-purple-600 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Барлық жетістіктер</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allAchievements.map((key) => {
            const isEarned = earned.includes(key);
            return (
              <div key={key} className={`p-4 rounded-xl border transition ${isEarned ? "border-yellow-300 bg-yellow-50" : "border-border bg-card opacity-60"}`}>
                <div className="text-2xl mb-2">{ACHIEVEMENT_ICONS[key]}</div>
                <div className="font-medium text-sm">{ACHIEVEMENT_NAMES[key]}</div>
                <div className="text-xs text-muted-foreground">{isEarned ? "Алынды ✓" : "Құпия"}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
