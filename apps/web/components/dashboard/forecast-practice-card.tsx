import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ForecastQuestionItem } from "./forecast-question-item";
import type { ForecastQuestion } from "@/types/dashboard";

const partFilters = [
  { id: "part1", label: "Part 1" },
  { id: "part2", label: "Part 2" },
  { id: "part3", label: "Part 3" },
];

export function ForecastPracticeCard({ questions }: { questions: ForecastQuestion[] }) {
  return (
    <Card className="flex-1 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Luyện theo Forecast</h3>
        <Link href="/forecast" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Xem 42 chủ đề
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {partFilters.map((part) => (
          <Link
            key={part.id}
            href={`/forecast?part=${part.id}`}
            className="flex cursor-pointer items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-700 hover:bg-page"
          >
            {part.label}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {questions.map((question) => (
          <ForecastQuestionItem key={question.id} question={question} />
        ))}
      </div>
    </Card>
  );
}
