import type { ForecastPracticeData, ForecastQuestionDetail } from "@/types/forecast";

function buildQuestionDetails(): Record<string, ForecastQuestionDetail> {
  return {
    q1: {
      questionId: "q1",
      part: "part2",
      tag: "hayRa",
      title: "Describe an old person you admire",
      prompts: ["who this person is", "how you know them", "what they usually do", "and explain why you admire them."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Mở bằng quan hệ cụ thể:",
          example: "my grandmother on my father's side",
          note: "— tránh mở chung chung.",
        },
        {
          order: 2,
          leadIn: "Một thói quen thường ngày kể thành câu chuyện 20 giây",
          note: "— đây là phần giám khảo nghe fluency.",
        },
        {
          order: 3,
          leadIn: "Chốt bằng lý do đã đổi gì ở bạn, không chỉ",
          example: "\"she is very kind\".",
        },
      ],
      vocabulary: [
        "a wealth of experience",
        "set in her ways",
        "look up to",
        "weather the storm",
        "quietly resilient",
        "pass down",
      ],
      followUpQuestions: [
        "Do young people respect the elderly as much as before?",
        "What can older generations teach younger ones?",
        "Should families live together across generations?",
      ],
    },
    q2: {
      questionId: "q2",
      part: "part2",
      tag: "hayRa",
      title: "Describe a time you helped someone who was in trouble",
      prompts: ["who this person was", "what trouble they were in", "how you helped them", "and explain how you felt afterwards."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Mở bằng bối cảnh cụ thể:",
          example: "a classmate who missed the bus home",
          note: "— tránh mở chung chung.",
        },
        {
          order: 2,
          leadIn: "Kể hành động bạn đã làm theo trình tự thời gian",
          note: "— giám khảo chấm mạch chuyện, không chỉ ngữ pháp.",
        },
      ],
      vocabulary: ["lend a hand", "in a tough spot", "without a second thought", "a weight off their shoulders"],
      followUpQuestions: [
        "Should schools teach students how to help others?",
        "Are people less willing to help strangers nowadays?",
      ],
    },
    q3: {
      questionId: "q3",
      part: "part2",
      tag: "moiVaoBo",
      title: "Describe a piece of technology you find difficult to use",
      prompts: ["what it is", "when you started using it", "what difficulties you have with it", "and explain why you find it difficult."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Chọn một thiết bị cụ thể còn đang dùng, ví dụ:",
          example: "a smart home app",
          note: "— dễ kể chi tiết hơn đồ đã bỏ.",
        },
        {
          order: 2,
          leadIn: "Mô tả cụ thể lỗi hay gặp phải",
          note: "— tránh chỉ nói \"it's complicated\".",
        },
      ],
      vocabulary: ["user-unfriendly", "a steep learning curve", "glitchy", "get the hang of it"],
      followUpQuestions: [
        "Do you think technology makes life more complicated?",
        "Should companies make technology simpler for older users?",
      ],
    },
    q4: {
      questionId: "q4",
      part: "part2",
      title: "Describe a quiet place you like to spend time in",
      prompts: ["where it is", "how often you go there", "what you do there", "and explain why you like it."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Mở bằng vị trí cụ thể:",
          example: "a small reading corner near my house",
        },
        {
          order: 2,
          leadIn: "Kể một hoạt động cụ thể bạn làm ở đó",
          note: "— tránh chỉ nói \"I relax\".",
        },
      ],
      vocabulary: ["a hidden gem", "unwind", "away from the hustle and bustle"],
      followUpQuestions: ["Why do people need quiet places nowadays?", "Are quiet places disappearing in big cities?"],
    },
    q5: {
      questionId: "q5",
      part: "part2",
      title: "Describe a skill you learned from an older family member",
      prompts: ["what the skill is", "who taught you", "how you learned it", "and explain how it has helped you."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Chọn kỹ năng cụ thể, ví dụ:",
          example: "cooking a family recipe",
        },
        {
          order: 2,
          leadIn: "Kể lại một buổi học cụ thể, không chỉ nói chung",
          note: "— giám khảo chấm mạch chuyện.",
        },
      ],
      vocabulary: ["hands-on experience", "pass down", "come in handy"],
      followUpQuestions: [
        "Should schools teach practical life skills?",
        "What can older generations teach younger ones?",
      ],
    },
    q6: {
      questionId: "q6",
      part: "part2",
      title: "Describe a film that made you laugh",
      prompts: ["what film it was", "when you watched it", "what it was about", "and explain why it made you laugh."],
      prepMinutes: 1,
      speakMinutes: 2,
      outlineSteps: [
        {
          order: 1,
          leadIn: "Nêu tên phim và thời điểm xem cụ thể",
        },
        {
          order: 2,
          leadIn: "Kể một cảnh phim cụ thể khiến bạn cười",
          note: "— tránh chỉ nói \"it was funny\".",
        },
      ],
      vocabulary: ["burst out laughing", "a witty script", "had me in stitches"],
      followUpQuestions: ["Do you think comedy films are underrated?", "Why do people enjoy watching funny films?"],
    },
  };
}

