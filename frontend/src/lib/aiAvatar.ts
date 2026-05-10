export type AvatarPersonality = "coach" | "scientist" | "motivator" | "strict";

export interface AvatarConfig {
  name: string;
  greeting: string;
  style: string;
  icon: string;
}

const AVATARS: Record<AvatarPersonality, AvatarConfig> = {
  coach: {
    name: "Мұғалім Айгүл",
    greeting: "Сәлем! Бүгін нені үйренеміз? Мен сізге биологияны түсінікті түрде үйретемін.",
    style: "ыстық, түсінікті, ықыласты",
    icon: "👩‍🏫",
  },
  scientist: {
    name: "Ғалым Ерлан",
    greeting: "Сәлеметсіз бе! Ғылыми тұрғыдан тереңірек үйренейік.",
    style: "ғылыми, нақты, терең",
    icon: "🔬",
  },
  motivator: {
    name: "Мотиватор Дина",
    greeting: "Сәлем! Сен мүмкіндіктеріңді шектеме! Бүгін күштілердің күні!",
    style: "шабыттандырушы, энергиялы, позитивті",
    icon: "💪",
  },
  strict: {
    name: "Тексеруші Марат",
    greeting: "Сәлем. Уақытын босқа өткізбе. Тестке дайындал.",
    style: "қатаң, талапшыл, нәтижеге бағытталған",
    icon: "📋",
  },
};

export function getAvatarConfig(personality: AvatarPersonality): AvatarConfig {
  return AVATARS[personality] || AVATARS.coach;
}

export function getAllAvatars(): { key: AvatarPersonality; config: AvatarConfig }[] {
  return (Object.keys(AVATARS) as AvatarPersonality[]).map((key) => ({ key, config: AVATARS[key] }));
}
