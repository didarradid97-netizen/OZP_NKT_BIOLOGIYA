import { useState, useRef, useEffect } from "react";
import { aiChat } from "@/lib/aiRouter";
import { getAvatarConfig, getAllAvatars, type AvatarPersonality } from "@/lib/aiAvatar";
import { getDailyPlan, getStudentProfile } from "@/lib/memorySystem";
import { getSyllabus } from "@/lib/syllabusStorage";
import { Brain, Send, User, Sparkles, BookOpen, Target, Zap } from "lucide-react";

export default function AICoach() {
  const [personality, setPersonality] = useState<AvatarPersonality>("coach");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const avatar = getAvatarConfig(personality);
  const plan = getDailyPlan();
  const profile = getStudentProfile();
  const syllabus = getSyllabus();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    const context = `Сен — ${avatar.name}, ${avatar.style} стилінде сөйлейтін биология оқытушысы. Студент профилі: әлсіз тақырыптар — ${profile.weakTopics.join(", ") || "жоқ"}. Оқу жоспары: ${syllabus.filter((t) => !t.completed).map((t) => t.title).join(", ")}. Қазақша жауап бер.`;

    const response = await aiChat(context + "\n\nСұрақ: " + userMsg);
    setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="space-y-4">
        {/* Personality selector */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Brain className="w-4 h-4 text-primary" /> AI Аватар</h3>
          <div className="space-y-2">
            {getAllAvatars().map(({ key, config }) => (
              <button
                key={key}
                onClick={() => setPersonality(key)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition ${personality === key ? "bg-primary/10 border border-primary/30" : "hover:bg-accent"}`}
              >
                <span className="text-xl">{config.icon}</span>
                <div>
                  <div className="font-medium text-sm">{config.name}</div>
                  <div className="text-xs text-muted-foreground">{config.style}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Daily plan */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" /> Күндік жоспар</h3>
          <ul className="space-y-2">
            {plan.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Syllabus progress */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Оқу жоспары</h3>
          <div className="space-y-1.5">
            {syllabus.slice(0, 5).map((topic) => (
              <div key={topic.id} className="flex items-center justify-between text-sm">
                <span className={topic.completed ? "line-through text-muted-foreground" : ""}>{topic.title}</span>
                {topic.completed && <span className="text-green-500">✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="lg:col-span-2 flex flex-col bg-card border border-border rounded-xl overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <span className="text-2xl">{avatar.icon}</span>
          <div>
            <div className="font-semibold">{avatar.name}</div>
            <div className="text-xs text-muted-foreground">{avatar.style}</div>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">{avatar.icon}</div>
              <p className="text-muted-foreground">{avatar.greeting}</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-accent"}`}>
                {msg.content}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-primary animate-spin" /></div>
              <div className="bg-accent p-3 rounded-xl text-sm text-muted-foreground">Ойлауда...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Сұрағыңызды жазыңыз..."
              className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
