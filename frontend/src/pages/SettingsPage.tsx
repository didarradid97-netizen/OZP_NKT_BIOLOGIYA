import { useState } from "react";
import { Settings, Trash2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [showReset, setShowReset] = useState(false);

  const resetProgress = () => {
    localStorage.removeItem("bio_stats");
    localStorage.removeItem("bio_results");
    localStorage.removeItem("bio_student_profile");
    localStorage.removeItem("bio_mistakes");
    localStorage.removeItem("bio_custom_tests");
    localStorage.removeItem("bio_streak");
    localStorage.removeItem("bio_daily_missions");
    localStorage.removeItem("bio_syllabus");
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="w-6 h-6" /> Параметрлер</h1>

      <div className="space-y-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Тіл</h3>
          <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm">
            <option>Қазақша</option>
            <option>Русский</option>
            <option>English</option>
          </select>
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="font-semibold mb-2">Тақырып</h3>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-border rounded-lg text-sm">Ақ</button>
            <button className="px-4 py-2 bg-gray-900 text-white border border-border rounded-lg text-sm">Қараңғы</button>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Қауіпті аймақ</h3>
          {!showReset ? (
            <button onClick={() => setShowReset(true)} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition">
              <Trash2 className="w-4 h-4" /> Прогресті қалпына келтіру
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-600">Барлық деректер жойылады. Растайсыз ба?</p>
              <div className="flex gap-2">
                <button onClick={resetProgress} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Иә, жою</button>
                <button onClick={() => setShowReset(false)} className="px-4 py-2 border border-border rounded-lg text-sm">Бас тарту</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
