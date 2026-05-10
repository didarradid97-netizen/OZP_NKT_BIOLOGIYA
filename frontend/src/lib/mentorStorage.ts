export function getMotivationMessage(correct: number, total: number, streak: number): string {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  if (pct === 100) return "Тамаша! Барлығы дұрыс! 🔥";
  if (pct >= 80) return "Өте жақсы! Дәл осындай қалпыңызды сақтаңыз! 💪";
  if (pct >= 60) return "Жақсы нәтиже! Тағы да үйреніңіз! 📚";
  if (pct >= 40) return "Жалғастырыңыз! Әр сұрақ — жаңа білім! 🌱";
  return "Бастамас бұрын тақырыпты қайталаңыз! 💡";
}
