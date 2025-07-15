import { useEffect, useState } from "react";
import { SpTable, SpTableColumn } from "@/layouts/SpTable";
import { File, Download, Trash2, FolderOpen, FileImage, FileVideo, FileArchive, FileText } from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { userStore } from "@/store/userStore";
import { useTheme } from "@/contexts/ThemeContext";
import { ensureNativeBlob } from "@/utils/fileRecentBlob";

interface FileItem {
  id: string;
  name: string;
  metadata?: {
    size?: number;
    lastModified?: string;
    mimetype?: string;
  };
  created_at?: string;
  updated_at?: string;
  type?: string; // For filtering
}

export default function FileExplorerTable() {
  const { theme } = useTheme();
  const { getBucketFiles, getFile, deleteFile } = fileStore();
  const user = userStore((s) => s.user);
  const team = user?.last_name || "";

  const [folders, setFolders] = useState<FileItem[]>([]);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [loading, setLoading] = useState(false);

  const getFileType = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "Image";
    if (["mp4", "avi", "mov", "wmv"].includes(ext)) return "Video";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "Archive";
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return "Document";
    return "File";
  };

  useEffect(() => {
    loadFiles();
  }, [currentPath]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const allItems = await getBucketFiles(currentPath);

      // Separate folders and files
      const folderList: FileItem[] = [];
      const fileList: FileItem[] = [];

      // Group items by potential folders
      const folderMap = new Map<string, boolean>();

      allItems.forEach((item: any) => {
        // Check if this is a folder placeholder or has subfolder structure
        const pathParts = item.name.split("/");

        // If there are multiple parts, the first parts are folders
        if (pathParts.length > 1) {
          const folderName = pathParts[0];
          folderMap.set(folderName, true);
        }

        // If item is in root of current path (no additional slashes)
        if (!item.name.includes("/") || (item.name.endsWith("/") && item.name.split("/").length === 1)) {
          if (item.name.endsWith("/")) {
            // It's a folder placeholder
            folderList.push({
              ...item,
              id: item.id || item.name,
              name: item.name.replace(/\/$/, ""), // Remove trailing slash
            });
          } else {
            // It's a file
            fileList.push({
              ...item,
              id: item.id || item.name,
              type: getFileType(item.name),
            });
          }
        }
      });

      // Add detected folders that aren't already in the list
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

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) return <FileImage className="w-5 h-5 text-blue-500" />;
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) return <FileVideo className="w-5 h-5 text-purple-500" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) return <FileArchive className="w-5 h-5 text-yellow-500" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) return <FileText className="w-5 h-5 text-red-500" />;

    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, index)) * 100) / 100} ${units[index]}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleFolderClick = (folder: FileItem) => {
    setCurrentPath(currentPath ? `${currentPath}/${folder.name}` : folder.name);
  };

  const handleDownloadFile = async (file: FileItem) => {
    try {
      const raw = await getFile(team, file.name);
      const blob = await ensureNativeBlob(raw);
      if (!blob) throw new Error("Failed to convert file to blob");

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      try {
        await deleteFile(team, file.name);
        await loadFiles(); // Refresh the list
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const folderColumns: SpTableColumn<FileItem>[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <div className="flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-yellow-500" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "created_at",
      label: "Created",
      width: "200px",
      render: (value) => formatDate(value),
    },
  ];

  const fileColumns: SpTableColumn<FileItem>[] = [
    {
      key: "name",
      label: "Name",
      render: (value) => (
        <div className="flex items-center gap-3">
          {getFileIcon(value)}
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Type",
      width: "120px",
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs ${theme === "dark" ? "bg-zinc-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
          {getFileType(value)}
        </span>
      ),
    },
    {
      key: "metadata",
      label: "Size",
      width: "120px",
      render: (value) => formatSize(value?.size),
    },
    {
      key: "created_at",
      label: "Modified",
      width: "200px",
      render: (value, row) => formatDate(row.updated_at || value),
    },
  ];

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className={theme === "dark" ? "text-gray-500" : "text-gray-400"}>/</span>
            <button
              onClick={() => setCurrentPath(breadcrumbs.slice(0, index + 1).join("/"))}
              className={`hover:underline ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              {crumb}
            </button>
          </div>
        ))}
      </div>

      {/* Folders Table */}
      {folders.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Folders</h3>
          <SpTable
            data={folders}
            columns={folderColumns}
            loading={loading}
            onRowClick={handleFolderClick}
            emptyState={<div className="text-center py-8 text-gray-500">No folders found</div>}
            className="mb-6"
          />
        </div>
      )}

      {/* Files Table */}
      <div>
        <h3 className={`text-lg font-semibold mb-3 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Files</h3>
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
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadFile(row);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "dark" ? "hover:bg-zinc-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                }`}
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(row);
                }}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
          emptyState={
            <div className="text-center py-8">
              <File className={`w-12 h-12 mx-auto mb-3 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
              <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>{currentPath ? "No files in this folder" : "No files found"}</p>
              <p className={`text-sm mt-1 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>Upload files to see them here</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
