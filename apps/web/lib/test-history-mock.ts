import type {
  TestActivityDay,
  TestActivityMonthLabel,
  TestActivitySummary,
  TestAttempt,
  TestHistoryData,
} from "@/types/test-history";
import { mulberry32 } from "./random";

function buildActivity(): TestActivitySummary {
  const random = mulberry32(7);
  const weekCount = 22;
  const rowsPerWeek = 5;
  const weeks: TestActivityDay[][] = [];
  const monthLabels: TestActivityMonthLabel[] = [];
  let lastMonth = -1;

  const start = new Date();
  start.setDate(start.getDate() - weekCount * 7);

  for (let week = 0; week < weekCount; week += 1) {
    const days: TestActivityDay[] = [];
    for (let row = 0; row < rowsPerWeek; row += 1) {
      const date = new Date(start);
      date.setDate(date.getDate() + week * 7 + row);
      if (date > new Date()) continue;

      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex: week, label: `Th${month + 1}` });
        lastMonth = month;
      }

      const roll = random();
      const level = roll < 0.35 ? 0 : roll < 0.58 ? 1 : roll < 0.78 ? 2 : roll < 0.92 ? 3 : 4;
      days.push({ date: date.toISOString().slice(0, 10), level: level as TestActivityDay["level"] });
    }
    weeks.push(days);
  }

  return { monthLabels, weeks, totalAttempts: 66, bestBand: 6.5 };
}

