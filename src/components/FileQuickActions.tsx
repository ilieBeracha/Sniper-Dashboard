import { useTheme } from "@/contexts/ThemeContext";
import { FileText, Plus, FolderPlus, FileSpreadsheet } from "lucide-react";

const FileQuickActions = ({ onUploadClick, onNewFolderClick }: { onUploadClick: () => void; onNewFolderClick: () => void }) => {
  const { theme } = useTheme();

  const quickActions = [
    {
      id: "new-doc",
      title: "New document",
      icon: <FileText className="w-6 h-6" />,
      onClick: onUploadClick,
    },
    {
      id: "new-spreadsheet",
      title: "New spreadsheet",
      icon: <FileSpreadsheet className="w-6 h-6" />,
      onClick: onUploadClick,
    },
    {
      id: "new-folder",
      title: "New folder",
      icon: <FolderPlus className="w-6 h-6" />,
      onClick: onNewFolderClick,
    },
  ];

  return (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>All files</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`group relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all hover:scale-105 ${
              theme === "dark"
                ? "bg-zinc-900/50 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50"
                : "bg-gray-50/50 border-gray-300 hover:border-gray-400 hover:bg-gray-100/50"
            }`}
          >
            <div className={`mb-3 p-3 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-white"}`}>
              <div className={theme === "dark" ? "text-zinc-400" : "text-gray-600"}>{action.icon}</div>
            </div>
            <span className={`text-sm font-medium ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>{action.title}</span>

            {/* Plus icon in corner */}
            <div
              className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center ${
                theme === "dark" ? "bg-zinc-700" : "bg-gray-200"
              }`}
            >
              <Plus className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FileQuickActions;
