import { useEffect, useState } from "react";
import { Trash2, Folder, ChevronRight } from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { useTheme } from "@/contexts/ThemeContext";
import type { FileItem } from "@/types/file.types";
import { getFileIcon } from "@/utils/fileUtils";
import { formatSize } from "@/utils/formatUtils";
import { downloadFile, deleteFileWithConfirm } from "@/utils/fileOperations";
import React from "react";

export default function FileExplorerTable() {
  const { files, getBucketFiles } = fileStore();
  const { theme } = useTheme();
  const [currentPath, setCurrentPath] = useState("");
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      await getBucketFiles();

      const folderList: FileItem[] = [];
      const fileList: FileItem[] = [];

      // Group files by folders
      const folderMap = new Map<string, number>();

      files.forEach((file) => {
        const relativePath = currentPath ? file.name.substring(currentPath.length + 1) : file.name;
        const pathParts = relativePath.split("/");

        if (pathParts.length > 1 && pathParts[0]) {
          // This is a file in a subfolder
          const folderName = pathParts[0];
          const fullFolderPath = currentPath ? `${currentPath}/${folderName}` : folderName;

          if (!folderMap.has(fullFolderPath)) {
            folderMap.set(fullFolderPath, 0);
          }
          folderMap.set(fullFolderPath, folderMap.get(fullFolderPath)! + 1);
        } else if (relativePath && !relativePath.includes("/")) {
          // This is a file in the current directory
          fileList.push(file);
        }
      });

      // Convert folder map to folder items
      folderMap.forEach((count, folderPath) => {
        const folderName = folderPath.split("/").pop() || folderPath;
        folderList.push({
          id: folderPath,
          name: folderName,
          type: "folder",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          metadata: { itemCount: count },
        } as FileItem);
      });

      // Sort folders and files
      folderList.sort((a, b) => a.name.localeCompare(b.name));
      fileList.sort((a, b) => a.name.localeCompare(b.name));

      setFolders(folderList);
      setFileItems(fileList);
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFolderClick = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const handleFileDownload = async (file: FileItem) => {
    await downloadFile(file.name);
  };

  const handleFileDelete = async (file: FileItem) => {
    const deleted = await deleteFileWithConfirm(file.name);
    if (deleted) {
      await loadFiles();
    }
  };

  const renderBreadcrumb = () => {
    const pathParts = currentPath.split("/").filter(Boolean);

    return (
      <div className="flex items-center gap-2 mb-6">
        {pathParts.length > 0 && (
          <>
            {pathParts.map((part, index) => {
              const pathUpToHere = pathParts.slice(0, index + 1).join("/");
              return (
                <React.Fragment key={pathUpToHere}>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  <button
                    onClick={() => setCurrentPath(pathUpToHere)}
                    className={`px-2 py-1 text-sm rounded-lg transition-colors ${
                      theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-100"
                    } ${index === pathParts.length - 1 ? "font-medium" : ""}`}
                  >
                    {part}
                  </button>
                </React.Fragment>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderTabs = () => {
    return (
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-zinc-700">
        <button
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            theme === "dark" ? "text-white border-indigo-500" : "text-gray-900 border-indigo-600"
          }`}
        >
          View all
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            theme === "dark" ? "text-zinc-400 hover:text-white border-transparent" : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}
        >
          Documents
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            theme === "dark" ? "text-zinc-400 hover:text-white border-transparent" : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}
        >
          Spreadsheets
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            theme === "dark" ? "text-zinc-400 hover:text-white border-transparent" : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}
        >
          PDFs
        </button>
        <button
          className={`px-4 py-2 text-sm transition-colors ${
            theme === "dark" ? "text-zinc-400 hover:text-white border-transparent" : "text-gray-600 hover:text-gray-900 border-transparent"
          }`}
        >
          Images
        </button>
      </div>
    );
  };

  const combinedItems = [...folders, ...fileItems];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderBreadcrumb()}
      {renderTabs()}

      {combinedItems.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
          <Folder className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>
            {currentPath ? "This folder is empty" : "No files or folders yet"}
          </h3>
          <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Upload files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {combinedItems.map((item) => {
            const isFolder = item.type === "folder";

            return (
              <div
                key={item.id}
                onClick={() => (isFolder ? handleFolderClick(item.name) : handleFileDownload(item))}
                className={`group relative p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                  theme === "dark" ? "bg-zinc-900 hover:bg-zinc-800 border-zinc-800" : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-lg ${
                      isFolder ? (theme === "dark" ? "bg-amber-500/10" : "bg-amber-50") : theme === "dark" ? "bg-zinc-800" : "bg-gray-100"
                    }`}
                  >
                    {isFolder ? <Folder className="w-8 h-8 text-amber-500" /> : getFileIcon(item.name, "md")}
                  </div>

                  <div className="w-full">
                    <p className={`text-xs font-medium truncate ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`} title={item.name}>
                      {item.name}
                    </p>
                    {!isFolder && (
                      <p className={`text-xs mt-1 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>{formatSize(item.metadata?.size || 0)}</p>
                    )}
                  </div>
                </div>

                {/* Actions on hover */}
                {!isFolder && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileDelete(item);
                      }}
                      className="p-1 rounded hover:bg-red-500/10 text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
