import { Card } from "@heroui/react";
import { MoreVertical, Download, Trash2 } from "lucide-react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useTheme } from "@/contexts/ThemeContext";
import type { FileItem } from "@/types/file.types";
import { getFileIcon, getFileExtension, isImageFile } from "@/utils/fileUtils";
import { formatSize, formatDate } from "@/utils/formatUtils";

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

  const handleDropdownAction = (key: string) => {
    if (key === "download") {
      onDownload(file);
    } else if (key === "delete" && onDelete) {
      onDelete(file);
    }
  };

  // Mobile layout - horizontal split view
  if (isMobile) {
    const isImage = isImageFile(file.name);

    return (
      <Card
        className={`w-full h-full border-2 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
          theme === "dark" ? "bg-zinc-900/80 border-neutral-700/50" : "bg-white border-gray-200/50"
        }`}
        isPressable
        onPress={() => onClick?.(file)}
      >
        <div className="flex h-full">
          <div className="absolute top-0 left-0 w-full h-full  flex items-center justify-center"> </div>
          {/* Left half - Image preview or icon */}
          <div
            className={`w-1/2 relative flex items-center justify-center ${
              previewUrl ? "bg-gray-100 dark:bg-zinc-800" : theme === "dark" ? "bg-gradient-to-br from-zinc-800/50 to-zinc-900/50" : "bg-gradient-to-br from-gray-50 to-gray-100"
            }`}
          >
            {previewUrl ? (
              <div className="w-full h-full flex items-center justify-center p-2">
                <img
                  src={previewUrl}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    console.error("Image failed to load:", file.name);
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="relative">
                {getFileIcon(file.name, "lg")}
                <div
                  className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    theme === "dark" ? "bg-zinc-800 text-gray-300" : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {getFileExtension(file.name).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Right half - File info */}
          <div className="w-1/2 py-4 px-4 flex flex-col justify-between overflow-hidden min-w-0">
            <div className="flex flex-col overflow-hidden gap-1 min-w-0">
              <h4 className={`font-semibold text-sm truncate text-left ${theme === "dark" ? "text-white" : "text-gray-900"}`} title={file.name}>
                <span className="block truncate">{file.name}</span>
              </h4>
              <p className={`text-xs text-left font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                {formatSize(file.metadata?.size)}
              </p>
              <p className={`text-xs text-left ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {formatDate(file.created_at || file.metadata?.lastModified)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-2">
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  isImage ? "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20" : "bg-gray-500/10 text-gray-500 dark:bg-gray-500/20"
                }`}
              >
                {getFileExtension(file.name).toUpperCase() || "FILE"}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    onDownload(file);
                    e.stopPropagation();
                  }}
                  className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                    theme === "dark" ? "hover:bg-zinc-700/50 text-gray-300" : "hover:bg-gray-100 text-gray-700"
                  }`}
                  aria-label="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      onDelete(file);
                      e.stopPropagation();
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all transform hover:scale-110"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
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
          className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none z-0"
          onError={(e) => {
            console.error("Image failed to load:", file.name);
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-start justify-between">
          {getFileIcon(file.name, "lg")}
          <Dropdown>
            <DropdownTrigger className="cursor-pointer">
              <span className="min-w-unit-8 p-2 h-unit-8 rounded-lg bg-black/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <MoreVertical className="w-4 h-4" />
              </span>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="File actions"
              className={`${theme === "dark" ? "bg-zinc-900" : "bg-white"} rounded-lg p-1`}
              onAction={(key) => handleDropdownAction(key as string)}
            >
              <DropdownItem key="download" className="text-sm" startContent={<Download className="w-4 h-4" />}>
                Download
              </DropdownItem>
              <DropdownItem key="delete" className="text-sm text-red-500" color="danger" startContent={<Trash2 className="w-4 h-4" />}>
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="space-y-1 min-w-0 z-10 backdrop-blur-sm">
          <h4 className={`font-medium text-sm truncate drop-shadow-sm ${theme === "dark" ? "text-white" : "text-gray-900"}`} title={file.name}>
            <span className="block truncate">{file.name}</span>
          </h4>
          <p className={`text-xs drop-shadow-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>{formatSize(file.metadata?.size)}</p>
          <p className={`text-xs drop-shadow-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {formatDate(file.created_at || file.metadata?.lastModified)}
          </p>
        </div>
      </div>
    </Card>
  );
}
