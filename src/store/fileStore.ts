import { create } from "zustand";
import { createFolder, deleteFile, getBucketFiles, getFile, getRecentFiles, uploadFile } from "@/services/fileService";
import { userStore } from "./userStore";

interface FileStore {
  files: any[];
  recentFiles: any[];
  getBucketFiles: (trainingId?: string) => Promise<any>;
  uploadFile: (file: File, trainingId?: string) => Promise<void>;
  getFile: (bucketName: string, fileName: string) => Promise<any>;
  createFolder: (teamName: string) => Promise<void>;
  getRecentFiles: () => Promise<any>;
  deleteFile: (teamName: string, fileName: string) => Promise<void>;
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
    const teamName = userStore.getState().user?.last_name || "";
    const files = await getBucketFiles(teamName, trainingId);
    set({ files: files });
    return files;
  },

  getRecentFiles: async () => {
    const teamName = userStore.getState().user?.last_name || "";
    const files = await getRecentFiles(teamName);
    set({ recentFiles: files });
    return files;
  },

  deleteFile: async (teamName: string, fileName: string) => {
    const bucket = await deleteFile(teamName, fileName);
    console.log(bucket);
  },

  uploadFile: async (file: File, trainingId?: string) => {
    const teamName = userStore.getState().user?.last_name || "";
    const bucket = await uploadFile(file, teamName, trainingId);
    console.log(bucket);
  },

  getFile: async (teamName: string, fileName: string) => {
    const file = await getFile(teamName, fileName);
    console.log(file);
    return file;
  },

  createFolder: async (teamName: string) => {
    const bucket = await createFolder(teamName);
    console.log(bucket);
  },
}));
