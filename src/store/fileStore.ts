import { create } from "zustand";
import { createFolder, deleteFile, getBucketFiles, getFile, getRecentFiles, uploadFile } from "@/services/fileService";
import { userStore } from "./userStore";

interface FileStore {
  files: any[];
  recentFiles: any[];
  getBucketFiles: (trainingId?: string) => Promise<any>;
  uploadFile: (file: File, trainingId?: string) => Promise<any>;
  getFile: (fileName: string) => Promise<any>;
  createFolder: () => Promise<any>;
  getRecentFiles: () => Promise<any>;
  deleteFile: (fileName: string) => Promise<any>;
  setFiles: (files: any[]) => void;
  setRecentFiles: (recentFiles: any[]) => void;
  setFile: (file: any) => void;
  setRecentFile: (recentFile: any) => void;
}

export const fileStore = create<FileStore>((set, get) => ({
  files: [],
  recentFiles: [],
  setFiles: (files: any[]) => {
    set({ files: files });
  },
  setRecentFiles: (recentFiles: any[]) => {
    set({ recentFiles: recentFiles });
  },
  setFile: (file: any) => {
    set({ files: [...get().files, file] });
  },
  setRecentFile: (recentFile: any) => {
    set({ recentFiles: [...get().recentFiles, recentFile] });
  },

  getBucketFiles: async (trainingId?: string) => {
    const teamId = userStore.getState().user?.team_id || "";
    const files = await getBucketFiles(teamId, trainingId);
    set({ files: files });
    return files;
  },

  getRecentFiles: async () => {
    const teamId = userStore.getState().user?.team_id || "";
    const files = await getRecentFiles(teamId);
    set({ recentFiles: files });
    return files;
  },

  deleteFile: async (fileName: string) => {
    const teamId = userStore.getState().user?.team_id || "";
    const bucket = await deleteFile(teamId, fileName);
    return bucket;
  },

  uploadFile: async (file: File, trainingId?: string) => {
    const teamId = userStore.getState().user?.team_id || "";
    const bucket = await uploadFile(file, teamId, trainingId);
    return bucket;
  },

  getFile: async (fileName: string) => {
    const teamId = userStore.getState().user?.team_id || "";
    const file = await getFile(teamId, fileName);
    return file;
  },

  createFolder: async () => {
    const teamId = userStore.getState().user?.team_id || "";
    const bucket = await createFolder(teamId);
    return bucket;
  },
}));
