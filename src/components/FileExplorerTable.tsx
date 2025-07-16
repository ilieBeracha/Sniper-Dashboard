import { useEffect, useState } from "react";
import {
  Download,
  Trash2,
  Folder,
  ChevronRight,
  Home,
  FileArchive,
} from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { useTheme } from "@/contexts/ThemeContext";
import type { FileItem } from "@/types/file.types";
import { getFileType, getFileIcon } from "@/utils/fileUtils";
import { formatSize } from "@/utils/formatUtils";
import { downloadFile, deleteFileWithConfirm } from "@/utils/fileOperations";
import React from "react";

type FileExplorerTableProps = {
  searchQuery?: string;
  viewMode?: "grid" | "list";
};

const FileExplorerTable: React.FC<FileExplorerTableProps> = ({ searchQuery = "", viewMode = "list" }) => {
  const { files, getBucketFiles, deleteFile } = fileStore();
  const { theme } = useTheme();
  const [currentPath, setCurrentPath] = useState("");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [folders, setFolders] = useState<FileItem[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setIsLoading(true);
    setIsNavigating(false);
    try {
      await getBucketFiles();

      const folderList: FileItem[] = [];
      const fileList: FileItem[] = [];

      // Group files by folders
      const folderMap = new Map<string, number>();

      files.forEach((file) => {
        const relativePath = currentPath ? file.name.substring(currentPath.length + 1) : file.name;
        const pathParts = relativePath.split("/");

        if (pathParts.length > 1) {
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
    setIsNavigating(true);
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;

    // Add a small delay for smooth transition
    setTimeout(() => {
      setCurrentPath(newPath);
      setSelectedItems(new Set());
    }, 150);
  };

  const combinedItems = [...folders, ...fileItems];

  const renderBreadcrumb = () => {
    const pathParts = currentPath.split("/").filter(Boolean);

    return (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl ${theme === "dark" ? "bg-zinc-900/50" : "bg-gray-50"} transition-all duration-300`}
      >
        <button
          onClick={() => {
            setIsNavigating(true);
            setTimeout(() => setCurrentPath(""), 150);
          }}
          className={`p-2 rounded-lg transition-all duration-200 ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-200"} hover:scale-105`}
        >
          <Home className="w-4 h-4" />
        </button>

        {pathParts.length > 0 && (
          <>
            {pathParts.map((part, index) => {
              const pathUpToHere = pathParts.slice(0, index + 1).join("/");
              return (
                <React.Fragment key={pathUpToHere}>
                  <ChevronRight className={`w-4 h-4 mx-1 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"} animate-pulse`} />
                  <button
                    onClick={() => {
                      setIsNavigating(true);
                      setTimeout(() => setCurrentPath(pathUpToHere), 150);
                    }}
                    className={`px-3 py-1 rounded-lg transition-all duration-200 ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-gray-200"} hover:scale-105 ${
                      index === pathParts.length - 1 ? "font-semibold" : ""
                    }`}
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

  const formatFileName = (name: string) => {
    const parts = name.split("/");
    return parts[parts.length - 1];
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

  const filteredItems = combinedItems.filter((item) => {
    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (viewMode === "grid") {
    return (
      <div className="space-y-4">
        {renderBreadcrumb()}

        {isLoading || isNavigating ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} animate-fade-in`}
          >
            <Folder className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
            <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>
              {currentPath ? "This folder is empty" : "No files or folders"}
            </h3>
            <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Upload files or create folders to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                className={`group cursor-pointer rounded-xl p-4 transition-all duration-300 ${
                  theme === "dark" ? "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800" : "bg-white hover:bg-gray-50 border border-gray-200"
                } hover:scale-105 hover:shadow-lg animate-slide-up`}
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => (item.type === "folder" ? handleFolderClick(item.name) : handleFileDownload(item))}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  {item.type === "folder" ? (
                    <div
                      className={`p-3 rounded-xl ${theme === "dark" ? "bg-amber-500/10" : "bg-amber-50"} transition-all duration-300 group-hover:scale-110`}
                    >
                      <Folder className="h-8 w-8 text-amber-500" />
                    </div>
                  ) : (
                    <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"} transition-all duration-300`}>
                      {getFileIcon(item.name, "md")}
                    </div>
                  )}
                  <div className="w-full">
                    <p className={`text-sm font-medium truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{formatFileName(item.name)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderBreadcrumb()}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
          <Folder className={`w-12 h-12 mx-auto mb-4 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
          <h3 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"} mb-2`}>
            {currentPath ? "This folder is empty" : "No files or folders"}
          </h3>
          <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>Upload files or create folders to get started</p>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"}`}>
          {/* Table Header */}
          <div
            className={`grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium border-b ${
              theme === "dark" ? "bg-zinc-800/50 border-zinc-700 text-zinc-400" : "bg-gray-50 border-gray-200 text-gray-600"
            }`}
          >
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedItems.size === filteredItems.length && filteredItems.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(new Set(filteredItems.map((item) => item.id)));
                  } else {
                    setSelectedItems(new Set());
                  }
                }}
                className="rounded"
              />
            </div>
            <div className="col-span-5 sm:col-span-6">Name</div>
            <div className="col-span-2 hidden sm:block">Type</div>
            <div className="col-span-2 text-right">Size</div>
            <div className="col-span-2 sm:col-span-1 text-right">Actions</div>
          </div>

          {/* Items */}
          <div className="divide-y divide-zinc-800 dark:divide-zinc-700">
            {filteredItems.map((item) => {
              const isFolder = item.type === "folder";

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 items-center transition-colors cursor-pointer ${
                    selectedItems.has(item.id)
                      ? theme === "dark"
                        ? "bg-indigo-500/10"
                        : "bg-indigo-50"
                      : theme === "dark"
                        ? "hover:bg-zinc-800/50"
                        : "hover:bg-gray-50"
                  }`}
                  onClick={() => (isFolder ? handleFolderClick(item.name) : undefined)}
                >
                  {/* Checkbox */}
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSelected = new Set(selectedItems);
                        if (e.target.checked) {
                          newSelected.add(item.id);
                        } else {
                          newSelected.delete(item.id);
                        }
                        setSelectedItems(newSelected);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded"
                    />
                  </div>

                  {/* Name */}
                  <div className="col-span-5 sm:col-span-6 flex items-center gap-3">
                    {isFolder ? (
                      <Folder className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    ) : (
                      <div className="flex-shrink-0">{getFileIcon(item.name, "sm")}</div>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-span-2 hidden sm:flex items-center gap-2">
                    <span className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                      {isFolder ? "Folder" : getFileType(item.name)}
                    </span>
                  </div>

                  {/* Size */}
                  <div className="col-span-2 text-right">
                    <span className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>
                      {isFolder ? "—" : formatSize(item.metadata?.size || 0) || "0 bytes" }
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 sm:col-span-1 flex justify-end">
                    {!isFolder && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFileDownload(item);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            theme === "dark"
                              ? "hover:bg-zinc-700 text-zinc-400 hover:text-white"
                              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                          }`}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this file?")) {
                              handleFileDelete(item);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Items Actions */}
      {selectedItems.size > 0 && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg ${
            theme === "dark" ? "bg-zinc-800" : "bg-white"
          } border ${theme === "dark" ? "border-zinc-700" : "border-gray-200"}`}
        >
          <div className="flex items-center gap-4">
            <span className={`text-sm ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>{selectedItems.size} selected</span>
            <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm">Download</button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileExplorerTable;
