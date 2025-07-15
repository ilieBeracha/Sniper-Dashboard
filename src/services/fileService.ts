import { supabase } from "./supabaseClient";
import { APP_CONFIG } from "@/config/constants";

export async function getBucketFiles(teamName: string, trainingId?: string): Promise<any[]> {
  const { data, error } = await supabase.storage
    .from(APP_CONFIG.STORAGE.BUCKET_NAME)
    .list(buildRequestPath(teamName, trainingId), { limit: APP_CONFIG.STORAGE.LIST_LIMIT, sortBy: { column: "name", order: "asc" } });

  if (error) {
    throw error;
  }

  return data;
}

export async function getFile(teamName: string, fileName: string): Promise<any> {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).download(buildRequestPath(teamName) + "/" + fileName);

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadFile(file: File, teamName: string, trainingId?: string) {
  const { data, error } = await supabase.storage
    .from(APP_CONFIG.STORAGE.BUCKET_NAME)
    .upload(buildRequestPath(teamName, trainingId) + "/" + file.name, file, { upsert: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function createFolder(teamName: string) {
  const { data, error } = await supabase.storage.updateBucket(teamName, { public: true });

  if (error) {
    throw error;
  }

  return data;
}

function buildRequestPath(teamName: string, trainingId?: string) {
  if (trainingId) {
    return teamName + "/" + trainingId;
  }

  return teamName;
}
