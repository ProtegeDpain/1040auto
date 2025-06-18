export default function AddTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded bg-[#1b9bd8] px-4 py-2 font-medium text-white transition hover:bg-[#1b8bd8] focus:outline-none focus:ring-2 focus:ring-[#1b9bd8] focus:ring-offset-2"
      aria-label="Add New Task"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add New Task
    </button>
  );
}
