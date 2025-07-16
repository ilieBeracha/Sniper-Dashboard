import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const cardsPerView = 1; // Show 1 card at a time on mobile for better sizing
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
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      // Reset to start when reaching the end
      return nextIndex >= totalSlides ? 0 : nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      // Go to last slide when at the beginning
      return prev === 0 ? totalSlides - 1 : prev - 1;
    });
  };

  if (recentFiles.length === 0) {
    return (
      <div className="space-y-4 w-full">
        <div className="text-center py-8 text-gray-500">No recent files</div>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <h2 className="text-lg font-semibold">Recent Files</h2>
      {isMobile ? (
        <div className="relative w-full">
          <div className="overflow-hidden w-full py-4">
            <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0 px-4">
                  <div className="aspect-[16/10] max-w-md mx-auto">
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
                className={`absolute left-2 top-[45%] -translate-y-[45%] p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 ${
                  theme === "dark"
                    ? "bg-zinc-800/70 hover:bg-zinc-700/80 text-white border border-zinc-600/30"
                    : "bg-white/80 hover:bg-white/90 text-gray-800 border border-gray-200/50"
                }`}
                aria-label="Previous file"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className={`absolute right-2 top-[45%] -translate-y-[45%] p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 ${
                  theme === "dark"
                    ? "bg-zinc-800/70 hover:bg-zinc-700/80 text-white border border-zinc-600/30"
                    : "bg-white/80 hover:bg-white/90 text-gray-800 border border-gray-200/50"
                }`}
                aria-label="Next file"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? (theme === "dark" ? "bg-white w-6" : "bg-gray-800 w-6") : theme === "dark" ? "bg-white/30" : "bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
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
