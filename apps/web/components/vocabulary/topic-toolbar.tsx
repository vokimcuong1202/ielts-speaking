export function TopicToolbar() {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="cursor-pointer rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-ink-400 hover:bg-page"
      >
        Tìm chủ đề
      </button>
      <button
        type="button"
        className="cursor-pointer rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-semibold text-ink-700 hover:bg-page"
      >
        Hay ra kỳ này
      </button>
    </div>
  );
}
