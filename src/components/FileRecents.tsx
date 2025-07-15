import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@heroui/react";
import { FileText, FileImage, FileVideo, FileArchive, File, MoreVertical, Download, Trash2 } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface FileItem {
  id: string;
  name: string;
  type?: string;
  metadata?: {
    size?: number;
    lastModified?: string;
  };
  created_at?: string;
}

export default function FileRecents({ recentFiles }: { recentFiles: FileItem[] }) {
  const { theme } = useTheme();

  const downloadFile = (file: FileItem) => {
    const link = document.createElement("a");
    link.href = file.created_at || "https://www.google.com";
    link.download = file.name;
    link.click();
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
      return <FileImage className="w-12 h-12 text-blue-500" />;
    } else if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) {
      return <FileVideo className="w-12 h-12 text-purple-500" />;
    } else if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) {
      return <FileArchive className="w-12 h-12 text-yellow-500" />;
    } else if (["pdf", "doc", "docx", "txt"].includes(ext || "")) {
      return <FileText className="w-12 h-12 text-red-500" />;
    }
    return <File className="w-12 h-12 text-gray-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center  justify-between">Recent Files</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {recentFiles.map((file) => (
          <Card
            key={file.id}
            className={`${
              theme === "dark" ? "bg-zinc-900/50 border-neutral-700/70" : "bg-white border-gray-200"
            } border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer`}
            isPressable
          >
            <div className="p-2">
              <div className="flex items-start justify-between mb-3">
                {getFileIcon(file.name)}
                <Dropdown>
                  <DropdownTrigger>
                    <span className="min-w-unit-8 h-unit-8">
                      <MoreVertical className="w-4 h-4" />
                    </span>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="File actions" className={`${theme === "dark" ? "bg-zinc-900/50" : "bg-white"}`}>
                    <DropdownItem key="download" startContent={<Download className="w-4 h-4" />} onClick={() => downloadFile(file)}>
                      Download
                    </DropdownItem>
                    <DropdownItem key="delete" className="text-red-500" color="danger" startContent={<Trash2 className="w-4 h-4" />}>
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>

              <div className="space-y-1 flex flex-col items-start justify-start">
                <h4 className={`font-medium text-sm truncate ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{file.name}</h4>
                <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{formatFileSize(file.metadata?.size)}</p>
                <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}>
                  {formatDate(file.created_at || file.metadata?.lastModified)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