export function getForecastPracticeMockData(): ForecastPracticeData {
  return {
    quarter: {
      title: "Bộ đề dự đoán Quý 3/2026",
      rangeLabel: "09 → 12/2026",
      description:
        "48 đề được tổng hợp từ báo cáo phòng thi BC & IDP ba tháng gần nhất. Luyện theo thứ tự xác suất ra đề — đề nào hay ra được đánh dấu riêng.",
    },
    progress: {
      practicedCount: 18,
      totalCount: 48,
      averageBand: 6.0,
      hotUnpracticedCount: 9,
    },
    parts: [
      { id: "part1", label: "Part 1", count: 18 },
      { id: "part2", label: "Part 2", count: 20 },
      { id: "part3", label: "Part 3", count: 10 },
    ],
    questions: [
      {
        id: "q1",
        part: "part2",
        tag: "hayRa",
        category: "Describe a person",
        title: "Describe an old person you admire",
        occurrenceCount: 14,
        occurrenceWindowDays: 30,
        extraMetaLabel: "Nối sang 3 câu Part 3",
        practice: { kind: "not-practiced" },
      },
      {
        id: "q2",
        part: "part2",
        tag: "hayRa",
        category: "Describe an event",
        title: "Describe a time you helped someone who was in trouble",
        occurrenceCount: 11,
        occurrenceWindowDays: 30,
        extraMetaLabel: "Đã luyện 2 lần · 05/09",
        practice: { kind: "practiced", band: 6.5 },
      },
      {
        id: "q3",
        part: "part2",
        tag: "moiVaoBo",
        category: "Describe an object",
        title: "Describe a piece of technology you find difficult to use",
        occurrenceCount: 7,
        occurrenceWindowDays: 30,
        extraMetaLabel: "Vào bộ đề từ 02/09",
        practice: { kind: "not-practiced" },
      },
      {
        id: "q4",
        part: "part2",
        category: "Describe a place",
        title: "Describe a quiet place you like to spend time in",
        occurrenceCount: 6,
        occurrenceWindowDays: 30,
        extraMetaLabel: "Đã luyện 1 lần · 28/08",
        practice: { kind: "practiced", band: 5.5 },
      },
      {
        id: "q5",
        part: "part2",
        category: "Describe an activity",
        title: "Describe a skill you learned from an older family member",
        occurrenceCount: 5,
        occurrenceWindowDays: 30,
        extraMetaLabel: "Nối sang 2 câu Part 3",
        practice: { kind: "not-practiced" },
      },
      {
        id: "q6",
        part: "part2",
        category: "Describe a media",
        title: "Describe a film that made you laugh",
        occurrenceCount: 4,
        occurrenceWindowDays: 30,
        practice: { kind: "not-practiced" },
      },
    ],
    remainingCount: 14,
    questionDetails: buildQuestionDetails(),
  };
}
