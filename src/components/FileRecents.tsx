import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight, FileText, Clock } from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { ensureNativeBlob, downloadFile } from "@/utils/fileOperations";
import FilePreviewCard from "@/components/base/FilePreviewCard";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { FileItem } from "@/types/file.types";
import { isImageFile } from "@/utils/fileUtils";

export default function FileRecents() {
  const { theme } = useTheme();
  const { getFile, deleteFile, recentFiles, getRecentFiles } = fileStore();

  const isMobile = useIsMobile(640);

  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 1;
  const [urlsToCleanup, setUrlsToCleanup] = useState<string[]>([]);

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
        console.log("Setting preview URLs:", Object.keys(newUrls).length, "images");
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
    const deleted = await deleteFile(file.name);
    if (deleted) {
      await getRecentFiles();
    }
  };

  const handleFileClick = (file: FileItem) => {
    console.log("File clicked:", file.name);
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
        <div className="flex items-center gap-2 mb-3">
          <Clock className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
          <h2 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Recent Files</h2>
        </div>
        <div className={`text-center py-8 rounded-lg border border-dashed ${theme === "dark" ? "border-zinc-700" : "border-gray-300"}`}>
          <FileText className={`w-8 h-8 mx-auto mb-2 ${theme === "dark" ? "text-zinc-600" : "text-gray-400"}`} />
          <p className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>No recent files</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`} />
          <h2 className={`text-sm font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Recent Files</h2>
        </div>
        <span className={`text-xs ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>{recentFiles.length}</span>
      </div>
      {isMobile ? (
        <div className="relative w-full">
          <div className="overflow-hidden w-full">
            <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="h-32">
                    {recentFiles.slice(slideIndex * cardsPerView, (slideIndex + 1) * cardsPerView).map((file) => (
                      <FilePreviewCard
                        key={file.id}
                        file={file}
                        previewUrl={previewUrls[file.id]}
                        onDownload={handleDownload}
                        onDelete={handleDeleteFile}
                        onClick={handleFileClick}
                        isMobile={true}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {recentFiles.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`absolute left-1 top-[50%] -translate-y-[50%] p-1.5 rounded-full shadow-sm transition-all ${
                  theme === "dark" ? "bg-zinc-800/80 text-gray-400 hover:text-white" : "bg-white/80 text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Previous file"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-1 top-[50%] -translate-y-[50%] p-1.5 rounded-full shadow-sm transition-all ${
                  theme === "dark" ? "bg-zinc-800/80 text-gray-400 hover:text-white" : "bg-white/80 text-gray-600 hover:text-gray-900"
                }`}
                aria-label="Next file"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="flex justify-center mt-3 gap-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex
                    ? `w-4 ${theme === "dark" ? "bg-white" : "bg-gray-800"}`
                    : `w-1 ${theme === "dark" ? "bg-zinc-600" : "bg-gray-300"}`
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
          {recentFiles.map((file) => (
            <FilePreviewCard
              key={file.id}
              file={file}
              previewUrl={previewUrls[file.id]}
              onDownload={handleDownload}
              onDelete={handleDeleteFile}
              onClick={handleFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
