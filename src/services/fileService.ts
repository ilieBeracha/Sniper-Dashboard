import { supabase } from "./supabaseClient";
import { APP_CONFIG } from "@/config/constants";

export async function getBucketFiles(
  teamId: string,
  trainingId?: string,
  filters: { limit: number; sortBy: { column: string; order: string } } = {
    limit: APP_CONFIG.STORAGE.LIST_LIMIT,
    sortBy: { column: "name", order: "asc" },
  },
): Promise<any[]> {
  const { data, error } = await supabase.storage
    .from(APP_CONFIG.STORAGE.BUCKET_NAME)
    .list(buildRequestPath(teamId, trainingId), { limit: filters.limit, sortBy: filters.sortBy });
  if (error) {
    throw error;
  }
  return data;
}

export async function getRecentFiles(teamId: string) {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).list(buildRequestPath(teamId), {
    limit: APP_CONFIG.STORAGE.RECENT_FILES_LIMIT,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteFile(teamId: string, fileName: string) {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).remove([buildRequestPath(teamId) + "/" + fileName]);

  if (error) {
    throw error;
  }

  return data;
}

export async function getFile(teamId: string, fileName: string): Promise<any> {
  const { data, error } = await supabase.storage.from(APP_CONFIG.STORAGE.BUCKET_NAME).download(buildRequestPath(teamId) + "/" + fileName);

  if (error) {
    throw error;
  }

  return data;
}

export async function uploadFile(file: File, teamId: string, trainingId?: string) {
  const { data, error } = await supabase.storage
    .from(APP_CONFIG.STORAGE.BUCKET_NAME)
    .upload(buildRequestPath(teamId, trainingId) + "/" + file.name, file, { upsert: true });

  if (error) {
    throw error;
  }

  return data;
}

export async function createFolder(teamId: string) {
  const { data, error } = await supabase.storage.updateBucket(teamId, { public: true });

  if (error) {
    throw error;
  }

  return data;
}

function buildRequestPath(teamId: string, trainingId?: string) {
  if (trainingId) {
    return teamId + "/" + trainingId;
  }

  return teamId;
}
