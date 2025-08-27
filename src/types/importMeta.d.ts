// src/types/importMeta.d.ts
interface ImportMetaEnv {
  // Define your expected env variables here
  VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}