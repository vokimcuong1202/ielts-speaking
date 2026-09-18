"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { PracticeSetupSidebar } from "@/components/practice-setup/practice-setup-sidebar";
import { PracticeSetupHeader } from "@/components/practice-setup/practice-setup-header";
import { VoiceSelector } from "@/components/practice-setup/voice-selector";
import { QuestionCountPicker } from "@/components/practice-setup/question-count-picker";
import { TopicRandomNotice } from "@/components/practice-setup/topic-random-notice";
import { usePracticeSetup } from "@/hooks/use-practice-setup";
import type { PracticePartId } from "@/types/practice-setup";

function isPracticePartId(value: string | null): value is PracticePartId {
  return value === "part1" || value === "part3";
}

function PracticeSetupContent() {
  const searchParams = useSearchParams();
  const partParam = searchParams.get("part");
  const partId: PracticePartId = isPracticePartId(partParam) ? partParam : "part1";

  const { data: config, isLoading } = usePracticeSetup(partId);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);

  if (isLoading || !config) {
    return <LoadingScreen />;
  }

  const voiceId = selectedVoiceId ?? config.defaultVoiceId;
  const count = questionCount ?? config.defaultQuestionCount;
  const estimatedMinutes = Math.max(1, Math.round((count * config.secondsPerQuestion) / 60));

  return (
    <div className="flex min-h-screen items-center justify-center bg-page p-4 sm:p-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-surface shadow-xl sm:flex-row">
        <PracticeSetupSidebar config={config} />

        <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
          <PracticeSetupHeader currentStep={1} totalSteps={2} />

          <VoiceSelector voices={config.voices} selectedVoiceId={voiceId} onSelect={setSelectedVoiceId} />

          <QuestionCountPicker
            options={config.questionCountOptions}
            selectedCount={count}
            estimatedMinutes={estimatedMinutes}
            hint={config.realExamHint}
            onSelect={setQuestionCount}
          />

          <TopicRandomNotice text={config.topicRandomNotice} />

          <div className="mt-auto flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="rounded-full">
                Thoát
              </Button>
            </Link>
            <Link href={`/practice/${config.partId}`} className="flex-1">
              <Button variant="primary" size="lg" className="w-full rounded-full">
                Vào phòng thi
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PracticeSetupPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PracticeSetupContent />
    </Suspense>
  );
}
