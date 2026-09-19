export function PageHeader() {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Thi thử</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl">Thi thử &amp; lịch sử kết quả</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Nhận điểm sát thi thật, rồi mở lại từng bài để nghe và sửa lỗi.
        </p>
      </div>
    </div>
  );
}
