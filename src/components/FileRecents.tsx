import { fileStore } from "@/store/fileStore";
import { useTheme } from "@/contexts/ThemeContext";
import { FileText, Download, Clock, Trash2 } from "lucide-react";
import type { FileItem } from "@/types/file.types";
import { downloadFile, deleteFileWithConfirm } from "@/utils/fileOperations";
import { formatDate, formatSize } from "@/utils/formatUtils";
import { getFileIcon } from "@/utils/fileUtils";

const FileRecents = () => {
  const { theme } = useTheme();
  const { recentFiles, getRecentFiles } = fileStore();

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.name);
  };

  const handleDeleteFile = async (file: FileItem) => {
    const deleted = await deleteFileWithConfirm(file.name);
    if (deleted) {
      await getRecentFiles();
    }
  };

  if (recentFiles.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-lg font-medium">Recent Files</h2>
        </div>
        <div className={`text-center py-8 rounded-lg border-2 border-dashed ${theme === "dark" ? "border-gray-700" : "border-gray-200"}`}>
          <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500">No recent files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h2 className="text-lg font-medium">Recent Files</h2>
        </div>
        <span className="text-xs text-gray-500">{recentFiles.length} files</span>
      </div>

      <div className={`rounded-lg border ${theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-white"}`}>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentFiles.slice(0, 5).map((file) => (
            <div key={file.id} className={`flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0">{getFileIcon(file.name, "sm")}</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(file.metadata?.size || 0)} • {formatDate(file.created_at || "")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteFile(file)}
                  className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileRecents;
