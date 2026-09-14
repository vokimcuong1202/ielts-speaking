const { PrismaClient } = require("../generated/client");

const prisma = new PrismaClient();

async function main() {
  const topicGroup = await prisma.topicGroup.create({
    data: {
      name: "Learning a new skill",
      forecastSeason: "2026-Q3",
      questions: {
        create: [
          { part: "part1", text: "Do you enjoy learning new skills?", orderIndex: 0 },
          { part: "part1", text: "What was the last new skill you learned?", orderIndex: 1 },
          {
            part: "part2",
            text: "Describe a new skill you would like to learn. You should say: what it is, why you want to learn it, how you would learn it, and explain how it would benefit you.",
            orderIndex: 0,
            prepSeconds: 60,
            speakSeconds: 120,
          },
          { part: "part3", text: "Why do some people find it hard to learn new skills as adults?", orderIndex: 0 },
          { part: "part3", text: "How has technology changed the way people learn new skills?", orderIndex: 1 },
        ],
      },
    },
  });

  return topicGroup;
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
