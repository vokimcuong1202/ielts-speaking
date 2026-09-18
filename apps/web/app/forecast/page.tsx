"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { ForecastHeader } from "@/components/forecast/forecast-header";
import { PartTabs } from "@/components/forecast/part-tabs";
import { SortFilterBar } from "@/components/forecast/sort-filter-bar";
import { ForecastQuestionCard } from "@/components/forecast/forecast-question-card";
import { SelectedQuestionPanel } from "@/components/forecast/selected-question-panel";
import { useForecastPractice } from "@/hooks/use-forecast-practice";

export default function ForecastPage() {
  const { data, isLoading } = useForecastPractice();
  const [selectedId, setSelectedId] = useState<string | null>("q1");

  if (isLoading || !data) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  const selectedQuestion = selectedId ? data.questionDetails[selectedId] ?? null : null;

  return (
    <AppShell>
      <ForecastHeader quarter={data.quarter} progress={data.progress} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-4">
          <PartTabs parts={data.parts} />
          <SortFilterBar />

          <div className="flex flex-col gap-4">
            {data.questions.map((question) => (
              <ForecastQuestionCard
                key={question.id}
                question={question}
                isSelected={question.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>

          {data.remainingCount > 0 ? (
            <button type="button" className="mx-auto cursor-pointer text-sm font-semibold text-brand-700 hover:underline">
              Còn {data.remainingCount} đề Part 2 →
            </button>
          ) : null}
        </div>

        <SelectedQuestionPanel question={selectedQuestion} onClose={() => setSelectedId(null)} />
      </div>
    </AppShell>
  );
}
