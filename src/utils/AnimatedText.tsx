"use client";

import React, { useRef } from "react";
import anime from "animejs";

type AnimatedTextProps = {
  text: string; // 텍스트는 문자열로 정의
  handleLogout: () => void; // 로그아웃 함수는 매개변수가 없고 리턴 값도 없는 함수
};

// 애니메이션 컴포넌트 정의
const AnimatedText = ({ text, handleLogout }: AnimatedTextProps) => {
  const textRef = useRef<HTMLButtonElement>(null); // 버튼 요소를 참조하기 위한 useRef 사용

  // 마우스가 버튼에 들어왔을 때 애니메이션 시작
  const handleMouseEnter = () => {
    anime({
      targets: textRef.current, // 버튼의 텍스트 요소에 애니메이션 적용
      color: [
        { value: "#FF5733" }, // 주황색
        { value: "#33FF57" }, // 초록색
        { value: "#3357FF" }, // 파란색
      ],
      loop: true, // 애니메이션 반복
      duration: 1000,
      easing: "linear",
    });
  };

  // 마우스가 버튼에서 나갈 때 애니메이션 정지
  const handleMouseLeave = () => {
    anime.remove(textRef.current); // 애니메이션을 중지
    if (textRef.current) {
      textRef.current.style.color = ""; // 원래 색상으로 복원
    }
  };

  return (
    <button
      className="text-3 text-slate-400 hover:underline"
      ref={textRef}
      onClick={handleLogout}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </button>
  );
};

export default AnimatedText;
