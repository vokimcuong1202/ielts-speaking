import type { VocabularyTopicDetail, VocabularyTopicWordEntry } from "@/types/vocabulary";

function words(entries: Omit<VocabularyTopicWordEntry, "id">[], topicId: string): VocabularyTopicWordEntry[] {
  return entries.map((entry, index) => ({ ...entry, id: `${topicId}-w${index + 1}` }));
}

const topicDetails: Record<string, VocabularyTopicDetail> = {
  "people-relationships": {
    id: "people-relationships",
    titleEn: "People & Relationships",
    titleVi: "Người & quan hệ",
    totalWords: 22,
    masteredWords: 13,
    hotPartsLabel: "hay ra ở Part 1 và Part 2",
    categoryCounts: { collocation: 9, idiom: 6, phrasalVerb: 4, unsaved: 9 },
    words: words(
      [
        {
          category: "collocation",
          word: "a wealth of experience",
          phonetic: "/welθ/",
          meaning: "rất nhiều kinh nghiệm",
          example: "My grandmother has a wealth of experience in raising children.",
        },
        {
          category: "collocation",
          word: "a close-knit family",
          phonetic: "/kləʊs nɪt/",
          meaning: "gia đình gắn bó khăng khít",
          example: "We are a close-knit family, so we eat dinner together.",
        },
        {
          category: "collocation",
          word: "a lifelong friendship",
          phonetic: "/ˈlaɪflɒŋ/",
          meaning: "tình bạn cả đời",
          example: "It turned into a lifelong friendship after university.",
        },
        {
          category: "collocation",
          word: "a role model",
          phonetic: "/rəʊl ˈmɒdl/",
          meaning: "tấm gương để noi theo",
          example: "She is a role model for everyone in my family.",
        },
        {
          category: "idiom",
          word: "weather the storm",
          phonetic: "/ˈweðə ðə stɔːm/",
          meaning: "cùng nhau vượt qua giai đoạn khó khăn",
          example: "My grandparents weathered the storm of the war years.",
        },
        {
          category: "idiom",
          word: "see eye to eye",
          phonetic: "/aɪ tuː aɪ/",
          meaning: "đồng quan điểm với ai",
          example: "We don't always see eye to eye about money.",
        },
        {
          category: "idiom",
          word: "set in her ways",
          phonetic: "/set ɪn hɜː weɪz/",
          meaning: "quen lối sống cũ, khó thay đổi",
          example: "She is a bit set in her ways, but I find that charming.",
        },
        {
          category: "idiom",
          word: "go the extra mile",
          phonetic: "/ˈekstrə maɪl/",
          meaning: "làm hơn cả mức cần thiết",
          example: "He always goes the extra mile for his students.",
        },
        {
          category: "phrasalVerb",
          word: "look up to",
          phonetic: "/lʊk ʌp tuː/",
          meaning: "ngưỡng mộ, coi là hình mẫu",
          example: "I have looked up to my aunt since I was a child.",
        },
        {
          category: "phrasalVerb",
          word: "bring up",
          phonetic: "/brɪŋ ʌp/",
          meaning: "nuôi dạy (một đứa trẻ)",
          example: "I was brought up by my grandparents in the countryside.",
        },
      ],
      "people-relationships"
    ),
  },
  "work-study": {
    id: "work-study",
    titleEn: "Work & Study",
    titleVi: "Công việc & học tập",
    totalWords: 26,
    masteredWords: 18,
    hotPartsLabel: "hay ra ở Part 1 và Part 3",
    categoryCounts: { collocation: 12, idiom: 8, phrasalVerb: 6, unsaved: 8 },
    words: words(
      [
        {
          category: "collocation",
          word: "a heavy workload",
          phonetic: "/ˈwɜːkləʊd/",
          meaning: "khối lượng công việc nặng",
          example: "I have a heavy workload this semester.",
        },
        {
          category: "collocation",
          word: "a tight deadline",
          phonetic: "/ˈdɛdlaɪn/",
          meaning: "hạn nộp gấp",
          example: "We're working against a tight deadline.",
        },
        {
          category: "idiom",
          word: "burn the midnight oil",
          phonetic: "/ˈmɪdnaɪt ɔɪl/",
          meaning: "học/làm việc khuya",
          example: "I had to burn the midnight oil to finish the report.",
        },
        {
          category: "phrasalVerb",
          word: "keep up with",
          phonetic: "/kiːp ʌp wɪð/",
          meaning: "theo kịp",
          example: "It's hard to keep up with the workload.",
        },
      ],
      "work-study"
    ),
  },
  technology: {
    id: "technology",
    titleEn: "Technology",
    titleVi: "Công nghệ",
    totalWords: 19,
    masteredWords: 9,
    hotPartsLabel: "hay ra ở Part 2 và Part 3",
    categoryCounts: { collocation: 8, idiom: 5, phrasalVerb: 6, unsaved: 8 },
    words: words(
      [
        {
          category: "collocation",
          word: "a steep learning curve",
          phonetic: "/stiːp ˈlɜːnɪŋ kɜːv/",
          meaning: "lúc đầu học rất khó",
          example: "Learning to code has a steep learning curve.",
        },
        {
          category: "collocation",
          word: "user-friendly",
          phonetic: "/ˈjuːzə ˈfrɛndli/",
          meaning: "dễ dùng, thân thiện với người dùng",
          example: "The new app is very user-friendly.",
        },
        {
          category: "idiom",
          word: "get the hang of",
          phonetic: "/hæŋ/",
          meaning: "bắt đầu làm quen và thành thạo",
          example: "I finally got the hang of the new software.",
        },
        {
          category: "phrasalVerb",
          word: "log into",
          phonetic: "/lɒg ˈɪntuː/",
          meaning: "đăng nhập vào",
          example: "I couldn't log into my account this morning.",
        },
      ],
      "technology"
    ),
  },
  "hometown-places": {
    id: "hometown-places",
    titleEn: "Hometown & Places",
    titleVi: "Quê hương & nơi ở",
    totalWords: 21,
    masteredWords: 15,
    hotPartsLabel: "hay ra ở Part 1 và Part 2",
    categoryCounts: { collocation: 9, idiom: 6, phrasalVerb: 6, unsaved: 6 },
    words: words(
      [
        {
          category: "collocation",
          word: "a bustling city",
          phonetic: "/ˈbʌslɪŋ/",
          meaning: "thành phố nhộn nhịp",
          example: "Hanoi is a bustling city full of energy.",
        },
        {
          category: "collocation",
          word: "a stone's throw away",
          phonetic: "/stəʊnz θrəʊ/",
          meaning: "rất gần",
          example: "My school is just a stone's throw away.",
        },
        {
          category: "idiom",
          word: "home is where the heart is",
          phonetic: "/hɑːt/",
          meaning: "quê nhà là nơi có trái tim",
          example: "No matter where I go, home is where the heart is.",
        },
        {
          category: "phrasalVerb",
          word: "grow up",
          phonetic: "/grəʊ ʌp/",
          meaning: "trưởng thành, lớn lên",
          example: "I grew up in a small village.",
        },
      ],
      "hometown-places"
    ),
  },
  environment: {
    id: "environment",
    titleEn: "Environment",
    titleVi: "Môi trường",
    totalWords: 17,
    masteredWords: 6,
    hotPartsLabel: "hay ra ở Part 3",
    categoryCounts: { collocation: 7, idiom: 4, phrasalVerb: 6, unsaved: 11 },
    words: words(
      [
        {
          category: "collocation",
          word: "a pressing issue",
          phonetic: "/ˈprɛsɪŋ ˈɪʃuː/",
          meaning: "vấn đề cấp bách",
          example: "Climate change is a pressing issue.",
        },
        {
          category: "collocation",
          word: "renewable energy",
          phonetic: "/rɪˈnjuːəbl ˈɛnədʒi/",
          meaning: "năng lượng tái tạo",
          example: "We should invest more in renewable energy.",
        },
        {
          category: "idiom",
          word: "leave no stone unturned",
          phonetic: "/ʌnˈtɜːnd/",
          meaning: "không bỏ sót cách nào",
          example: "We should leave no stone unturned to protect nature.",
        },
        {
          category: "phrasalVerb",
          word: "cut down on",
          phonetic: "/kʌt daʊn ɒn/",
          meaning: "giảm thiểu",
          example: "We need to cut down on plastic waste.",
        },
      ],
      "environment"
    ),
  },
  "media-free-time": {
    id: "media-free-time",
    titleEn: "Media & Free time",
    titleVi: "Giải trí & thời gian rảnh",
    totalWords: 18,
    masteredWords: 11,
    hotPartsLabel: "hay ra ở Part 1",
    categoryCounts: { collocation: 8, idiom: 4, phrasalVerb: 6, unsaved: 7 },
    words: words(
      [
        {
          category: "collocation",
          word: "binge-watch a series",
          phonetic: "/bɪndʒ wɒtʃ/",
          meaning: "xem liền một mạch",
          example: "I binge-watched the whole series in one weekend.",
        },
        {
          category: "collocation",
          word: "a guilty pleasure",
          phonetic: "/ˈgɪlti ˈplɛʒə/",
          meaning: "thú vui khó bỏ",
          example: "Reality TV is my guilty pleasure.",
        },
        {
          category: "idiom",
          word: "glued to the screen",
          phonetic: "/gluːd/",
          meaning: "dán mắt vào màn hình",
          example: "Kids these days are glued to the screen.",
        },
        {
          category: "phrasalVerb",
          word: "chill out",
          phonetic: "/tʃɪl aʊt/",
          meaning: "thư giãn",
          example: "I like to chill out with music after work.",
        },
      ],
      "media-free-time"
    ),
  },
  travel: {
    id: "travel",
    titleEn: "Travel",
    titleVi: "Du lịch & di chuyển",
    totalWords: 16,
    masteredWords: 7,
    hotPartsLabel: "hay ra ở Part 2",
    categoryCounts: { collocation: 7, idiom: 4, phrasalVerb: 5, unsaved: 9 },
    words: words(
      [
        {
          category: "collocation",
          word: "off the beaten track",
          phonetic: "/ˈbiːtn træk/",
          meaning: "nơi ít người biết đến",
          example: "We prefer places off the beaten track.",
        },
        {
          category: "collocation",
          word: "a breathtaking view",
          phonetic: "/ˈbrɛθteɪkɪŋ/",
          meaning: "cảnh đẹp ngoạn mục",
          example: "The mountain offers a breathtaking view.",
        },
        {
          category: "idiom",
          word: "catch some rays",
          phonetic: "/reɪz/",
          meaning: "tắm nắng",
          example: "We spent the afternoon catching some rays on the beach.",
        },
        {
          category: "phrasalVerb",
          word: "set off",
          phonetic: "/sɛt ɒf/",
          meaning: "khởi hành",
          example: "We set off early to avoid traffic.",
        },
      ],
      "travel"
    ),
  },
  "health-food": {
    id: "health-food",
    titleEn: "Health & Food",
    titleVi: "Sức khoẻ & ăn uống",
    totalWords: 15,
    masteredWords: 8,
    hotPartsLabel: "hay ra ở Part 1",
    categoryCounts: { collocation: 6, idiom: 4, phrasalVerb: 5, unsaved: 7 },
    words: words(
      [
        {
          category: "collocation",
          word: "a balanced diet",
          phonetic: "/ˈbælənst ˈdaɪət/",
          meaning: "chế độ ăn cân bằng",
          example: "A balanced diet keeps you healthy.",
        },
        {
          category: "collocation",
          word: "junk food",
          phonetic: "/dʒʌŋk fuːd/",
          meaning: "đồ ăn nhanh không lành mạnh",
          example: "I try to avoid junk food.",
        },
        {
          category: "idiom",
          word: "you are what you eat",
          phonetic: "/iːt/",
          meaning: "ăn gì thì là người thế đó",
          example: "My mom always says you are what you eat.",
        },
        {
          category: "phrasalVerb",
          word: "work out",
          phonetic: "/wɜːk aʊt/",
          meaning: "tập thể dục",
          example: "I work out three times a week.",
        },
      ],
      "health-food"
    ),
  },
  "money-shopping": {
    id: "money-shopping",
    titleEn: "Money & Shopping",
    titleVi: "Tiền & mua sắm",
    totalWords: 14,
    masteredWords: 5,
    hotPartsLabel: "hay ra ở Part 1 và Part 3",
    categoryCounts: { collocation: 6, idiom: 4, phrasalVerb: 4, unsaved: 9 },
    words: words(
      [
        {
          category: "collocation",
          word: "a great bargain",
          phonetic: "/ˈbɑːgɪn/",
          meaning: "món hời",
          example: "I got this jacket at a great bargain.",
        },
        {
          category: "collocation",
          word: "disposable income",
          phonetic: "/dɪˈspəʊzəbl/",
          meaning: "thu nhập khả dụng",
          example: "Young people have more disposable income nowadays.",
        },
        {
          category: "idiom",
          word: "cost an arm and a leg",
          phonetic: "/ɑːm/",
          meaning: "rất đắt",
          example: "That laptop cost an arm and a leg.",
        },
        {
          category: "phrasalVerb",
          word: "save up for",
          phonetic: "/seɪv ʌp fɔː/",
          meaning: "tiết kiệm để mua",
          example: "I'm saving up for a new phone.",
        },
      ],
      "money-shopping"
    ),
  },
  education: {
    id: "education",
    titleEn: "Education",
    titleVi: "Giáo dục",
    totalWords: 20,
    masteredWords: 12,
    hotPartsLabel: "hay ra ở Part 1 và Part 3",
    categoryCounts: { collocation: 9, idiom: 5, phrasalVerb: 6, unsaved: 8 },
    words: words(
      [
        {
          category: "collocation",
          word: "rote learning",
          phonetic: "/rəʊt/",
          meaning: "học vẹt",
          example: "Rote learning doesn't help students think critically.",
        },
        {
          category: "collocation",
          word: "a well-rounded education",
          phonetic: "/wɛl ˈraʊndɪd/",
          meaning: "giáo dục toàn diện",
          example: "Schools should provide a well-rounded education.",
        },
        {
          category: "idiom",
          word: "hit the books",
          phonetic: "/bʊks/",
          meaning: "học chăm chỉ",
          example: "I need to hit the books before the exam.",
        },
        {
          category: "phrasalVerb",
          word: "drop out",
          phonetic: "/drɒp aʊt/",
          meaning: "bỏ học",
          example: "Some students drop out due to financial issues.",
        },
      ],
      "education"
    ),
  },
  "city-transport": {
    id: "city-transport",
    titleEn: "City & Transport",
    titleVi: "Thành phố & giao thông",
    totalWords: 13,
    masteredWords: 4,
    hotPartsLabel: "hay ra ở Part 3",
    categoryCounts: { collocation: 5, idiom: 3, phrasalVerb: 5, unsaved: 9 },
    words: words(
      [
        {
          category: "collocation",
          word: "heavy traffic",
          phonetic: "/ˈhɛvi ˈtræfɪk/",
          meaning: "giao thông đông đúc",
          example: "Heavy traffic makes the commute stressful.",
        },
        {
          category: "collocation",
          word: "public transport",
          phonetic: "/ˈpʌblɪk ˈtrænspɔːt/",
          meaning: "giao thông công cộng",
          example: "Public transport is cheap and convenient.",
        },
        {
          category: "idiom",
          word: "in the fast lane",
          phonetic: "/leɪn/",
          meaning: "cuộc sống bận rộn, gấp gáp",
          example: "City life often feels like living in the fast lane.",
        },
        {
          category: "phrasalVerb",
          word: "commute to",
          phonetic: "/kəˈmjuːt tuː/",
          meaning: "đi lại (giữa nhà và nơi làm)",
          example: "I commute to work by bus.",
        },
      ],
      "city-transport"
    ),
  },
  "culture-tradition": {
    id: "culture-tradition",
    titleEn: "Culture & Tradition",
    titleVi: "Văn hoá & truyền thống",
    totalWords: 12,
    masteredWords: 3,
    hotPartsLabel: "hay ra ở Part 2 và Part 3",
    categoryCounts: { collocation: 5, idiom: 3, phrasalVerb: 4, unsaved: 9 },
    words: words(
      [
        {
          category: "collocation",
          word: "a deep-rooted tradition",
          phonetic: "/diːp ˈruːtɪd/",
          meaning: "truyền thống ăn sâu",
          example: "Tet is a deep-rooted tradition in Vietnam.",
        },
        {
          category: "collocation",
          word: "cultural heritage",
          phonetic: "/ˈkʌltʃərəl ˈhɛrɪtɪdʒ/",
          meaning: "di sản văn hoá",
          example: "We should preserve our cultural heritage.",
        },
        {
          category: "idiom",
          word: "pass down",
          phonetic: "/pɑːs daʊn/",
          meaning: "truyền lại",
          example: "These customs are passed down through generations.",
        },
        {
          category: "phrasalVerb",
          word: "carry on",
          phonetic: "/ˈkæri ɒn/",
          meaning: "duy trì, tiếp tục",
          example: "We carry on this tradition every year.",
        },
      ],
      "culture-tradition"
    ),
  },
};

export function getVocabularyTopicDetailMockData(topicId: string): VocabularyTopicDetail | undefined {
  return topicDetails[topicId];
}
