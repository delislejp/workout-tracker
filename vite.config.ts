import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/postcss'

// https://vite.dev/config/
export default defineConfig({
  base: '/workout-tracker/',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
      ],
    },
  },
})
