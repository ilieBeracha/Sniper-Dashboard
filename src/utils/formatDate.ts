export const formatDate = (dateStr?: string, isMobile: boolean = false) => {
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
