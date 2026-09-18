export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
          S
        </span>
      </div>
      <p className="text-sm text-ink-400">Đang tải…</p>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <LoadingIndicator />
    </div>
  );
}
