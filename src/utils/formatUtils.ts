export const formatSize = (bytes?: number): string => {
  if (!bytes) return "—";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = Math.round((bytes / Math.pow(1024, index)) * 10) / 10;
  return `${value} ${units[index]}`;
};

export const formatDate = (dateStr?: string, isMobile?: boolean): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);

  if (isMobile) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
