import { useState } from "react";
import { getDailyMissions, completeMission, type Mission } from "@/lib/dailyMissions";
import { getUserStats, addXp } from "@/lib/gamification";
import { CalendarCheck, Zap, CheckCircle, Circle } from "lucide-react";

export default function DailyHub() {
  const [missions, setMissions] = useState<Mission[]>(getDailyMissions());
  const stats = getUserStats();

  const handleComplete = (missionId: string, xpReward: number) => {
    completeMission(missionId);
    addXp(xpReward);
    setMissions(getDailyMissions());
  };

  const completed = missions.filter((m) => m.completed).length;
  const totalXp = missions.filter((m) => m.completed).reduce((sum, m) => sum + m.xpReward, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><CalendarCheck className="w-6 h-6 text-primary" /> Күндік міндеттер</h1>
        <p className="text-muted-foreground">Бүгінгі міндеттерді орындап, XP жинаңыз</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{completed}/{missions.length}</div>
          <div className="text-sm text-muted-foreground">Орындалды</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">+{totalXp}</div>
          <div className="text-sm text-muted-foreground">XP бүгін</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{stats.streak}</div>
          <div className="text-sm text-muted-foreground">Серия</div>
        </div>
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <div key={mission.id} className={`bg-card border rounded-xl p-4 flex items-center justify-between transition ${mission.completed ? "border-green-300 bg-green-50" : "border-border"}`}>
            <div className="flex items-start gap-3">
              {mission.completed ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : <Circle className="w-5 h-5 text-muted-foreground mt-0.5" />}
              <div>
                <div className={`font-medium ${mission.completed ? "line-through text-muted-foreground" : ""}`}>{mission.title}</div>
                <div className="text-sm text-muted-foreground">{mission.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm font-medium text-primary"><Zap className="w-4 h-4" /> +{mission.xpReward}</span>
              {!mission.completed && (
                <button onClick={() => handleComplete(mission.id, mission.xpReward)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition">Орындау</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
