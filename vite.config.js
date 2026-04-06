const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react-swc");
const path = require("path");

module.exports = defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});

