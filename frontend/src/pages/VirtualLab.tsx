import React, { useState } from "react";
import { FlaskConical, Microscope, Dna, Leaf, Eye, Play, RotateCcw, BookOpen } from "lucide-react";

interface Experiment {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: string[];
  color: string;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "photosynthesis",
    title: "Фотосинтез",
    description: "Жарықтағы және қараңғыдағы өсімдіктердегі крахмалдың түзілуін бақылау",
    icon: Leaf,
    color: "text-green-600 bg-green-50",
    steps: [
      "1. Дақылды 2 күн қараңғыда ұстаңыз",
      "2. Жапырақты қайнайтын суға салыңыз",
      "3. Спиртте қыздырып хлорофилді алыңыз",
      "4. Йод тамызғанда көк түске боялады",
    ],
  },
  {
    id: "mitosis",
    title: "Митоз",
    description: "Жасуша бөлінуін микроскоппен бақылау",
    icon: Microscope,
    color: "text-blue-600 bg-blue-50",
    steps: [
      "1. Пияз тамырын 2 сағат суға қойыңыз",
      "2. 1 см тамыр ұшын кесіңіз",
      "3. Гидрохлор қышқылымен бояңыз",
      "4. Микроскоппен фазаларды қараңыз",
    ],
  },
  {
    id: "dna",
    title: "ДНҚ экстракциясы",
    description: "Апельсиннен ДНҚ молекуласын бөліп алу",
    icon: Dna,
    color: "text-purple-600 bg-purple-50",
    steps: [
      "1. Апельсинді майда тураңыз",
      "2. Сабынды сумен араластырыңыз",
      "3. Қанта құрылған спиртті үстіне құйыңыз",
      "4. Ақ жіп сияқты ДНҚ пайда болады",
    ],
  },
  {
    id: "osmosis",
    title: "Осмос",
    description: "Қан клеткаларының сулы ортадағы өзгерісі",
    icon: Eye,
    color: "text-red-600 bg-red-50",
    steps: [
      "1. 3 тамшы қан алыңыз",
      "2. 1-ші: ағынды су, 2-ші: 0.9% NaCl, 3-ші: 10% NaCl",
      "3. Микроскоппен қараңыз",
      "4: Гипотония, изотония, гипертония",
    ],
  },
];

export default function VirtualLab() {
  const [active, setActive] = useState<Experiment | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);

  const startExp = (exp: Experiment) => {
    setActive(exp);
    setStepIndex(0);
    setRunning(false);
  };

  const nextStep = () => {
    if (active && stepIndex < active.steps.length - 1) setStepIndex((p) => p + 1);
  };

  if (active) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => setActive(null)} className="text-sm text-muted-foreground hover:text-foreground mb-4">← Тәжірибелер тізімі</button>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className={`w-14 h-14 rounded-xl ${active.color} flex items-center justify-center mb-4`}>
            <active.icon className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{active.title}</h2>
          <p className="text-muted-foreground mb-6">{active.description}</p>

          <div className="space-y-3 mb-6">
            {active.steps.map((step, i) => (
              <div key={i} className={`p-4 rounded-xl border transition ${i <= stepIndex ? "border-primary bg-primary/5" : "border-border opacity-50"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i <= stepIndex ? "bg-primary text-white" : "bg-secondary"}`}>{i + 1}</div>
                  <span className="text-sm">{step}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            {!running ? (
              <button onClick={() => setRunning(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"><Play className="w-4 h-4" /> Бастау</button>
            ) : (
              <button onClick={nextStep} disabled={stepIndex >= active.steps.length - 1} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50">Келіс қадам</button>
            )}
            <button onClick={() => { setStepIndex(0); setRunning(false); }} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent"><RotateCcw className="w-4 h-4" /> Қайталау</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2"><FlaskConical className="w-6 h-6 text-primary" /> Виртуалды зертхана</h1>
        <p className="text-muted-foreground">NKT форматындағы тәжірибелерді виртуалды орындау</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {EXPERIMENTS.map((exp) => (
          <button key={exp.id} onClick={() => startExp(exp)} className="bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/50 hover:shadow-md transition-all">
            <div className={`w-12 h-12 rounded-xl ${exp.color} flex items-center justify-center mb-4`}><exp.icon className="w-6 h-6" /></div>
            <h3 className="font-bold text-lg mb-1">{exp.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
            <div className="flex items-center gap-1 text-sm text-primary"><BookOpen className="w-4 h-4" /> {exp.steps.length} қадам</div>
          </button>
        ))}
      </div>
    </div>
  );
}
