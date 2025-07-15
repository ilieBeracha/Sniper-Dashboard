import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fileStore } from "@/store/fileStore";
import { userStore } from "@/store/userStore";
import { ensureNativeBlob } from "@/utils/fileRecentBlob";
import FilePreviewCard from "@/components/base/FilePreviewCard";
import { useIsMobile } from "@/hooks/useIsMobile";

interface FileItem {
  id: string;
  name: string;
  type?: string;
  metadata?: { size?: number; lastModified?: string };
  created_at?: string;
}

export default function FileRecents({ recentFiles }: { recentFiles: FileItem[] }) {
  const { theme } = useTheme();
  const { getFile, deleteFile } = fileStore();
  const user = userStore((s) => s.user);
  const team = user?.last_name || "";
  const isMobile = useIsMobile(640);

  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({}); 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const urlsToCleanup: string[] = [];

    const loadPreviews = async () => {
      const imgLike = (f: FileItem) => ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(f.name.split(".").pop()?.toLowerCase() || "");
      const newUrls: Record<string, string> = {};

      await Promise.all(
        recentFiles.filter(imgLike).map(async (f) => {
          try {
            const blob = await ensureNativeBlob(await getFile(team, f.name));
            if (!blob) throw new Error("not a blob");

            let url: string;
            try {
              url = URL.createObjectURL(blob);
            } catch {
              url = await new Promise<string>((res, rej) => {
                const r = new FileReader();
                r.onload = () => res(r.result as string);
                r.onerror = rej;
                r.readAsDataURL(blob);
              });
            }
            newUrls[f.id] = url;
            urlsToCleanup.push(url);
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
      urlsToCleanup.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {}
      });
    };
  }, [recentFiles, team, getFile]); /* eslint-disable-line react-hooks/exhaustive-deps */

  const downloadFile = async (file: FileItem) => {
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
    try {
      await deleteFile(team, file.name);
      // Refresh the file list or handle the deletion in the parent component
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleFileClick = (file: FileItem) => {
    // Handle file click - could open a preview modal or details view
    console.log("File clicked:", file.name);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recentFiles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + recentFiles.length) % recentFiles.length);
  };


  if (recentFiles.length === 0) {
    return (
      <div className="space-y-4 w-full">
        <h2 className="text-lg font-semibold">Recent Files</h2>
        <div className="text-center py-8 text-gray-500">
          No recent files
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-lg font-semibold">Recent Files</h2>

      {isMobile ? (
        // Mobile carousel view
        <div className="relative w-full">
          <div className="overflow-hidden w-full">
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {recentFiles.map((file) => (
                <div key={file.id} className="w-full flex-shrink-0">
                  <div className="mx-4">
                    <FilePreviewCard
                      file={file}
                      previewUrl={previewUrls[file.id]}
                      onDownload={downloadFile}
                      onDelete={handleDeleteFile}
                      onClick={handleFileClick}
                      isMobile={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          {recentFiles.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className={`absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 ${
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
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full shadow-lg backdrop-blur-sm transition-all transform hover:scale-110 ${
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

          {/* Dots indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {recentFiles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 h-2 rounded-full " + (theme === "dark" ? "bg-white" : "bg-gray-800")
                    : "w-2 h-2 rounded-full " + (theme === "dark" ? "bg-white/30 hover:bg-white/50" : "bg-gray-400 hover:bg-gray-600")
                }`}
                aria-label={`Go to file ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        // Desktop grid view
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {recentFiles.map((file) => (
            <FilePreviewCard
              key={file.id}
              file={file}
              previewUrl={previewUrls[file.id]}
              onDownload={downloadFile}
              onDelete={handleDeleteFile}
              onClick={handleFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
