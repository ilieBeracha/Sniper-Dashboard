import { useEffect, useState } from "react";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import { File, Download, Trash2, FolderOpen } from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { FileItem } from "@/types/file.types";
import { getFileType, getFileIcon } from "@/utils/fileUtils";
import { formatDate, formatSize } from "@/utils/formatUtils";
import { downloadFile, deleteFileWithConfirm } from "@/utils/fileOperations";

export default function FileExplorerTable() {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { getBucketFiles } = fileStore();

  const [folders, setFolders] = useState<FileItem[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const allItems = await getBucketFiles(currentPath);

      const folderList: FileItem[] = [];
      const fileList: FileItem[] = [];

      const folderMap = new Map<string, boolean>();

      allItems.forEach((item: any) => {
        const pathParts = item.name.split("/");

        if (pathParts.length > 1) {
          const folderName = pathParts[0];
          folderMap.set(folderName, true);
        }

        if (!item.name.includes("/") || (item.name.endsWith("/") && item.name.split("/").length === 1)) {
          if (item.name.endsWith("/")) {
            folderList.push({
              ...item,
              id: item.id || item.name,
              name: item.name.replace(/\/$/, ""),
            });
          } else {
            fileList.push({
              ...item,
              id: item.id || item.name,
              type: getFileType(item.name),
            });
          }
        }
      });

      // Add detected folders to the list
      folderMap.forEach((_, folderName) => {
        if (!folderList.some((f) => f.name === folderName)) {
          folderList.push({
            id: folderName,
            name: folderName,
            created_at: new Date().toISOString(),
          });
        }
      });

      setFolders(folderList.sort((a, b) => a.name.localeCompare(b.name)));
      setFileItems(fileList.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error loading files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folder: FileItem) => {
    setCurrentPath(currentPath ? `${currentPath}/${folder.name}` : folder.name);
  };

  const handleDownloadFile = async (file: FileItem) => {
    await downloadFile(file.name);
  };

  const handleDeleteFile = async (file: FileItem) => {
    const deleted = await deleteFileWithConfirm(file.name);
    if (deleted) {
      await loadFiles();
    }
  };

  const folderColumns: SpTableColumn<FileItem>[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
          <span className="font-medium truncate block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "200px",
      hideOnMobile: true,
      render: (value) => formatDate(value, isMobile),
    },
  ];

  const fileColumns: SpTableColumn<FileItem>[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex-shrink-0">{getFileIcon(value, "sm")}</div>
          <span className="truncate block" title={value}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Type",
      width: "120px",
      hideOnMobile: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
          {getFileType(value)}
        </span>
      ),
    },
    {
      key: "metadata",
      label: "Size",
      width: "100px",
      render: (value) => <span className="text-xs sm:text-sm">{formatSize(value?.size)}</span>,
    },
    {
      key: "created_at",
      label: "Modified",
      width: "200px",
      hideOnMobile: true,
      render: (value, row) => formatDate(row.updated_at || value, isMobile),
    },
  ];

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="space-y-4 sm:space-y-6">
      {(currentPath || breadcrumbs.length > 0) && (
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto pb-2 px-3 sm:px-4 py-2 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
          <button
            onClick={() => setCurrentPath("")}
            className={`hover:underline flex-shrink-0 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
          >
            <FolderOpen className="w-4 h-4 inline mr-1" />
            Root
          </button>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/</span>
              <button
                onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join("/"))}
                className={`hover:underline truncate max-w-[100px] sm:max-w-none ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                {crumb}
              </button>
            </div>
          ))}
        </div>
      )}

      {folders.length > 0 && (
        <div>
          <SpTable
            data={folders}
            columns={folderColumns}
            loading={loading}
            onRowClick={handleFolderClick}
            emptyState={<div className="text-center py-8 text-gray-500">No folders found</div>}
            className="mb-4 sm:mb-6"
          />
        </div>
      )}

      <div>
        <SpTable
          data={fileItems}
          columns={fileColumns}
          loading={loading}
          searchPlaceholder="Search files..."
          searchFields={["name"]}
          filters={[
            {
              key: "type",
              label: "File Type",
              type: "select",
              options: [
                { value: "Image", label: "Images" },
                { value: "Video", label: "Videos" },
                { value: "Document", label: "Documents" },
                { value: "Archive", label: "Archives" },
                { value: "File", label: "Other" },
              ],
            },
          ]}
          actions={(row) => (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFile(row);
                }}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-zinc-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Download"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(row);
                }}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          )}
          emptyState={
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800 mb-4">
                <File className={`w-8 h-8 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
              </div>
              <p className={`text-base font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {currentPath ? "No files in this folder" : "No files found"}
              </p>
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Upload files to see them here</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
