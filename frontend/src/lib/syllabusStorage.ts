export interface SyllabusTopic {
  id: string;
  title: string;
  description: string;
  subtopics: string[];
  completed: boolean;
}

const SYLLABUS_KEY = "bio_syllabus";

const DEFAULT_SYLLABUS: SyllabusTopic[] = [
  {
    id: "cell",
    title: "Жасуша",
    description: "Жасуша құрылысы, органоидтер, қызметтері",
    subtopics: ["Прокариоттық жасуша", "Эукариоттық жасуша", "Ядро", "Митохондрия", "Рибосома", "Лизосома", "Гольджи аппараты", "Эндоплазмалық тор"],
    completed: false,
  },
  {
    id: "photosynthesis",
    title: "Фотосинтез",
    description: "Жарық реакциялары, қараңғы реакциялар",
    subtopics: ["Хлоропласт құрылысы", "Фотосистемалар", "Кальвин циклі", "C3, C4, CAM өсімдіктері"],
    completed: false,
  },
  {
    id: "respiration",
    title: "Тыныс алу",
    description: "Гликолиз, Кребс циклі, электрондық тізбек",
    subtopics: ["Гликолиз", "Пируват оксидденуі", "Кребс циклі", "Оксидативті фосфорилдену"],
    completed: false,
  },
  {
    id: "genetics",
    title: "Генетика",
    description: "Мендель заңдары, ДНҚ репликациясы, транскрипция",
    subtopics: ["Мендель 1-заңы", "Мендель 2-заңы", "Доминанттылық", "ДНҚ репликациясы", "Транскрипция", "Трансляция"],
    completed: false,
  },
  {
    id: "mitosis",
    title: "Митоз және Мейоз",
    description: "Клетка бөлінуінің түрлері",
    subtopics: ["Интерфаза", "Профаза", "Метафаза", "Анафаза", "Телофаза", "Мейоз 1", "Мейоз 2"],
    completed: false,
  },
  {
    id: "ecology",
    title: "Экология",
    description: "Экожүйелер, биоценоздар, табиғатты қорғау",
    subtopics: ["Экожүйе құрылымы", "Азықтану тізбектері", "Экологиялық факторлар", "Биоценоз", "Популяция"],
    completed: false,
  },
  {
    id: "human",
    title: "Адам анатомиясы",
    description: "Адамның ішкі органдары және қызметтері",
    subtopics: ["Жүрек-тамыр жүйесі", "Тыныс алу жүйесі", "Ас қорыту жүйесі", "Зәр шығару жүйесі", "Нерв жүйесі", "Эндокриндік жүйе"],
    completed: false,
  },
  {
    id: "evolution",
    title: "Эволюция",
    description: "Дарвин ілімі, табиғи іріктеу",
    subtopics: ["Дарвин теориясы", "Табиғи іріктеу", "Мутация", "Генетикалық дрельф", "Видтар пайда болуы"],
    completed: false,
  },
];

export function getSyllabus(): SyllabusTopic[] {
  const raw = localStorage.getItem(SYLLABUS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_SYLLABUS;
}

export function toggleTopicComplete(topicId: string): void {
  const syllabus = getSyllabus();
  const topic = syllabus.find((t) => t.id === topicId);
  if (topic) topic.completed = !topic.completed;
  localStorage.setItem(SYLLABUS_KEY, JSON.stringify(syllabus));
}
