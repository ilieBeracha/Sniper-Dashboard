export const APP_CONFIG = {
  STORAGE: {
    BUCKET_NAME: "teams",
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: [".pdf", ".doc", ".docx", ".txt", ".jpg", ".jpeg", ".png"],
    LIST_LIMIT: 100,
  },

  ENV: {
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
