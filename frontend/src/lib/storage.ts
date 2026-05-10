export function getStudyStreak(): number {
  const data = localStorage.getItem("bio_streak");
  if (!data) return 0;
  try {
    const { count, date } = JSON.parse(data);
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 864e5).toDateString();
    return date === today || date === yesterday ? count : 0;
  } catch { return 0; }
}

export function recordStudyDay(): void {
  const today = new Date().toDateString();
  const data = localStorage.getItem("bio_streak");
  let count = 1;
  if (data) {
    try {
      const { count: c, date } = JSON.parse(data);
      if (date === today) { count = c; }
      else { count = c + 1; }
    } catch {}
  }
  localStorage.setItem("bio_streak", JSON.stringify({ count, date: today }));
}

export function getAllTestResults() {
  const raw = localStorage.getItem("bio_results");
  return raw ? JSON.parse(raw) : [];
}
