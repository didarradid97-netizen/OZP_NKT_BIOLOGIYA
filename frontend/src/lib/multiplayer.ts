export interface BattleRoom {
  id: string;
  host: string;
  opponent: string | null;
  status: "waiting" | "active" | "finished";
  questions: any[];
  hostScore: number;
  opponentScore: number;
  createdAt: number;
}

const ROOMS_KEY = "bio_battle_rooms";

export function getRooms(): BattleRoom[] {
  const raw = localStorage.getItem(ROOMS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRooms(rooms: BattleRoom[]): void {
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
}

export function createRoom(hostName: string): BattleRoom {
  const room: BattleRoom = {
    id: "room_" + Date.now(),
    host: hostName,
    opponent: null,
    status: "waiting",
    questions: [],
    hostScore: 0,
    opponentScore: 0,
    createdAt: Date.now(),
  };
  const rooms = getRooms();
  rooms.push(room);
  saveRooms(rooms);
  return room;
}

export function joinRoom(roomId: string, opponentName: string): BattleRoom | null {
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === roomId);
  if (!room || room.opponent) return null;
  room.opponent = opponentName;
  room.status = "active";
  saveRooms(rooms);
  return room;
}

export function getRoom(roomId: string): BattleRoom | null {
  return getRooms().find((r) => r.id === roomId) || null;
}

export function submitScore(roomId: string, isHost: boolean, score: number): void {
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;
  if (isHost) room.hostScore = score;
  else room.opponentScore = score;
  if (room.hostScore > 0 && room.opponentScore > 0) room.status = "finished";
  saveRooms(rooms);
}

export function getLeaderboard(): { name: string; score: number; date: string }[] {
  const raw = localStorage.getItem("bio_leaderboard");
  return raw ? JSON.parse(raw) : [];
}

export function addToLeaderboard(name: string, score: number): void {
  const board = getLeaderboard();
  board.push({ name, score, date: new Date().toISOString() });
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem("bio_leaderboard", JSON.stringify(board.slice(0, 100)));
}
