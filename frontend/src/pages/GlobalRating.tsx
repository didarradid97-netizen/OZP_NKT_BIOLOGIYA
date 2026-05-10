import { getGlobalRating } from "@/lib/ratingStorage";
import { Trophy, TrendingUp, Award, Star } from "lucide-react";

export default function GlobalRating() {
  const rating = getGlobalRating();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><TrendingUp className="w-6 h-6 text-primary" /> Жаһандық рейтинг</h1>
        <p className="text-muted-foreground">Барлық ойыншылардың рейтингі</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Ойыншылар", value: rating.length + 120, icon: Trophy, color: "text-blue-600 bg-blue-50" },
          { label: "Жалпы тест", value: 15420, icon: Award, color: "text-green-600 bg-green-50" },
          { label: "Үздік балл", value: rating[0]?.score || 0, icon: Star, color: "text-yellow-600 bg-yellow-50" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

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
                <td className="px-4 py-3 font-bold">{idx + 1}</td>
                <td className="px-4 py-3 font-medium">{entry.name}</td>
                <td className="px-4 py-3 text-right font-bold text-primary">{entry.score}</td>
                <td className="px-4 py-3 text-right text-sm text-muted-foreground">{entry.tests}</td>
                <td className="px-4 py-3 text-right"><span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{entry.level}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
