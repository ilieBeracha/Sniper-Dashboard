import { fileStore } from "@/store/fileStore";

export const ensureNativeBlob = async (raw: any): Promise<Blob | null> => {
  if (!raw) return null;

  while (raw && typeof raw === "object" && "data" in raw) raw = raw.data;

  if (raw instanceof Response) raw = await raw.blob();

  if (raw instanceof Blob) return raw;

  if (raw && typeof raw.size === "number" && typeof raw.type === "string") {
    try {
      return new Blob([raw as BlobPart], { type: raw.type });
    } catch {
      // fall through
    }
  }

  if (raw instanceof ArrayBuffer || ArrayBuffer.isView(raw)) {
    return new Blob([raw as unknown as ArrayBuffer]);
  }

  return null;
};

export const downloadFile = async (fileName: string): Promise<void> => {
  try {
    const { getFile } = fileStore.getState();
    const raw = await getFile(fileName);
    const blob = await ensureNativeBlob(raw);

    if (!blob) throw new Error("Failed to convert file to blob");

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Download failed:", err);
    throw err;
  }
};

export const deleteFileWithConfirm = async (fileName: string): Promise<boolean> => {
  if (confirm(`Are you sure you want to delete ${fileName}?`)) {
    try {
      const { deleteFile } = fileStore.getState();
      await deleteFile(fileName);
      return true;
    } catch (err) {
      console.error("Delete failed:", err);
      return false;
    }
  }
  return false;
};
