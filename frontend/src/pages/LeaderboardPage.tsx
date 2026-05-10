import { getLeaderboard } from "@/lib/multiplayer";
import { getGlobalRating } from "@/lib/ratingStorage";
import { Trophy, Medal, Crown, Star } from "lucide-react";

export default function LeaderboardPage() {
  const leaderboard = getLeaderboard();
  const rating = getGlobalRating();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><Trophy className="w-6 h-6 text-yellow-500" /> Лидерборд</h1>
        <p className="text-muted-foreground">Үздік ойыншылар тізімі</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {rating.slice(0, 3).map((entry, idx) => (
          <div key={idx} className={`text-center p-4 rounded-2xl border ${idx === 0 ? "bg-yellow-50 border-yellow-300" : idx === 1 ? "bg-gray-50 border-gray-300" : "bg-orange-50 border-orange-300"}`}>
            <div className="text-3xl mb-2">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
            <div className="font-bold text-lg">{entry.name}</div>
            <div className="text-2xl font-bold text-primary">{entry.score}</div>
            <div className="text-xs text-muted-foreground">{entry.level} деңгей</div>
          </div>
        ))}
      </div>

      {/* Full table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Аты</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Балл</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Тесттер</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Деңгей</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rating.map((entry, idx) => (
              <tr key={idx} className="hover:bg-accent/50 transition">
                <td className="px-4 py-3">
                  {idx === 0 ? <Crown className="w-4 h-4 text-yellow-500" /> : idx === 1 ? <Medal className="w-4 h-4 text-gray-400" /> : idx === 2 ? <Star className="w-4 h-4 text-orange-400" /> : <span className="text-sm text-muted-foreground">{idx + 1}</span>}
                </td>
                <td className="px-4 py-3 font-medium">{entry.name}</td>
                <td className="px-4 py-3 text-right font-bold">{entry.score}</td>
                <td className="px-4 py-3 text-right text-sm text-muted-foreground">{entry.tests}</td>
                <td className="px-4 py-3 text-right"><span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{entry.level}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent battles */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-3">Соңғы батлдар</h3>
        {leaderboard.length === 0 ? (
          <p className="text-sm text-muted-foreground">Батлдар жоқ. Бірінші болыңыз!</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">{idx + 1}</span>
                  <span className="font-medium text-sm">{entry.name}</span>
                </div>
                <span className="font-bold text-sm">{entry.score} балл</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
