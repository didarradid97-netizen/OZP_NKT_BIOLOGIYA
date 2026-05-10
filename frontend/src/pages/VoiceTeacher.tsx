import { useState } from "react";
import { speakText, stopSpeaking } from "@/lib/voiceAI";
import { GraduationCap, Play, Square, Volume2, BookOpen } from "lucide-react";

const LESSONS = [
  { id: "photosynthesis", title: "Фотосинтез", content: "Фотосинтез — жасыл өсімдіктердің жарық энергиясын химиялық энергияға айналдыру процесі. Фотосинтез реакциясы: алты көміртегі диоксиді плюс алты су молекуласы, жарық және хлорофил қатысында, глюкоза плюс алты оттегі молекуласына айналады." },
  { id: "mitosis", title: "Митоз", content: "Митоз — соматикалық жасушалардың бөлінуі. Төрт фазадан тұрады: профаза, метафаза, анафаза, телофаза. Нәтижесінде екі бірдей жасуша түзіледі." },
  { id: "genetics", title: "Мендель заңдары", content: "Мендель бірінші заңы — доминанттылық заңы. Екінші заңы — бөліну заңы. Үшінші заңы — тәуелсіз түрлену заңы." },
  { id: "dna", title: "ДНҚ құрылымы", content: "ДНҚ — екі тізбектен тұратын спираль. Негізгі қүрылым: нуклеотидтер. Нуклеотид құрамы: фосфат тобы, декстроза қанты, азотты негіз." },
];

export default function VoiceTeacher() {
  const [activeLesson, setActiveLesson] = useState(LESSONS[0]);
  const [speaking, setSpeaking] = useState(false);

  const playLesson = () => {
    speakText(activeLesson.content, "kk-KZ");
    setSpeaking(true);
  };

  const stopLesson = () => {
    stopSpeaking();
    setSpeaking(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><GraduationCap className="w-6 h-6 text-primary" /> Дыбыстық мұғалім</h1>
        <p className="text-muted-foreground">Аудио форматта биология сабақтары</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-2 mb-6">
        {LESSONS.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => { setActiveLesson(lesson); stopLesson(); }}
            className={`p-3 rounded-xl text-sm font-medium transition ${activeLesson.id === lesson.id ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-accent"}`}
          >
            {lesson.title}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">{activeLesson.title}</h2>
          <div className="flex gap-2">
            {!speaking ? (
              <button onClick={playLesson} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"><Play className="w-4 h-4" /> Оқыту</button>
            ) : (
              <button onClick={stopLesson} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg"><Square className="w-4 h-4" /> Тоқтату</button>
            )}
          </div>
        </div>
        <div className="bg-accent rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm leading-relaxed">{activeLesson.content}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Қолданылу нұсқалары</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Көзге зиянсыз оқу — тек тыңдау</li>
          <li>• Көлікте, серуенде оқу</li>
          <li>• Ұйықтар алдында қайталау</li>
          <li>• Мультизадачинг — басқа іспен қатар</li>
        </ul>
      </div>
    </div>
  );
}
