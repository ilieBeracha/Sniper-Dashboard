import { fileStore } from "@/store/fileStore";
import { useTheme } from "@/contexts/ThemeContext";
import { FileText, Download, Clock, Trash2, ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import type { FileItem } from "@/types/file.types";
import { downloadFile, ensureNativeBlob, deleteFileWithConfirm } from "@/utils/fileOperations";
import { formatDate, formatSize } from "@/utils/formatUtils";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { isImageFile, getFileIcon } from "@/utils/fileUtils";

const FileRecents = () => {
  const { theme } = useTheme();
  const { recentFiles, getFile, deleteFile, getRecentFiles } = fileStore();
  const isMobile = useIsMobile(640);

  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = isMobile ? 1 : 4;
  const [urlsToCleanup, setUrlsToCleanup] = useState<string[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getPreviewUrl = async (file: FileItem) => {
    const blob = await ensureNativeBlob(await getFile(file.name));
    if (!blob) throw new Error("not a blob");
    return URL.createObjectURL(blob);
  };

  useEffect(() => {
    let isMounted = true;

    const loadPreviews = async () => {
      const newUrls: Record<string, string> = {};

      await Promise.all(
        recentFiles
          .filter((f) => isImageFile(f.name))
          .map(async (f) => {
            try {
              newUrls[f.id] = await getPreviewUrl(f);
              setUrlsToCleanup((prev) => [...prev, newUrls[f.id]]);
            } catch (err) {
              console.warn("Preview load failed for", f.name, err);
            }
          }),
      );

      if (isMounted) {
        setPreviewUrls(newUrls);
      }
    };

    loadPreviews();

    return () => {
      isMounted = false;
      urlsToCleanup.forEach((url: string) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      });
    };
  }, [recentFiles, getFile]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.name);
  };

  const handleDeleteFile = async (file: FileItem) => {
    const deleted = await deleteFileWithConfirm(file.name);
    if (deleted) {
      await getRecentFiles();
    }
  };

  const totalSlides = Math.ceil(recentFiles.length / cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= totalSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  if (recentFiles.length === 0) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
              <Clock className="w-4 h-4 text-indigo-500" />
            </div>
            <h2 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Recent Files</h2>
          </div>
        </div>
        <div className={`text-center py-12 rounded-xl border-2 border-dashed ${theme === "dark" ? "border-zinc-800" : "border-gray-200"}`}>
          <FileText className={`w-10 h-10 mx-auto mb-3 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
          <p className={`text-sm ${theme === "dark" ? "text-zinc-400" : "text-gray-600"}`}>No recent files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${theme === "dark" ? "bg-zinc-800" : "bg-gray-100"}`}>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <h2 className={`text-lg font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Recent Files</h2>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${theme === "dark" ? "bg-zinc-800 text-zinc-300" : "bg-gray-100 text-gray-700"}`}
        >
          {recentFiles.length} files
        </span>
      </div>

      <div className="relative">
        {isMobile ? (
          // Mobile carousel view
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {recentFiles.map((file) => (
                <div key={file.id} className="w-full flex-shrink-0 px-2">
                  <RecentFileCard
                    file={file}
                    previewUrl={previewUrls[file.id]}
                    onDownload={handleDownload}
                    onDelete={handleDeleteFile}
                    theme={theme}
                    hoveredCard={hoveredCard}
                    setHoveredCard={setHoveredCard}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Desktop grid view
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recentFiles.slice(0, 10).map((file) => (
              <RecentFileCard
                key={file.id}
                file={file}
                previewUrl={previewUrls[file.id]}
                onDownload={handleDownload}
                onDelete={handleDeleteFile}
                theme={theme}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
              />
            ))}
          </div>
        )}

        {/* Navigation for mobile */}
        {isMobile && recentFiles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all ${
                theme === "dark" ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-white text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full shadow-lg transition-all ${
                theme === "dark" ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-white text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center mt-4 gap-1">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex
                      ? `w-6 ${theme === "dark" ? "bg-indigo-500" : "bg-indigo-600"}`
                      : `w-1.5 ${theme === "dark" ? "bg-zinc-700" : "bg-gray-300"}`
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Separate component for file card
function RecentFileCard({
  file,
  previewUrl,
  onDownload,
  onDelete,
  theme,
  hoveredCard,
  setHoveredCard,
}: {
  file: FileItem;
  previewUrl?: string;
  onDownload: (file: FileItem) => void;
  onDelete: (file: FileItem) => void;
  theme: string;
  hoveredCard: string | null;
  setHoveredCard: (id: string | null) => void;
}) {
  const isImage = isImageFile(file.name);

  return (
    <div
      className={`group relative rounded-xl overflow-hidden transition-all cursor-pointer ${
        theme === "dark" ? "bg-zinc-900 hover:bg-zinc-800" : "bg-white hover:bg-gray-50"
      } border ${theme === "dark" ? "border-zinc-800" : "border-gray-200"} ${hoveredCard === file.id ? "scale-105 shadow-xl" : ""}`}
      onMouseEnter={() => setHoveredCard(file.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Preview Area */}
      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">{getFileIcon(file.name, "lg")}</div>
        )}

        {/* Overlay with actions */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(file);
              }}
              className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg hover:bg-white dark:hover:bg-zinc-700 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(file);
              }}
              className="p-2 bg-white/90 dark:bg-zinc-800/90 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="p-4">
        <h4 className={`font-medium truncate mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{file.name}</h4>
        <div className={`flex items-center justify-between text-xs ${theme === "dark" ? "text-zinc-500" : "text-gray-500"}`}>
          <span>{formatSize(file.metadata?.size || 0)}</span>
          <span>{formatDate(file.created_at || "", true)}</span>
        </div>
      </div>
    </div>
  );
}

export default FileRecents;
