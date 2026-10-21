import axios from 'axios'

/**
 * Base URL for the library-love-cloned CMS (Supabase-backed public API).
 * Override per-environment with `VITE_CMS_API_BASE_URL`; defaults to the
 * deployed CMS public API.
 */
export const CMS_API_BASE_URL =
  import.meta.env.VITE_CMS_API_BASE_URL ||
  'https://cms-api.cms-flycham.alpatrose.com'

const cmsClient = axios.create({
  baseURL: CMS_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default cmsClient
