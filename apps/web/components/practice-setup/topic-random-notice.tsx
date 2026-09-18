import { MessageCircleQuestion } from "lucide-react";

export function TopicRandomNotice({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-dashed border-border-strong bg-page/60 p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <MessageCircleQuestion className="h-4 w-4" strokeWidth={2} />
      </span>
      <p className="text-sm text-ink-600">{text}</p>
    </div>
  );
}
