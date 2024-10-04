"use client";

import React, { useEffect, useState, useRef } from "react";
import { FieldValues, UseFormRegister, UseFormTrigger, UseFormWatch, FieldErrors, Path } from "react-hook-form";

// Props에 대해 제네릭을 사용하여 다양한 폼 데이터 타입을 지원합니다.
interface InputFieldProps<T extends FieldValues> {
  id: Path<T>; // id는 Path<T> 타입이어야 합니다.
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  trigger: UseFormTrigger<T>;
  watch: UseFormWatch<T>;
}

export default function InputField<T extends FieldValues>({
  id,
  label,
  type,
  placeholder,
  register,
  errors,
  trigger,
  watch,
}: InputFieldProps<T>) {
  const [hasError, setHasError] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const watchedValue = watch(id); // id는 Path<T> 타입이므로 올바르게 작동합니다.
  const prevValue = useRef(watchedValue);
  const error = errors[id];
  const errorText = error && typeof error.message === "string" ? error.message : " ";
  const { ref, ...rest } = register(id); // register에서 id를 기반으로 ref와 나머지 속성을 가져옵니다.

  // 필드 값이 변경될 때마다 유효성 검사를 수행합니다.
  useEffect(() => {
    if (isTouched && watchedValue !== prevValue.current) {
      const validateField = async () => {
        const result = await trigger(id); // trigger를 사용하여 유효성 검사합니다.
        setHasError(!result); // 결과에 따라 오류 상태를 설정합니다.
      };
      validateField();
    }
    prevValue.current = watchedValue; // 이전 값을 현재 값으로 업데이트합니다.
  }, [watchedValue, id, trigger, isTouched]);

  // 입력 필드에서 포커스가 벗어날 때 유효성 검사를 수행합니다.
  const handleBlur = async () => {
    setIsTouched(true);
    const result = await trigger(id); // trigger를 사용하여 유효성 검사합니다.
    setHasError(!result); // 결과에 따라 오류 상태를 설정합니다.

    const inputField = document.getElementById(id) as HTMLInputElement;
    if (inputField) {
      inputField.removeAttribute("required"); // 입력 필드에서 required 속성을 제거합니다.
    }
  };

  return (
    <>
      <label htmlFor={id} className="py-2 text-xs font-bold sm:text-base">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        {...rest} // register로 받은 나머지 속성(onChange, onBlur, name 등)들을 전달합니다.
        ref={ref} // react-hook-form이 내부적으로 폼 요소에 접근할 수 있게 연결해 줍니다.
        className={`mb-2 w-full rounded-sm border border-slate-300 bg-white px-[10px] py-[6px] text-sm placeholder-slate-400 shadow-[0_35px_60px_-15px_rgba(59,130,246,0.35)] hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-300 sm:px-4 sm:text-base ${
          isTouched && hasError ? "outline-none ring-1 ring-red-50" : ""
        }`}
        aria-required="true"
        onBlur={handleBlur} // 입력 필드에서 포커스가 벗어날 때 handleBlur를 호출합니다.
      />
      <small className="mb-5 text-sm text-red-50">{errorText}</small>
    </>
  );
}
