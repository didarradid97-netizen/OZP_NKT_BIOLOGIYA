import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import AICoach from "@/pages/AICoach";
import AIDiagnosis from "@/pages/AIDiagnosis";
import CustomTestRunner from "@/pages/CustomTestRunner";
import VoiceQuizPage from "@/pages/VoiceQuizPage";
import PhotoQuizPage from "@/pages/PhotoQuizPage";
import BattlePage from "@/pages/BattlePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ProgressPage from "@/pages/ProgressPage";
import DailyHub from "@/pages/DailyHub";
import VirtualLab from "@/pages/VirtualLab";
import SmartScan from "@/pages/SmartScan";
import VoiceTeacher from "@/pages/VoiceTeacher";
import DuelMode from "@/pages/DuelMode";
import GlobalRating from "@/pages/GlobalRating";
import GamificationPage from "@/pages/GamificationPage";
import SettingsPage from "@/pages/SettingsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/ai-coach" element={<AICoach />} />
        <Route path="/ai-diagnosis" element={<AIDiagnosis />} />
        <Route path="/test/:testId" element={<CustomTestRunner />} />
        <Route path="/voice-quiz" element={<VoiceQuizPage />} />
        <Route path="/photo-quiz" element={<PhotoQuizPage />} />
        <Route path="/battle" element={<BattlePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/daily" element={<DailyHub />} />
        <Route path="/lab" element={<VirtualLab />} />
        <Route path="/smart-scan" element={<SmartScan />} />
        <Route path="/voice-teacher" element={<VoiceTeacher />} />
        <Route path="/duel" element={<DuelMode />} />
        <Route path="/rating" element={<GlobalRating />} />
        <Route path="/achievements" element={<GamificationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
