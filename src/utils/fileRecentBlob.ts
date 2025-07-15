export async function ensureNativeBlob(raw: any): Promise<Blob | null> {
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
}
