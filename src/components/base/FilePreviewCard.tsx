import { Card } from "@heroui/react";
import { FileText, FileImage, FileVideo, FileArchive, File, MoreVertical, Download, Trash2 } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useTheme } from "@/contexts/ThemeContext";

interface FileItem {
  id: string;
  name: string;
  type?: string;
  metadata?: { size?: number; lastModified?: string };
  created_at?: string;
}

interface FilePreviewCardProps {
  file: FileItem;
  previewUrl?: string;
  onDownload: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
  onClick?: (file: FileItem) => void;
  isMobile?: boolean;
}

export default function FilePreviewCard({ file, previewUrl, onDownload, onDelete, onClick, isMobile }: FilePreviewCardProps) {
  const { theme } = useTheme();

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) return <FileImage className="w-12 h-12 text-blue-500" />;
    if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) return <FileVideo className="w-12 h-12 text-purple-500" />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) return <FileArchive className="w-12 h-12 text-yellow-500" />;
    if (["pdf", "doc", "docx", "txt"].includes(ext || "")) return <FileText className="w-12 h-12 text-red-500" />;
    return <File className="w-12 h-12 text-gray-500" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "N/A";
    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, index)) * 100) / 100} ${units[index]}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const handleDropdownAction = (key: string) => {
    if (key === "download") {
      onDownload(file);
    } else if (key === "delete" && onDelete) {
      onDelete(file);
    }
  };

  // Mobile layout - horizontal split view
  if (isMobile) {
    const iconSizeClass = "w-16 h-16";
    const isImage = ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(
      file.name.split(".").pop()?.toLowerCase() || ""
    );

    return (
      <Card
        className={`w-full h-44 border-2 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
          theme === "dark" ? "bg-zinc-900/80 border-neutral-700/50" : "bg-white border-gray-200/50"
        }`}
        isPressable
        onPress={() => onClick?.(file)}
      >
        <div className="flex h-full">
          {/* Left half - Image preview or icon */}
          <div className={`w-2/5 relative flex items-center justify-center ${
            previewUrl ? "" : theme === "dark" ? "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50" : "bg-gradient-to-br from-gray-50 to-gray-100"
          }`}>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Image failed to load:", file.name);
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="relative">
                {(() => {
                  const ext = file.name.split(".").pop()?.toLowerCase();
                  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) 
                    return <FileImage className={`${iconSizeClass} text-blue-500/80`} />;
                  if (["mp4", "avi", "mov", "wmv"].includes(ext || "")) 
                    return <FileVideo className={`${iconSizeClass} text-purple-500/80`} />;
                  if (["zip", "rar", "7z", "tar", "gz"].includes(ext || "")) 
                    return <FileArchive className={`${iconSizeClass} text-yellow-500/80`} />;
                  if (["pdf", "doc", "docx", "txt"].includes(ext || "")) 
                    return <FileText className={`${iconSizeClass} text-red-500/80`} />;
                  return <File className={`${iconSizeClass} text-gray-500/80`} />;
                })()}
                <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  theme === "dark" ? "bg-zinc-800 text-gray-300" : "bg-gray-200 text-gray-700"
                }`}>
                  {file.name.split(".").pop()?.toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Right half - File info */}
        <div className="w-3/5 py-5 pr-5 flex flex-col justify-between overflow-hidden">
  <div className="flex flex-col overflow-hidden gap-2">
    <h4
      className={`font-semibold text-base truncate text-left ${
        theme === "dark" ? "text-white" : "text-gray-900"
      }`}
      title={file.name}
    >
      {file.name}
    </h4>
    <p
      className={`text-sm text-left font-medium ${
        theme === "dark" ? "text-gray-300" : "text-gray-600"
      }`}
    >
      {formatSize(file.metadata?.size)}
    </p>
    <p
      className={`text-sm text-left ${
        theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {formatDate(file.created_at || file.metadata?.lastModified)}
    </p>
  </div>

            <div className="flex items-center justify-between gap-3 mt-3">
              <div className={`text-xs px-2 py-1 rounded-full ${
                isImage 
                  ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20" 
                  : "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20"
              }`}>
                {file.name.split(".").pop()?.toUpperCase() || "FILE"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(file);
                  }}
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    theme === "dark" 
                      ? "hover:bg-zinc-700/50 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  aria-label="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(file);
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all transform hover:scale-110"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Desktop layout - original vertical card
  return (
    <Card
      className={`relative h-48 border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all cursor-pointer ${
        theme === "dark" ? "bg-zinc-900/50 border-neutral-700/70" : "bg-white border-gray-200"
      }`}
      isPressable
      onPress={() => onClick?.(file)}
    >
      {/* Background preview for images */}
      {previewUrl && (
        <img
          src={previewUrl}
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0"
          onError={(e) => {
            console.error("Image failed to load:", file.name);
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          {getFileIcon(file.name)}
          <Dropdown>
            <DropdownTrigger className="cursor-pointer">
              <span className="min-w-unit-8 h-unit-8 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MoreVertical className="w-4 h-4" />
              </span>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="File actions" 
              className={theme === "dark" ? "bg-zinc-900/50" : "bg-white"}
              onAction={(key) => handleDropdownAction(key as string)}
            >
              <DropdownItem
                key="download"
                startContent={<Download className="w-4 h-4" />}
              >
                Download
              </DropdownItem>
           {onDelete ? (
  <DropdownItem 
    key="delete" 
    className="text-red-500" 
    color="danger" 
    startContent={<Trash2 className="w-4 h-4" />}
  >
    Delete
  </DropdownItem>
) : null}

            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="space-y-1">
          <h4 className={`font-medium text-sm truncate drop-shadow-sm ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}>
            {file.name}
          </h4>
          <p className={`text-xs drop-shadow-sm ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}>
            {formatSize(file.metadata?.size)}
          </p>
          <p className={`text-xs drop-shadow-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}>
            {formatDate(file.created_at || file.metadata?.lastModified)}
          </p>
        </div>
      </div>
    </Card>
  );
}