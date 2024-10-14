import path from "path";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), eslint({ exclude: ["/virtual:/**", "node_modules/**"] })],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  test: {
    globals: true, // 전역으로 vi, describe, it 등을 사용
    environment: "jsdom", // 브라우저 환경에서의 테스트를 위한 설정
    setupFiles: "./setupTests.ts", // 테스트 초기화 파일
  },
});
