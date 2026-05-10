export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  totalTests: number;
  totalCorrect: number;
  achievements: string[];
}

export function getUserStats(): UserStats {
  const raw = localStorage.getItem("bio_stats");
  if (raw) return JSON.parse(raw);
  return { xp: 0, level: 1, streak: 0, totalTests: 0, totalCorrect: 0, achievements: [] };
}

export function addXp(amount: number): UserStats {
  const stats = getUserStats();
  stats.xp += amount;
  const newLevel = Math.floor(stats.xp / 100) + 1;
  if (newLevel > stats.level) stats.level = newLevel;
  localStorage.setItem("bio_stats", JSON.stringify(stats));
  return stats;
}

export function recordTest(correct: number, total: number): UserStats {
  const stats = getUserStats();
  stats.totalTests += 1;
  stats.totalCorrect += correct;
  const xp = Math.round((correct / total) * 50);
  addXp(xp);
  checkAchievements(stats);
  localStorage.setItem("bio_stats", JSON.stringify(stats));
  return stats;
}

function checkAchievements(stats: UserStats): void {
  const achievements = stats.achievements;
  if (stats.totalTests >= 1 && !achievements.includes("first_test")) achievements.push("first_test");
  if (stats.totalTests >= 10 && !achievements.includes("ten_tests")) achievements.push("ten_tests");
  if (stats.totalTests >= 50 && !achievements.includes("fifty_tests")) achievements.push("fifty_tests");
  if (stats.streak >= 7 && !achievements.includes("week_streak")) achievements.push("week_streak");
  if (stats.level >= 5 && !achievements.includes("level_5")) achievements.push("level_5");
  if (stats.level >= 10 && !achievements.includes("level_10")) achievements.push("level_10");
}

export const ACHIEVEMENT_NAMES: Record<string, string> = {
  first_test: "Бірінші тест",
  ten_tests: "10 тест",
  fifty_tests: "50 тест",
  week_streak: "7 күн сериясы",
  level_5: "5 деңгей",
  level_10: "10 деңгей",
};

export const ACHIEVEMENT_ICONS: Record<string, string> = {
  first_test: "🎯",
  ten_tests: "📚",
  fifty_tests: "🏆",
  week_streak: "🔥",
  level_5: "⭐",
  level_10: "👑",
};
