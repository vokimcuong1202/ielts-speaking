import { Badge } from "@/components/ui/badge";
import { getScoreTone, SCORE_TONE_BADGE_VARIANT } from "@/lib/score-tone";
import type { SkillScores } from "@/types/test-history";

const skillLabels: { key: keyof SkillScores; label: string }[] = [
  { key: "fluency", label: "Trôi chảy" },
  { key: "vocabulary", label: "Từ vựng" },
  { key: "grammar", label: "Ngữ pháp" },
  { key: "pronunciation", label: "Phát âm" },
];

export function SkillTagsRow({ skills }: { skills: SkillScores }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {skillLabels.map(({ key, label }) => {
        const score = skills[key];
        return (
          <Badge key={key} variant={SCORE_TONE_BADGE_VARIANT[getScoreTone(score)]} size="md">
            {label} {score}
          </Badge>
        );
      })}
    </div>
  );
}
