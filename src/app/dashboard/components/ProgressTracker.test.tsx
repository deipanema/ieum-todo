import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ProgressTracker from "./ProgressTracker";

describe("ProgressTracker 컴포넌트 테스트", () => {
  it("렌더링 확인", () => {
    const setprogressValue = vi.fn();
    render(<ProgressTracker ratio={70} progressValue={50} setProgressValue={setprogressValue} />);

    const progressText = screen.getByText("내 진행 상황");

    expect(progressText).toBeInTheDocument();
  });
});
