import Link from "next/link";
import { Bookmark, BookmarkCheck, ChevronRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuestionHeaderProps {
  partLabel: string;
  title: string;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function QuestionHeader({ partLabel, title, isBookmarked, onToggleBookmark }: QuestionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <nav className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-ink-500">
        <Link href="/dashboard" className="hover:text-ink-900">
          Trang chủ
        </Link>
        <ChevronRight className="size-3.5 text-ink-400" />
        <Link href="/forecast" className="hover:text-ink-900">
          Luyện Forecast
        </Link>
        <Badge variant="brand" size="sm" className="tracking-widest">
          {partLabel}
        </Badge>
        <ChevronRight className="size-3.5 text-ink-400" />
        <span className="flex min-w-0 items-center gap-2 font-bold text-ink-900">
          <Play className="size-5 shrink-0 rounded-full border border-brand-600 p-1 text-brand-600" />
          <span className="truncate">{title}</span>
        </span>
      </nav>

      <div className="flex items-center gap-3">
        <Button variant={isBookmarked ? "secondary" : "outline"} size="sm" aria-pressed={isBookmarked} onClick={onToggleBookmark} className="rounded-full">
          {isBookmarked ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
          {isBookmarked ? "Đã lưu câu này" : "Lưu câu này"}
        </Button>
      </div>
    </div>
  );
}
