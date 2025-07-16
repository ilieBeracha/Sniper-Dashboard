export interface FileItem {
  id: string;
  name: string;
  type?: string;
  metadata?: {
    size?: number;
    lastModified?: string;
    mimetype?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface FileMetadata {
  size?: number;
  lastModified?: string;
  mimetype?: string;
}