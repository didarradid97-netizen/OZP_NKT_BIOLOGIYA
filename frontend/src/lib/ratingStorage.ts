export interface RatingEntry {
  name: string;
  score: number;
  tests: number;
  level: number;
  date: string;
}

const RATING_KEY = "bio_rating";

export function getGlobalRating(): RatingEntry[] {
  const raw = localStorage.getItem(RATING_KEY);
  return raw ? JSON.parse(raw) : getDefaultRating();
}

function getDefaultRating(): RatingEntry[] {
  return [
    { name: "Айбек", score: 2450, tests: 42, level: 12, date: "2026-05-01" },
    { name: "Диана", score: 2380, tests: 38, level: 11, date: "2026-05-03" },
    { name: "Ерлан", score: 2200, tests: 35, level: 10, date: "2026-05-05" },
    { name: "Гүлнәр", score: 2100, tests: 32, level: 9, date: "2026-05-06" },
    { name: "Марат", score: 1950, tests: 28, level: 8, date: "2026-05-07" },
  ];
}

export function addRatingEntry(entry: RatingEntry): void {
  const rating = getGlobalRating();
  rating.push(entry);
  rating.sort((a, b) => b.score - a.score);
  localStorage.setItem(RATING_KEY, JSON.stringify(rating.slice(0, 50)));
}
