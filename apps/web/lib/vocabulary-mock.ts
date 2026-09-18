import type { VocabularyGroup, VocabularyNotebookData, VocabularyTopic } from "@/types/vocabulary";

function buildGroups(): VocabularyGroup[] {
  return [
    {
      id: "group-1",
      sourceType: "forecast",
      question: "Describe an old person you admire",
      dateLabel: "12/09",
      partLabel: "Part 2",
      words: [
        {
          id: "g1-w1",
          category: "collocation",
          word: "a wealth of experience",
          phonetic: "/ə welθ əv ɪkˈspɪəriəns/",
          meaning: "rất nhiều kinh nghiệm",
          example: "My grandmother has a wealth of experience in raising children.",
        },
        {
          id: "g1-w2",
          category: "idiom",
          word: "set in her ways",
          phonetic: "/set ɪn hɜː weɪz/",
          meaning: "quen lối cũ, khó thay đổi",
          example: "She is a bit set in her ways, but I find that charming.",
        },
        {
          id: "g1-w3",
          category: "collocation",
          word: "quietly resilient",
          phonetic: "/ˈkwaɪətli rɪˈzɪliənt/",
          meaning: "kiên cường một cách âm thầm",
          example: "Despite her age, she remains quietly resilient through every hardship.",
        },
        {
          id: "g1-w4",
          category: "phrasalVerb",
          word: "pass down",
          phonetic: "/pɑːs daʊn/",
          meaning: "truyền lại cho thế hệ sau",
          example: "These recipes have been passed down for generations.",
        },
        {
          id: "g1-w5",
          category: "phrasalVerb",
          word: "look up to",
          phonetic: "/lʊk ʌp tuː/",
          meaning: "ngưỡng mộ, coi là hình mẫu",
          example: "I have looked up to my aunt since I was a child.",
        },
        {
          id: "g1-w6",
          category: "collocation",
          word: "a role model",
          phonetic: "/ə rəʊl ˈmɒdl/",
          meaning: "tấm gương để noi theo",
          example: "She is a role model for everyone in my family.",
        },
        {
          id: "g1-w7",
          category: "idiom",
          word: "go the extra mile",
          phonetic: "/gəʊ ðə ˈekstrə maɪl/",
          meaning: "làm hơn mức cần thiết",
          example: "He always goes the extra mile for his students.",
        },
        {
          id: "g1-w8",
          category: "collocation",
          word: "a close bond",
          phonetic: "/ə kləʊs bɒnd/",
          meaning: "sự gắn bó thân thiết",
          example: "We share a close bond that has lasted decades.",
        },
      ],
    },
    {
      id: "group-2",
      sourceType: "forecast",
      question: "Describe a piece of technology you find difficult to use",
      dateLabel: "09/09",
      partLabel: "Part 2",
      words: [
        {
          id: "g2-w1",
          category: "collocation",
          word: "a steep learning curve",
          phonetic: "/ə stiːp ˈlɜːnɪŋ kɜːv/",
          meaning: "lúc đầu học rất khó",
          example: "Learning to code has a steep learning curve.",
        },
        {
          id: "g2-w2",
          category: "collocation",
          word: "user-friendly",
          phonetic: "/ˈjuːzə ˈfrɛndli/",
          meaning: "dễ dùng, thân thiện với người dùng",
          example: "The new app is very user-friendly.",
        },
        {
          id: "g2-w3",
          category: "idiom",
          word: "get the hang of",
          phonetic: "/get ðə hæŋ əv/",
          meaning: "bắt đầu làm quen và thành thạo",
          example: "I finally got the hang of the new software.",
        },
        {
          id: "g2-w4",
          category: "phrasalVerb",
          word: "keep up with",
          phonetic: "/kiːp ʌp wɪð/",
          meaning: "theo kịp (công nghệ, thay đổi)",
          example: "It's hard to keep up with the workload.",
        },
      ],
    },
    {
      id: "group-3",
      sourceType: "test",
      question: "Full test #66 — Part 1 & Part 3",
      dateLabel: "15/09",
      partLabel: "Full test",
      words: [
        {
          id: "g3-w1",
          category: "idiom",
          word: "weather the storm",
          phonetic: "/ˈweðə ðə stɔːm/",
          meaning: "cùng vượt qua khó khăn",
          example: "My grandparents weathered the storm of the war years.",
        },
        {
          id: "g3-w2",
          category: "collocation",
          word: "a close-knit family",
          phonetic: "/ə kləʊs nɪt ˈfæmɪli/",
          meaning: "gia đình gắn bó khăng khít",
          example: "We are a close-knit family, so we eat dinner together.",
        },
        {
          id: "g3-w3",
          category: "idiom",
          word: "see eye to eye",
          phonetic: "/siː aɪ tuː aɪ/",
          meaning: "đồng quan điểm với ai",
          example: "We don't always see eye to eye about money.",
        },
        {
          id: "g3-w4",
          category: "phrasalVerb",
          word: "bring up",
          phonetic: "/brɪŋ ʌp/",
          meaning: "nuôi dạy (một đứa trẻ)",
          example: "I was brought up by my grandparents in the countryside.",
        },
      ],
    },
  ];
}

function buildTopics(): VocabularyTopic[] {
  return [
    { id: "people-relationships", titleEn: "People & Relationships", titleVi: "Người & quan hệ", totalWords: 22, masteredWords: 13 },
    { id: "work-study", titleEn: "Work & Study", titleVi: "Công việc & học tập", totalWords: 26, masteredWords: 18 },
    { id: "technology", titleEn: "Technology", titleVi: "Công nghệ", totalWords: 19, masteredWords: 9 },
    { id: "hometown-places", titleEn: "Hometown & Places", titleVi: "Quê hương & nơi ở", totalWords: 21, masteredWords: 15 },
    { id: "environment", titleEn: "Environment", titleVi: "Môi trường", totalWords: 17, masteredWords: 6 },
    { id: "media-free-time", titleEn: "Media & Free time", titleVi: "Giải trí & thời gian rảnh", totalWords: 18, masteredWords: 11 },
    { id: "travel", titleEn: "Travel", titleVi: "Du lịch & di chuyển", totalWords: 16, masteredWords: 7 },
    { id: "health-food", titleEn: "Health & Food", titleVi: "Sức khoẻ & ăn uống", totalWords: 15, masteredWords: 8 },
    { id: "money-shopping", titleEn: "Money & Shopping", titleVi: "Tiền & mua sắm", totalWords: 14, masteredWords: 5 },
    { id: "education", titleEn: "Education", titleVi: "Giáo dục", totalWords: 20, masteredWords: 12 },
    { id: "city-transport", titleEn: "City & Transport", titleVi: "Thành phố & giao thông", totalWords: 13, masteredWords: 4 },
    { id: "culture-tradition", titleEn: "Culture & Tradition", titleVi: "Văn hoá & truyền thống", totalWords: 12, masteredWords: 3 },
  ];
}

export function getVocabularyNotebookMockData(): VocabularyNotebookData {
  const topics = buildTopics();

  return {
    reviewSummary: { dueTodayCount: 12, quickReviewMinutes: 4 },
    filterCounts: { all: 46, needsReview: 12, mastered: 21 },
    groups: buildGroups(),
    remainingGroupsCount: 9,
    topicOverview: {
      masteredCount: topics.reduce((sum, topic) => sum + topic.masteredWords, 0),
      totalCount: 218,
      topicCount: topics.length,
    },
    topics,
  };
}
