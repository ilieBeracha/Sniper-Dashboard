import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

export default function SpPagination({
  currentPage,
  totalCount,
  LIMIT,
  prevPageWithScroll,
  nextPageWithScroll,
}: {
  currentPage: number;
  totalCount: number;
  LIMIT: number;
  prevPageWithScroll: () => void;
  nextPageWithScroll: () => void;
}) {
  const { theme } = useTheme();
  const hasMore = currentPage < Math.ceil(totalCount / LIMIT);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        Page {currentPage + 1} of {Math.ceil(totalCount / LIMIT)} • Showing {totalCount} of {totalCount}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={prevPageWithScroll}
          disabled={currentPage === 0}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
            currentPage === 0
              ? "opacity-50 cursor-not-allowed"
              : theme === "dark"
                ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={nextPageWithScroll}
          disabled={!hasMore}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
            !hasMore
              ? "opacity-50 cursor-not-allowed"
              : theme === "dark"
                ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
