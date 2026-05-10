import { useState } from "react";
import { createRoom, joinRoom, getRoom, submitScore, type BattleRoom } from "@/lib/multiplayer";
import { addToLeaderboard } from "@/lib/multiplayer";
import { Swords, Plus, LogIn, Trophy, Users, Clock } from "lucide-react";

export default function BattlePage() {
  const [mode, setMode] = useState<"menu" | "create" | "join" | "active" | "result">("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const handleCreate = () => {
    if (!playerName.trim()) return;
    const r = createRoom(playerName);
    setRoom(r);
    setIsHost(true);
    setMode("active");
  };

  const handleJoin = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    const r = joinRoom(roomId, playerName);
    if (r) {
      setRoom(r);
      setIsHost(false);
      setMode("active");
    }
  };

  const handleFinish = () => {
    if (!room) return;
    submitScore(room.id, isHost, score);
    const updated = getRoom(room.id);
    if (updated) {
      setRoom(updated);
      setOpponentScore(isHost ? updated.opponentScore : updated.hostScore);
    }
    addToLeaderboard(playerName, score);
    setMode("result");
  };

  if (mode === "menu") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Swords className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Батл режимі</h1>
        <p className="text-muted-foreground mb-8">Досыңызбен нақты уақытта жарысыңыз</p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setMode("create")} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">Бөлме жасау</div>
            <div className="text-sm text-muted-foreground">Жаңа ойын бастау</div>
          </button>
          <button onClick={() => setMode("join")} className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition text-center">
            <LogIn className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-semibold">Қосылу</div>
            <div className="text-sm text-muted-foreground">Барлық бөлмеге кіру</div>
          </button>
        </div>
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Plus className="w-6 h-6" /> Бөлме жасау</h1>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Атыңыз</label>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Атыңызды енгізіңіз" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button onClick={handleCreate} disabled={!playerName.trim()} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">Бөлме жасау</button>
          <button onClick={() => setMode("menu")} className="w-full py-2.5 border border-border rounded-lg hover:bg-accent transition">Артқа</button>
        </div>
      </div>
    );
  }

  if (mode === "join") {
    return (
      <div className="max-w-md mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><LogIn className="w-6 h-6" /> Бөлмеге қосылу</h1>
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Атыңыз</label>
            <input value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Атыңызды енгізіңіз" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Бөлме ID</label>
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="room_12345" className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <button onClick={handleJoin} disabled={!playerName.trim() || !roomId.trim()} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50">Қосылу</button>
          <button onClick={() => setMode("menu")} className="w-full py-2.5 border border-border rounded-lg hover:bg-accent transition">Артқа</button>
        </div>
      </div>
    );
  }

  if (mode === "active" && room) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-lg font-bold">{room.host}</div>
              <div className="text-sm text-muted-foreground">Қожайын</div>
              <div className="text-2xl font-bold text-primary mt-1">{isHost ? score : opponentScore}</div>
            </div>
            <div className="text-center">
              <Swords className="w-8 h-8 text-primary mx-auto" />
              <div className="text-xs text-muted-foreground mt-1">VS</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{room.opponent || "Күтілуде..."}</div>
              <div className="text-sm text-muted-foreground">Қонақ</div>
              <div className="text-2xl font-bold text-primary mt-1">{isHost ? opponentScore : score}</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-sm text-muted-foreground text-center">Демо: Баллды өзгерту үшін слайдерді жылжытыңыз</p>
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-center font-bold">{score} балл</div>
          </div>

          <button onClick={handleFinish} className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
            Аяқтау
          </button>
        </div>
      </div>
    );
  }

  if (mode === "result" && room) {
    const won = isHost ? score > opponentScore : score > room.hostScore;
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${won ? "bg-green-100" : "bg-red-100"}`}>
          <Trophy className={`w-10 h-10 ${won ? "text-green-600" : "text-red-600"}`} />
        </div>
        <h1 className="text-3xl font-bold mb-2">{won ? "Жеңіс! 🎉" : "Ұтылу 😢"}</h1>
        <p className="text-muted-foreground mb-6">{room.host}: {room.hostScore} vs {room.opponent}: {room.opponentScore}</p>
        <button onClick={() => setMode("menu")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Жаңа ойын</button>
      </div>
    );
  }

  return null;
}
