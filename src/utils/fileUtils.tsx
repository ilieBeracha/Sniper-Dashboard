import { File, FileArchive, FileImage, FileText, FileVideo } from "lucide-react";

export const getFileType = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return "Image";
  if (["mp4", "avi", "mov", "wmv"].includes(ext)) return "Video";
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "Archive";
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return "Document";
  return "File";
};

export const getFileExtension = (name: string): string => {
  return name.split(".").pop()?.toLowerCase() || "";
};

export const isImageFile = (name: string): boolean => {
  const ext = getFileExtension(name);
  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext);
};

export const getFileIcon = (name: string, size: "sm" | "md" | "lg" = "md") => {
  const ext = getFileExtension(name);
  const sizeClasses = {
    sm: "w-4 h-4 sm:w-5 sm:h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };
  const iconClass = sizeClasses[size];

  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)) return <FileImage className={`${iconClass} text-blue-500`} />;
  if (["mp4", "avi", "mov", "wmv"].includes(ext)) return <FileVideo className={`${iconClass} text-purple-500`} />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return <FileArchive className={`${iconClass} text-yellow-500`} />;
  if (["pdf", "doc", "docx", "txt"].includes(ext)) return <FileText className={`${iconClass} text-red-500`} />;

  return <File className={`${iconClass} text-gray-500`} />;
};
