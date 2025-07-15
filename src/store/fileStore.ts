import { create } from "zustand";
import { createFolder, getBucketFiles, getFile, uploadFile } from "@/services/fileService";
import { userStore } from "./userStore";

interface FileStore {
  getBucketFiles: (trainingId?: string) => Promise<any>;
  uploadFile: (file: File, trainingId?: string) => Promise<void>;
  getFile: (bucketName: string, fileName: string) => Promise<void>;
  createFolder: (teamName: string) => Promise<void>;
}

export const fileStore = create<FileStore>(() => ({
  getBucketFiles: async (trainingId?: string) => {
    const teamName = userStore.getState().user?.last_name || "";
    const files = await getBucketFiles(teamName, trainingId);
    return files;
  },

  uploadFile: async (file: File, trainingId?: string) => {
    const teamName = userStore.getState().user?.last_name || "";
    const bucket = await uploadFile(file, teamName, trainingId);
    console.log(bucket);
  },

  getFile: async (teamName: string, fileName: string) => {
    const file = await getFile(teamName, fileName);
    console.log(file);
  },

  createFolder: async (teamName: string) => {
    const bucket = await createFolder(teamName);
    console.log(bucket);
  },
}));
