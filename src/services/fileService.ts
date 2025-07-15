import { supabase } from "./supabaseClient";
import { APP_CONFIG } from "@/config/constants";

export async function getBucketFiles(
  teamName: string,
  trainingId?: string,
  filters: { limit: number; sortBy: { column: string; order: string } } = {
    limit: APP_CONFIG.STORAGE.LIST_LIMIT,
    sortBy: { column: "name", order: "asc" },
  },
): Promise<any[]> {
  const { data, error } = await supabase.storage
    .from(APP_CONFIG.STORAGE.BUCKET_NAME)
    .list(buildRequestPath(teamName, trainingId), { limit: filters.limit, sortBy: filters.sortBy });

  if (error) {
    throw error;
  }

  return data;
}

export async function getRecentFiles(teamName: string) {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).list(buildRequestPath(teamName), {
    limit: APP_CONFIG.STORAGE.RECENT_FILES_LIMIT,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFile(teamName: string, fileName: string) {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).remove([buildRequestPath(teamName) + "/" + fileName]);

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
