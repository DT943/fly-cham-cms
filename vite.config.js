import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const resolvePath = (relative) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `src/vendor/flycham` mirrors flychamwebsite's `src/`, so its files keep
      // their original `@/...` imports and can be re-copied without edits.
      '@': resolvePath('./src/vendor/flycham'),
      // Next.js modules the vendored booking box still imports.
      'next/navigation': resolvePath('./src/vendor/shims/next-navigation.jsx'),
      // Node builtin pulled in by the vendored axios client.
      https: resolvePath('./src/vendor/shims/node-https.js'),
    },
  },
  define: {
    // The vendored files read Next.js-style `process.env.NEXT_PUBLIC_*`.
    // Must be https: the live site is served over https, so the browser blocks
    // http API calls as mixed content (the booking widget's routes/schedules).
    'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify('https://flycham.com/api'),
    'process.env.NEXT_PUBLIC_IBE_API_BASE_URL': JSON.stringify(''),
    'process.env.NEXT_PUBLIC_SEARCH_TOKEN_SECRET': JSON.stringify(''),
    'process.env.NEXT_PUBLIC_ANALYTICS_BYPASS_CONSENT': JSON.stringify('false'),
    'process.env.NEXT_PUBLIC_MANAGE_BOOKING_DEBUG': JSON.stringify(''),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
