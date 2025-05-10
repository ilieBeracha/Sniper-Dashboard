export default function TrainingsHeader({
  setIsOpen,
  kanbanView,
  setKanbanView,
}: {
  setIsOpen: (open: boolean) => void;
  kanbanView: boolean;
  setKanbanView: (view: boolean) => void;
}) {
  return (
    <div className=" mb-8 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex space-x-4 w-full justify-between items-center">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
        >
          Create Training
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setKanbanView(false)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 shadow ${
            !kanbanView ? "bg-indigo-600 text-white" : "bg-[#23232b] text-gray-300 hover:bg-indigo-700"
          }`}
        >
          List View
        </button>
        <button
          onClick={() => setKanbanView(true)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 shadow ${
            kanbanView ? "bg-indigo-600 text-white" : "bg-[#23232b] text-gray-300 hover:bg-indigo-700"
          }`}
        >
          Kanban Board
        </button>
      </div>
    </div>
  );
}
