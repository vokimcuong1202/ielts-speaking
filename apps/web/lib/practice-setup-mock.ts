import type { PracticePartId, PracticeSetupConfig, PracticeVoiceOption } from "@/types/practice-setup";

const voices: PracticeVoiceOption[] = [
  { id: "heart", name: "Heart", initial: "H", genderLabel: "Nữ · Mỹ" },
  { id: "daniel", name: "Daniel", initial: "D", genderLabel: "Nam · Anh" },
  { id: "olivia", name: "Olivia", initial: "O", genderLabel: "Nữ · Úc" },
];

const configs: Record<PracticePartId, PracticeSetupConfig> = {
  part1: {
    partId: "part1",
    examBadgeLabel: "Phòng thi mô phỏng",
    title: "Part 1 — trước khi bạn nói",
    introDescription: "Bốn điều diễn ra trong 5 phút tới. Đọc nhanh rồi vào phòng.",
    infoItems: [
      {
        icon: "headphones",
        title: "Áp lực như thật",
        description: "Giám khảo AI hỏi liên tiếp, không có thời gian tra từ.",
      },
      {
        icon: "timer",
        title: "Tối đa 40 giây mỗi câu",
        description: "Hết giờ là tự chuyển câu — tập phản xạ, không tập đọc.",
      },
      {
        icon: "chart",
        title: "Điểm sát thi thật",
        description: "Chấm 4 tiêu chí ngay khi bạn nói xong câu cuối.",
      },
      {
        icon: "pen",
        title: "Sửa lỗi theo câu",
        description: "Bản ghi kèm gợi ý thay thế cho từng lỗi bạn mắc.",
      },
    ],
    micReadyLabel: "Mic đã sẵn sàng",
    gradingCreditsRemaining: 18,
    voices,
    defaultVoiceId: "heart",
    questionCountOptions: [2, 3, 4, 5, 6, 7, 8, 9],
    defaultQuestionCount: 6,
    secondsPerQuestion: 50,
    realExamHint: "Phòng thi thật hỏi 8–11 câu ở Part 1. Bắt đầu từ 6 rồi tăng dần.",
    topicRandomNotice: "Chủ đề sẽ được giám khảo bốc ngẫu nhiên — bạn không thấy trước, đúng như phòng thi.",
  },
  part3: {
    partId: "part3",
    examBadgeLabel: "Phòng thi mô phỏng",
    title: "Part 3 — trước khi bạn nói",
    introDescription: "Bốn điều diễn ra trong 5 phút tới. Đọc nhanh rồi vào phòng.",
    infoItems: [
      {
        icon: "headphones",
        title: "Áp lực như thật",
        description: "Giám khảo AI hỏi xoáy sâu vào quan điểm, không có thời gian tra từ.",
      },
      {
        icon: "timer",
        title: "Tối đa 50 giây mỗi câu",
        description: "Hết giờ là tự chuyển câu — tập phản xạ, không tập đọc.",
      },
      {
        icon: "chart",
        title: "Điểm sát thi thật",
        description: "Chấm 4 tiêu chí ngay khi bạn nói xong câu cuối.",
      },
      {
        icon: "pen",
        title: "Sửa lỗi theo câu",
        description: "Bản ghi kèm gợi ý thay thế cho từng lỗi bạn mắc.",
      },
    ],
    micReadyLabel: "Mic đã sẵn sàng",
    gradingCreditsRemaining: 18,
    voices,
    defaultVoiceId: "heart",
    questionCountOptions: [2, 3, 4, 5, 6, 7, 8, 9],
    defaultQuestionCount: 5,
    secondsPerQuestion: 50,
    realExamHint: "Phòng thi thật hỏi 4–6 câu ở Part 3. Bắt đầu từ 5 rồi tăng dần.",
    topicRandomNotice: "Chủ đề Part 3 sẽ nối tiếp chủ đề Part 2 bạn vừa bốc — đúng như phòng thi.",
  },
};

export function getPracticeSetupMockData(partId: PracticePartId): PracticeSetupConfig {
  return configs[partId];
}
