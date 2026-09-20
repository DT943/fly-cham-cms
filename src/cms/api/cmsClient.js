import axios from 'axios'

/**
 * Base URL for the library-love-cloned CMS (Supabase-backed public API).
 * Override per-environment with `VITE_CMS_API_BASE_URL`; defaults to the
 * local CMS dev server.
 */
export const CMS_API_BASE_URL =
  import.meta.env.VITE_CMS_API_BASE_URL || 'http://localhost:8080'

const cmsClient = axios.create({
  baseURL: CMS_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default cmsClient
