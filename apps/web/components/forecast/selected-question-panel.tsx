import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuggestedOutlineList } from "./suggested-outline-list";
import { VocabularyChipList } from "./vocabulary-chip-list";
import { FollowUpQuestionsCard } from "./followup-questions-card";
import type { ForecastQuestionDetail } from "@/types/forecast";

const tagBadgeProps: Record<"hayRa" | "moiVaoBo", { variant: "warning" | "brand"; label: string }> = {
  hayRa: { variant: "warning", label: "HAY RA" },
  moiVaoBo: { variant: "brand", label: "ĐỀ MỚI" },
};

const partLabels: Record<ForecastQuestionDetail["part"], string> = {
  part1: "PART 1",
  part2: "PART 2",
  part3: "PART 3",
};

interface SelectedQuestionPanelProps {
  question: ForecastQuestionDetail | null;
  onClose: () => void;
}

export function SelectedQuestionPanel({ question, onClose }: SelectedQuestionPanelProps) {
  if (!question) {
    return (
      <Card className="flex h-full min-h-[240px] items-center justify-center p-6 text-center">
        <p className="text-sm text-ink-400">Chọn một đề bên trái để xem gợi ý luyện tập.</p>
      </Card>
    );
  }

  const tag = question.tag ? tagBadgeProps[question.tag] : null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-400">
            Đề đang chọn · {partLabels[question.part]}
          </p>
          {tag ? (
            <Badge variant={tag.variant} size="sm">
              {tag.label}
            </Badge>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full p-1 text-ink-400 hover:bg-page hover:text-ink-700"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <Card className="p-5">
        <h3 className="text-lg font-extrabold text-ink-900">{question.title}</h3>

        <p className="mt-3 text-sm font-semibold text-ink-700">You should say:</p>
        <ul className="mt-1.5 flex flex-col gap-1">
          {question.prompts.map((prompt, index) => (
            <li key={index} className="flex gap-2 text-sm text-ink-600">
              <span className="text-ink-400">—</span>
              {prompt}
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-border pt-3 text-xs text-ink-400">
          {question.prepMinutes} phút chuẩn bị · {question.speakMinutes} phút nói
        </div>
      </Card>

      <div>
        <h4 className="text-sm font-bold text-ink-900">Khung ý gợi ý</h4>
        <SuggestedOutlineList steps={question.outlineSteps} />
      </div>

      <div>
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-ink-900">Từ &amp; cụm nên dùng</h4>
          <a href="#" className="shrink-0 text-xs font-semibold text-brand-700 hover:underline">
            Lưu cả {question.vocabulary.length} vào sổ →
          </a>
        </div>
        <VocabularyChipList words={question.vocabulary} />
      </div>

      {question.followUpQuestions.length > 0 ? <FollowUpQuestionsCard questions={question.followUpQuestions} /> : null}

      <div>
        <Button variant="primary" size="lg" className="w-full">
          Vào phòng thi để đề này
        </Button>
        <p className="mt-2 text-center text-xs text-ink-400">Gói Pro · nói không giới hạn</p>
      </div>
    </div>
  );
}