function buildAttempts(): TestAttempt[] {
  return [
    {
      id: "attempt-1",
      testType: "part1",
      title: "Test Part 1",
      status: "invalid",
      timestamp: "15/09 · 16:38",
      summary:
        "Bài thi rời khỏi màn hình giữa chừng nên nghi có trợ giúp bên ngoài — SpeakPrep không chấm lần này.",
      expandLabel: "Xem 2 câu đã ghi",
      collapseLabel: "Ẩn 2 câu đã ghi",
      detail: {
        note: "2 câu đã ghi âm trước khi bài thi bị huỷ. Vì phiên thi không hợp lệ nên các câu này không được chấm điểm.",
        questions: [
          {
            id: "attempt-1-q1",
            index: 1,
            question: "What is your full name?",
            content: { kind: "shortAnswer", quote: "My full name is Nguyen Minh Anh.", explanation: "chưa được chấm điểm" },
          },
          {
            id: "attempt-1-q2",
            index: 2,
            question: "Can I see your identification, please?",
            content: { kind: "shortAnswer", quote: "Yes, here is my ID card.", explanation: "chưa được chấm điểm" },
          },
        ],
      },
    },
    {
      id: "attempt-2",
      testType: "full",
      title: "Full Test",
      status: "grading",
      timestamp: "15/09 · 20:02",
      summary: "AI đang chấm 11 câu — thường mất dưới 1 phút, bạn có thể rời trang.",
      gradingPercent: 62,
      detail: {
        note: "Kết quả từng câu sẽ hiển thị ở đây ngay khi AI chấm xong — thường mất dưới 1 phút.",
        questions: [],
      },
    },
    {
      id: "attempt-3",
      testType: "part3",
      title: "Test Part 3",
      status: "completed",
      timestamp: "14/09 · 09:45",
      summary: 'Câu yếu nhất: "Is it always good to be popular?" — trả lời quá ngắn.',
      band: 5.0,
      skills: { fluency: 5, vocabulary: 5, grammar: 5, pronunciation: 6 },
      detail: {
        durationLabel: "4 câu · 3 phút 10 giây · giọng Heart",
        questions: [
          {
            id: "attempt-3-q1",
            index: 1,
            question: "Is it always good to be popular?",
            isWeakest: true,
            band: 5.0,
            skills: { fluency: 5, vocabulary: 5, grammar: 5, pronunciation: 6 },
            content: {
              kind: "shortAnswer",
              quote: "Not really, sometimes it's not good.",
              explanation: "trả lời quá ngắn nên giám khảo phải hỏi thêm để làm rõ ý.",
            },
            feedback: "Câu trả lời chỉ dừng ở \"không\" — thêm một lý do ngắn hoặc một ví dụ là đủ lên band 5.5.",
          },
          {
            id: "attempt-3-q2",
            index: 2,
            question: "What are the benefits of being popular?",
            band: 5.0,
            skills: { fluency: 5, vocabulary: 5, grammar: 5, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "I think popular people can make " },
                { kind: "diff", remove: "many many", add: "a lot of" },
                { kind: "text", content: " friends easily and people usually want to help them." },
              ],
            },
          },
          {
            id: "attempt-3-q3",
            index: 3,
            question: "Do you think social media affects how popular someone is?",
            band: 5.0,
            skills: { fluency: 5, vocabulary: 4, grammar: 5, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, I think so. If someone " },
                { kind: "diff", remove: "have", add: "has" },
                { kind: "text", content: " many followers on social media, more people will know about them." },
              ],
            },
          },
          {
            id: "attempt-3-q4",
            index: 4,
            question: "Should people try hard to become popular?",
            band: 5.0,
            skills: { fluency: 5, vocabulary: 5, grammar: 5, pronunciation: 5 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "I don't think so, because it takes a lot of time and " },
                { kind: "diff", remove: "it is not important thing", add: "it isn't the most important thing" },
                { kind: "text", content: " in life." },
              ],
            },
          },
        ],
      },
    },
    {
      id: "attempt-4",
      testType: "part1",
      title: "Test Part 1",
      status: "completed",
      timestamp: "05/08 · 11:37",
      summary: "Lần thi gốc · đã thi lại 3 lần sau đó.",
      band: 5.5,
      skills: { fluency: 6, vocabulary: 5, grammar: 6, pronunciation: 6 },
      detail: {
        durationLabel: "6 câu · 4 phút 05 giây · giọng Heart",
        questions: [
          {
            id: "attempt-4-q1",
            index: 1,
            question: "Where is your hometown?",
            band: 5.5,
            skills: { fluency: 6, vocabulary: 5, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "I live in a small province in the south of Vietnam, it is " },
                { kind: "diff", remove: "very very", add: "quite" },
                { kind: "text", content: " peaceful." },
              ],
            },
          },
          {
            id: "attempt-4-q2",
            index: 2,
            question: "What is your hometown famous for?",
            band: 5.5,
            skills: { fluency: 6, vocabulary: 5, grammar: 5, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "It is famous for its " },
                { kind: "diff", remove: "beach", add: "beaches" },
                { kind: "text", content: " and seafood restaurants." },
              ],
            },
          },
          {
            id: "attempt-4-q3",
            index: 3,
            question: "Do you like living there?",
            isWeakest: true,
            band: 5.0,
            skills: { fluency: 5, vocabulary: 5, grammar: 5, pronunciation: 6 },
            content: { kind: "shortAnswer", quote: "Yes, I like it.", explanation: "câu trả lời quá ngắn." },
            feedback: "Thêm một lý do cụ thể (ví dụ: không khí trong lành, gần gia đình) để câu trả lời đầy đủ hơn.",
          },
          {
            id: "attempt-4-q4",
            index: 4,
            question: "What do you like most about your hometown?",
            band: 5.5,
            skills: { fluency: 6, vocabulary: 5, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "I like the food most, especially the " },
                { kind: "diff", remove: "seafoods", add: "seafood" },
                { kind: "text", content: " near the beach." },
              ],
            },
          },
          {
            id: "attempt-4-q5",
            index: 5,
            question: "Has your hometown changed much in recent years?",
            band: 5.5,
            skills: { fluency: 6, vocabulary: 6, grammar: 5, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, there are " },
                { kind: "diff", remove: "more more", add: "a lot more" },
                { kind: "text", content: " buildings and shops than before." },
              ],
            },
          },
          {
            id: "attempt-4-q6",
            index: 6,
            question: "Would you like to live there in the future?",
            band: 6.0,
            skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Probably, because it is peaceful and my family " },
                { kind: "diff", remove: "is", add: "are" },
                { kind: "text", content: " still living there." },
              ],
            },
          },
        ],
      },
    },
    {
      id: "attempt-5",
      testType: "part1",
      title: "Test Part 1",
      status: "completed",
      timestamp: "05/08 · 14:57",
      retryCount: 3,
      deltaFromFirstAttempt: 1.0,
      summary: "6 câu · 4 phút 52 giây · giọng Heart. Điểm thi lại dùng để luyện, không dùng để đo phản xạ thật.",
      band: 6.5,
      skills: { fluency: 7, vocabulary: 7, grammar: 7, pronunciation: 6 },
      detail: {
        durationLabel: "6 câu · 4 phút 52 giây · giọng Heart",
        note: "Điểm thi lại dùng để luyện, không dùng để đo phản xạ thật.",
        questions: [
          {
            id: "attempt-5-q1",
            index: 1,
            question: "Where is your hometown?",
            band: 6.5,
            skills: { fluency: 7, vocabulary: 6, grammar: 7, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                {
                  kind: "text",
                  content:
                    "I live in a small province in the south of Vietnam. I lived with my parents and my sister and lived there ",
                },
                { kind: "diff", remove: "since", add: "for" },
                { kind: "text", content: " over eighteen years before moving to " },
                { kind: "diff", remove: "Hautien", add: "Ha Tien" },
                { kind: "text", content: " City for university." },
              ],
            },
          },
          {
            id: "attempt-5-q2",
            index: 2,
            question: "What is your hometown famous for?",
            band: 7.0,
            skills: { fluency: 7, vocabulary: 7, grammar: 7, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "It's well known for its fresh seafood and " },
                { kind: "diff", remove: "quiet quiet", add: "peaceful" },
                { kind: "text", content: " beaches along the coast." },
              ],
            },
          },
          {
            id: "attempt-5-q3",
            index: 3,
            question: "Do you like living there?",
            band: 7.0,
            skills: { fluency: 7, vocabulary: 7, grammar: 7, pronunciation: 7 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Definitely, I enjoy the slow pace of life and being close to " },
                { kind: "diff", remove: "my family members", add: "my family" },
                { kind: "text", content: " whenever I visit." },
              ],
            },
          },
          {
            id: "attempt-5-q4",
            index: 4,
            question: "What do you like most about your hometown?",
            band: 6.5,
            skills: { fluency: 7, vocabulary: 6, grammar: 7, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Probably the food — the seafood " },
                { kind: "diff", remove: "there is", add: "there's" },
                { kind: "text", content: " incredibly fresh and cheap." },
              ],
            },
          },
          {
            id: "attempt-5-q5",
            index: 5,
            question: "Has your hometown changed much in recent years?",
            band: 6.5,
            skills: { fluency: 7, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, quite a lot. There " },
                { kind: "diff", remove: "is", add: "are" },
                { kind: "text", content: " a lot more tourists and new hotels than when I was a kid." },
              ],
            },
          },
          {
            id: "attempt-5-q6",
            index: 6,
            question: "Is it always good to be a popular student?",
            isWeakest: true,
            band: 4.5,
            skills: { fluency: 4, vocabulary: 4, grammar: 5, pronunciation: 5 },
            content: {
              kind: "shortAnswer",
              quote: "I don't know.",
              explanation: "câu quá ngắn nên giám khảo phải hỏi thêm; điểm được tính ở câu trả lời sau.",
            },
            feedback: "Trả lời \"I don't know\" gần như không cho điểm — hãy đưa ra một quan điểm và giải thích ngắn.",
          },
        ],
      },
    },
    {
      id: "attempt-6",
      testType: "part1",
      title: "Test Part 1",
      status: "completed",
      timestamp: "05/08 · 14:43",
      retryCount: 2,
      summary: "",
      band: 6.0,
      skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
      detail: {
        durationLabel: "6 câu · 4 phút 30 giây · giọng Heart",
        questions: [
          {
            id: "attempt-6-q1",
            index: 1,
            question: "Where is your hometown?",
            band: 6.0,
            skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "I live in a small province in the south of Vietnam and I lived there " },
                { kind: "diff", remove: "since", add: "for" },
                { kind: "text", content: " over eighteen years." },
              ],
            },
          },
          {
            id: "attempt-6-q2",
            index: 2,
            question: "What is your hometown famous for?",
            band: 6.0,
            skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "It's famous for its beaches and " },
                { kind: "diff", remove: "fresh fresh", add: "very fresh" },
                { kind: "text", content: " seafood." },
              ],
            },
          },
          {
            id: "attempt-6-q3",
            index: 3,
            question: "Do you like living there?",
            band: 6.0,
            skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, I like it because it's peaceful and " },
                { kind: "diff", remove: "the people is", add: "the people are" },
                { kind: "text", content: " friendly." },
              ],
            },
          },
          {
            id: "attempt-6-q4",
            index: 4,
            question: "What do you like most about your hometown?",
            isWeakest: true,
            band: 5.5,
            skills: { fluency: 5, vocabulary: 5, grammar: 6, pronunciation: 6 },
            content: {
              kind: "shortAnswer",
              quote: "I like the food.",
              explanation: "câu trả lời khá ngắn, thiếu ví dụ cụ thể.",
            },
            feedback: "Nêu tên một món ăn cụ thể và giải thích lý do để câu trả lời tự nhiên và đầy đủ hơn.",
          },
          {
            id: "attempt-6-q5",
            index: 5,
            question: "Has your hometown changed much in recent years?",
            band: 6.0,
            skills: { fluency: 6, vocabulary: 6, grammar: 6, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, there are " },
                { kind: "diff", remove: "more more", add: "a lot more" },
                { kind: "text", content: " shops and restaurants now." },
              ],
            },
          },
          {
            id: "attempt-6-q6",
            index: 6,
            question: "Would you like to live there in the future?",
            band: 6.5,
            skills: { fluency: 6, vocabulary: 6, grammar: 7, pronunciation: 6 },
            content: {
              kind: "transcript",
              segments: [
                { kind: "text", content: "Yes, probably, because my family " },
                { kind: "diff", remove: "is", add: "are" },
                { kind: "text", content: " still there and I miss the food." },
              ],
            },
          },
        ],
      },
    },
  ];
}

export function getTestHistoryMockData(): TestHistoryData {
  return {
    activity: buildActivity(),
    attempts: buildAttempts(),
    totalAttemptsOlder: 61,
  };
}
