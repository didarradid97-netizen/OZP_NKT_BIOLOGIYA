import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Home,
  Brain,
  FlaskConical,
  Mic,
  Camera,
  Swords,
  Trophy,
  BarChart3,
  CalendarCheck,
  ScanLine,
  GraduationCap,
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Басты", icon: Home },
  { path: "/ai-coach", label: "AI Коуч", icon: Brain },
  { path: "/ai-diagnosis", label: "AI Диагностика", icon: Sparkles },
  { path: "/daily", label: "Күндік міндеттер", icon: CalendarCheck },
  { path: "/voice-quiz", label: "Дыбыстық тест", icon: Mic },
  { path: "/photo-quiz", label: "Фото тест", icon: Camera },
  { path: "/battle", label: "Батл", icon: Swords },
  { path: "/leaderboard", label: "Лидерборд", icon: Trophy },
  { path: "/progress", label: "Прогресс", icon: BarChart3 },
  { path: "/lab", label: "Виртуалды зертхана", icon: FlaskConical },
  { path: "/smart-scan", label: "Smart Scan", icon: ScanLine },
  { path: "/voice-teacher", label: "Дыбыстық мұғалім", icon: GraduationCap },
  { path: "/duel", label: "Дуэль", icon: Swords },
  { path: "/rating", label: "Рейтинг", icon: Trophy },
  { path: "/achievements", label: "Жетістіктер", icon: Trophy },
  { path: "/settings", label: "Параметрлер", icon: Settings },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <FlaskConical className="w-6 h-6" />
            <span className="hidden sm:inline">NKT BIOLOGY</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 8).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Шығу</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Кіру</span>
              </Link>
            )}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <nav
            className="absolute top-16 left-0 right-0 bg-white border-b border-border shadow-lg p-4 grid grid-cols-2 gap-2 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
