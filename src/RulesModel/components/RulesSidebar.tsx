import { FaFolderOpen } from "react-icons/fa";

export default function RulesSidebar() {
  return (
    <div className="w-22 h-screen bg-zinc-900/80">
      <div className="flex flex- gap-2">
        <div className="flex items-center gap-2 ">
          <FaFolderOpen className="w-4 h-4" />
          <span>Menu</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FaFolderOpen className="w-4 h-4" />
          <span>Rules</span>
        </div>
        <div className="flex items-center gap-2">
          <FaFolderOpen className="w-4 h-4" />
          <span>Rules</span>
        </div>
        <div className="flex items-center gap-2">
          <FaFolderOpen className="w-4 h-4" />
          <span>Rules</span>
        </div>
      </div>
    </div>
  );
}
