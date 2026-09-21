export type TopicPack = {
  id: string;
  label: string;
  emoji: string;
  task: "task1" | "task2";
  prompts: string[];
};

export const TOPIC_PACKS: TopicPack[] = [
  {
    id: "technology",
    label: "Technology & AI",
    emoji: "🤖",
    task: "task2",
    prompts: [
      "Some people believe artificial intelligence will improve education, while others fear it will weaken students' thinking skills. Discuss both views and give your own opinion.",
      "Many everyday tasks are now handled by machines. Do the advantages of this development outweigh the disadvantages?",
      "Social media has changed how young people communicate. To what extent is this a positive or negative development?",
    ],
  },
  {
    id: "education",
    label: "Education",
    emoji: "📚",
    task: "task2",
    prompts: [
      "Some argue university education should be free for all citizens. To what extent do you agree or disagree?",
      "Students learn better when lessons are enjoyable rather than strict. Discuss both views and give your opinion.",
      "Should schools teach practical life skills instead of only academic subjects? Give reasons for your answer.",
    ],
  },
  {
    id: "environment",
    label: "Environment",
    emoji: "🌍",
    task: "task2",
    prompts: [
      "Individual action cannot solve climate change; only governments can. To what extent do you agree or disagree?",
      "Some cities have banned private cars from their centres. Do the benefits outweigh the drawbacks?",
      "What are the main causes of plastic pollution, and what measures could reduce it?",
    ],
  },
  {
    id: "society",
    label: "Society & Culture",
    emoji: "🏛️",
    task: "task2",
    prompts: [
      "Traditional customs are disappearing in many countries. Why is this happening and is it a negative development?",
      "Some believe international travel builds understanding between cultures; others say it damages local traditions. Discuss both views.",
      "Should governments spend money preserving historical buildings, or invest in new housing instead?",
    ],
  },
  {
    id: "work",
    label: "Work & Economy",
    emoji: "💼",
    task: "task2",
    prompts: [
      "Remote work is becoming standard in many industries. Do the advantages outweigh the disadvantages?",
      "Some believe a four-day working week would improve productivity. To what extent do you agree?",
      "Young people today change jobs frequently. What are the causes, and what effects does this have?",
    ],
  },
  {
    id: "health",
    label: "Health & Wellbeing",
    emoji: "🧠",
    task: "task2",
    prompts: [
      "Governments should tax unhealthy food to improve public health. To what extent do you agree or disagree?",
      "Mental health support in schools is as important as physical education. Discuss.",
      "What are the causes of rising stress in modern life, and how can it be reduced?",
    ],
  },
  {
    id: "task1",
    label: "Task 1 · Data & Process",
    emoji: "📈",
    task: "task1",
    prompts: [
      "The chart below shows the percentage of households with internet access in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features.",
      "The diagram illustrates the process of recycling plastic bottles. Summarise the information by describing the main stages.",
      "The table compares average weekly study hours of students in five universities. Summarise and make comparisons where relevant.",
    ],
  },
];
