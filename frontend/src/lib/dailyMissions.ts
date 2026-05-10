export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  type: "test" | "streak" | "topic" | "perfect";
}

export function getDailyMissions(): Mission[] {
  const today = new Date().toDateString();
  const stored = localStorage.getItem("bio_daily_missions");
  if (stored) {
    const { date, missions } = JSON.parse(stored);
    if (date === today) return missions;
  }
  return generateDailyMissions();
}

function generateDailyMissions(): Mission[] {
  const today = new Date().toDateString();
  const missions: Mission[] = [
    { id: "m1", title: "1 тест тапсыру", description: "Кез келген тесті тапсырып, кемінде 60% нәтиже көрсетіңіз", xpReward: 20, completed: false, type: "test" },
    { id: "m2", title: "3 тест тапсыру", description: "Бүгін 3 тесті сәтті аяқтаңыз", xpReward: 50, completed: false, type: "test" },
    { id: "m3", title: "Серияны сақтау", description: "Оқу сериясын жалғастырыңыз", xpReward: 30, completed: false, type: "streak" },
    { id: "m4", title: "Қателіктерді қайталау", description: "Қате жіберген сұрақтарды қайта шешіңіз", xpReward: 40, completed: false, type: "topic" },
    { id: "m5", title: "Таза нәтиже", description: "Бір тесті 100% нәтижемен аяқтаңыз", xpReward: 100, completed: false, type: "perfect" },
  ];
  localStorage.setItem("bio_daily_missions", JSON.stringify({ date: today, missions }));
  return missions;
}

export function completeMission(missionId: string): void {
  const stored = localStorage.getItem("bio_daily_missions");
  if (!stored) return;
  const data = JSON.parse(stored);
  const mission = data.missions.find((m: Mission) => m.id === missionId);
  if (mission) mission.completed = true;
  localStorage.setItem("bio_daily_missions", JSON.stringify(data));
}
