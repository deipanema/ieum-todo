import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  plugins: [react(), eslint({ exclude: ["/virtual:/**", "node_modules/**"] })],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
  test: {
    globals: true, // 전역으로 vi, describe, it 등을 사용
    environment: "jsdom", // 브라우저 환경에서의 테스트를 위한 설정
    setupFiles: "./src/setupTests.ts", // 테스트 초기화 파일
    include: ["**/*.test.tsx"], // 포함할 파일 패턴을 명시
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage", // 리포트 디렉토리
      reporter: ["text", "lcov"], // lcov 형식으로 리포트 생성
    },
  },
});
