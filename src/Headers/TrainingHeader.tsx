import Header from "@/Headers/Header";

export default function TrainingHeader({ kanbanView, setKanbanView }: { kanbanView: boolean; setKanbanView: (view: boolean) => void }) {
  return (
    <div className=" mb-2 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <Header>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setKanbanView(false)}
            className={`px-2 py-1 rounded-lg text-sm font-medium transition-colors border border-white/10 shadow ${
              !kanbanView ? "bg-indigo-600 text-white" : "bg-[#23232b] text-gray-300 hover:bg-indigo-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setKanbanView(true)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10 shadow ${
              kanbanView ? "bg-indigo-600 text-white" : "bg-[#23232b] text-gray-300 hover:bg-indigo-700"
            }`}
          >
            Board
          </button>
        </div>
      </Header>
    </div>
  );
}
