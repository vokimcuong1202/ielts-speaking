const { PrismaClient } = require("../generated/client");

const prisma = new PrismaClient();

// Idempotent: everything is keyed on a natural unique (slug / code / composite) so re-running is safe.
async function main() {
  await prisma.plan.upsert({
    where: { code: "free" },
    update: {},
    create: { code: "free", name: "Gói Miễn phí", priceVnd: 0, dailySpeakingTurns: 25, dailyAiScorings: 25 },
  });
  await prisma.plan.upsert({
    where: { code: "pro" },
    update: {},
    create: { code: "pro", name: "Gói Pro", priceVnd: 90000, unlimitedSpeaking: true, features: { mock_tests: true } },
  });

  for (const voice of [
    { code: "heart", name: "Heart", gender: "female", accent: "US" },
    { code: "daniel", name: "Daniel", gender: "male", accent: "UK" },
    { code: "olivia", name: "Olivia", gender: "female", accent: "AU" },
  ]) {
    await prisma.examinerVoice.upsert({ where: { code: voice.code }, update: {}, create: voice });
  }

  for (const type of [
    { slug: "articles", criterion: "grammar", labelVi: "Mạo từ a/an/the", labelEn: "Articles" },
    { slug: "subject-verb-agreement", criterion: "grammar", labelVi: "Chia động từ số nhiều", labelEn: "Subject-verb agreement" },
    { slug: "prepositions", criterion: "grammar", labelVi: "Giới từ", labelEn: "Prepositions" },
    { slug: "relative-pronouns", criterion: "grammar", labelVi: "Đại từ quan hệ", labelEn: "Relative pronouns" },
    { slug: "word-choice", criterion: "lexical", labelVi: "Chọn từ chưa chính xác", labelEn: "Word choice" },
  ]) {
    await prisma.errorType.upsert({ where: { slug: type.slug }, update: {}, create: type });
  }

  const forecastSet = await prisma.forecastSet.upsert({
    where: { slug: "q3-2026" },
    update: {},
    create: {
      slug: "q3-2026",
      title: "Bộ đề dự đoán Quý 3/2026",
      quarterLabel: "09 → 12/2026",
      windowStart: new Date("2026-09-01"),
      windowEnd: new Date("2026-12-31"),
      isCurrent: true,
      publishedAt: new Date(),
    },
  });

  const part1Topic = await prisma.topicGroup.upsert({
    where: { part_slug: { part: "part1", slug: "learning-new-skills" } },
    update: {},
    create: { part: "part1", slug: "learning-new-skills", nameEn: "Learning a new skill", nameVi: "Học kỹ năng mới" },
  });
  const part2Topic = await prisma.topicGroup.upsert({
    where: { part_slug: { part: "part2", slug: "describe-an-activity" } },
    update: {},
    create: { part: "part2", slug: "describe-an-activity", nameEn: "Describe an activity", nameVi: "Hoạt động" },
  });
  const part3Topic = await prisma.topicGroup.upsert({
    where: { part_slug: { part: "part3", slug: "learning-and-technology" } },
    update: {},
    create: { part: "part3", slug: "learning-and-technology", nameEn: "Learning & technology", nameVi: "Học tập & công nghệ" },
  });

  const question = (slug, data) => prisma.question.upsert({ where: { slug }, update: {}, create: { slug, ...data } });

  const q1 = await question("do-you-enjoy-learning-new-skills", {
    part: "part1",
    textEn: "Do you enjoy learning new skills?",
    topicGroupId: part1Topic.id,
  });
  const q2 = await question("last-new-skill-you-learned", {
    part: "part1",
    textEn: "What was the last new skill you learned?",
    topicGroupId: part1Topic.id,
  });
  const cueCard = await question("describe-a-skill-you-want-to-learn", {
    part: "part2",
    textEn: "Describe a new skill you would like to learn.",
    topicGroupId: part2Topic.id,
    cueCardBullets: ["what it is", "why you want to learn it", "how you would learn it", "and explain how it would benefit you"],
    prepSeconds: 60,
    speakSeconds: 120,
  });
  const followUps = [
    await question("why-adults-find-new-skills-hard", {
      part: "part3",
      textEn: "Why do some people find it hard to learn new skills as adults?",
      topicGroupId: part3Topic.id,
      parentQuestionId: cueCard.id,
    }),
    await question("technology-and-learning-skills", {
      part: "part3",
      textEn: "How has technology changed the way people learn new skills?",
      topicGroupId: part3Topic.id,
      parentQuestionId: cueCard.id,
    }),
  ];

  const inSet = [
    [q1, "hot", 14, 82.5],
    [q2, "standard", 6, 45],
    [cueCard, "new", 9, 68],
    [followUps[0], "standard", 4, 40],
    [followUps[1], "standard", 5, 42],
  ];
  for (const [index, [q, flag, appearances30d, probability]] of inSet.entries()) {
    await prisma.forecastQuestion.upsert({
      where: { forecastSetId_questionId: { forecastSetId: forecastSet.id, questionId: q.id } },
      update: {},
      create: {
        forecastSetId: forecastSet.id,
        questionId: q.id,
        flag,
        appearances30d,
        probability,
        enteredSetOn: new Date("2026-09-02"),
        sortOrder: index,
      },
    });
  }

  for (const [stepNo, bodyVi] of ["Nêu kỹ năng và lý do muốn học", "Kể cách bạn sẽ học (khóa học, app, người hướng dẫn)", "Kết bằng lợi ích cho công việc / cuộc sống"].entries()) {
    await prisma.questionIdeaFrame.upsert({
      where: { questionId_stepNo: { questionId: cueCard.id, stepNo: stepNo + 1 } },
      update: {},
      create: { questionId: cueCard.id, stepNo: stepNo + 1, bodyVi },
    });
  }

  const vocabTopic = await prisma.vocabTopic.upsert({
    where: { slug: "education-learning" },
    update: {},
    create: {
      slug: "education-learning",
      nameEn: "Education & Learning",
      nameVi: "Giáo dục & học tập",
      blurbVi: "hay ra ở Part 1 và Part 3",
      commonParts: ["part1", "part3"],
    },
  });
  const vocab = [
    { term: "steep learning curve", ipa: "/stiːp ˈlɜːnɪŋ kɜːv/", kind: "collocation", meaningVi: "giai đoạn đầu học rất khó, cần nhiều nỗ lực", exampleEn: "Coding has a steep learning curve at first.", bandTier: 7 },
    { term: "pick up", kind: "phrasal_verb", meaningVi: "học được (một cách tự nhiên)", exampleEn: "I picked up some Korean from TV shows.", bandTier: 6 },
    { term: "hands-on experience", kind: "collocation", meaningVi: "kinh nghiệm thực tế", exampleEn: "Hands-on experience beats reading a manual.", bandTier: 7 },
  ];
  for (const [index, item] of vocab.entries()) {
    const saved = await prisma.vocabItem.upsert({
      where: { term_meaningVi: { term: item.term, meaningVi: item.meaningVi } },
      update: {},
      create: { ...item, topicId: vocabTopic.id },
    });
    await prisma.questionVocab.upsert({
      where: { questionId_vocabItemId_bandTier: { questionId: q1.id, vocabItemId: saved.id, bandTier: item.bandTier } },
      update: {},
      create: { questionId: q1.id, vocabItemId: saved.id, bandTier: item.bandTier, sortOrder: index, isCore: index < 2 },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
