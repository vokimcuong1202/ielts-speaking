export type PracticePartId = "part1" | "part3";

export type PracticeSetupIcon = "headphones" | "timer" | "chart" | "pen";

export interface PracticeSetupInfoItem {
  icon: PracticeSetupIcon;
  title: string;
  description: string;
}

export interface PracticeVoiceOption {
  id: string;
  name: string;
  initial: string;
  genderLabel: string;
}

export interface PracticeSetupConfig {
  partId: PracticePartId;
  examBadgeLabel: string;
  title: string;
  introDescription: string;
  infoItems: PracticeSetupInfoItem[];
  micReadyLabel: string;
  gradingCreditsRemaining: number;
  voices: PracticeVoiceOption[];
  defaultVoiceId: string;
  questionCountOptions: number[];
  defaultQuestionCount: number;
  secondsPerQuestion: number;
  realExamHint: string;
  topicRandomNotice: string;
}
