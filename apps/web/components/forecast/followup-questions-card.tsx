export function FollowUpQuestionsCard({ questions }: { questions: string[] }) {
  return (
    <div className="rounded-xl bg-page p-4">
      <h4 className="text-sm font-bold text-ink-900">Part 3 nối tiếp đề này</h4>
      <ul className="mt-2 flex flex-col gap-1.5">
        {questions.map((question, index) => (
          <li key={index} className="text-sm text-ink-600">
            {question}
          </li>
        ))}
      </ul>
    </div>
  );
}
