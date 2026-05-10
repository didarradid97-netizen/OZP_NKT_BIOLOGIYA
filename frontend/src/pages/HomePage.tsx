import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getUserStats } from "@/lib/gamification";
import { getDailyMissions } from "@/lib/dailyMissions";
import { getSyllabus } from "@/lib/syllabusStorage";
import { getStudentProfile } from "@/lib/memorySystem";
import {
  Brain,
  Mic,
  Camera,
  Swords,
  Trophy,
  BarChart3,
  CalendarCheck,
  FlaskConical,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const stats = getUserStats();
  const missions = getDailyMissions();
  const syllabus = getSyllabus();
  const profile = getStudentProfile();

  const completedMissions = missions.filter((m) => m.completed).length;
  const completedTopics = syllabus.filter((t) => t.completed).length;
  const weakTopics = profile.weakTopics.length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          {isAuthenticated ? `Сәлем, ${user?.name || "Студент"}! 👋` : "NKT BIOLOGY 2026"}
        </h1>
        <p className="text-blue-100 mb-4">
          Биологияға дайындық платформасы. 20+ AI функция, тесттер, батлдар және жетістіктер.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/ai-coach"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-medium hover:bg-white/30 transition"
          >
            <Brain className="w-4 h-4" />
            AI Коуч
          </Link>
          <Link
            to="/daily"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-lg font-medium hover:bg-white/30 transition"
          >
            <CalendarCheck className="w-4 h-4" />
            Күндік міндеттер
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Деңгей", value: stats.level, icon: Zap, color: "text-yellow-600 bg-yellow-50" },
          { label: "XP", value: stats.xp, icon: Target, color: "text-blue-600 bg-blue-50" },
          { label: "Тесттер", value: stats.totalTests, icon: BookOpen, color: "text-green-600 bg-green-50" },
          { label: "Серия", value: stats.streak, icon: Trophy, color: "text-purple-600 bg-purple-50" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Progress overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-primary" />
            Күндік міндеттер
          </h3>
          <div className="text-2xl font-bold">
            {completedMissions}/{missions.length}
          </div>
          <div className="text-sm text-muted-foreground">Орындалды</div>
          <Link to="/daily" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
            Толығырақ <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" />
            Оқу жоспары
          </h3>
          <div className="text-2xl font-bold">
            {completedTopics}/{syllabus.length}
          </div>
          <div className="text-sm text-muted-foreground">Тақырыптар өтілді</div>
          <Link to="/progress" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
            Толығырақ <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Әлсіз тақырыптар
          </h3>
          <div className="text-2xl font-bold">{weakTopics}</div>
          <div className="text-sm text-muted-foreground">Жетілдіру керек</div>
          <Link to="/ai-diagnosis" className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline">
            Диагностика <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Features grid */}
      <div>
        <h2 className="text-xl font-bold mb-4">Барлық мүмкіндіктер</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { to: "/ai-coach", icon: Brain, label: "AI Коуч", desc: "Жеке мұғалім" },
            { to: "/ai-diagnosis", icon: Sparkles, label: "AI Диагностика", desc: "Білім талдауы" },
            { to: "/voice-quiz", icon: Mic, label: "Дыбыстық тест", desc: "Ауызша жауап" },
            { to: "/photo-quiz", icon: Camera, label: "Фото тест", desc: "Суреттен сұрақ" },
            { to: "/battle", icon: Swords, label: "Батл", desc: "Нақты уақыт" },
            { to: "/leaderboard", icon: Trophy, label: "Лидерборд", desc: "Үздіктер тізімі" },
            { to: "/progress", icon: BarChart3, label: "Прогресс", desc: "Динамика" },
            { to: "/lab", icon: FlaskConical, label: "Зертхана", desc: "Виртуалды тәжірибелер" },
            { to: "/smart-scan", icon: Brain, label: "Smart Scan", desc: "Ұтқыр талдау" },
            { to: "/voice-teacher", icon: Mic, label: "Дыбыс мұғалім", desc: "Аудио сабақ" },
            { to: "/duel", icon: Swords, label: "Дуэль", desc: "Доспен жарыс" },
            { to: "/rating", icon: Trophy, label: "Рейтинг", desc: "Жаһандық" },
            { to: "/daily", icon: CalendarCheck, label: "Күндік міндет", desc: "Мақсаттар" },
            { to: "/achievements", icon: Trophy, label: "Жетістіктер", desc: "Жүлделер" },
            { to: "/settings", icon: Brain, label: "Параметрлер", desc: "Баптау" },
          ].map((feat) => (
            <Link
              key={feat.to}
              to={feat.to}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
                <feat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="font-semibold text-sm">{feat.label}</div>
              <div className="text-xs text-muted-foreground">{feat.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
