"use client";

import React, { useEffect, useState, useRef } from "react";
import { FieldValues, UseFormRegister, UseFormTrigger, UseFormWatch, FieldErrors, Path } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  id: Path<T>;
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
  const watchedValue = watch(id);
  const prevValue = useRef(watchedValue);
  const errorMessage = errors[id]?.message;
  const errorText = typeof errorMessage === "string" ? errorMessage : " ";
  const { ref, ...rest } = register(id);

  useEffect(() => {
    if (isTouched && watchedValue !== prevValue.current) {
      const validateField = async () => {
        const result = await trigger(id);
        setHasError(!result);
      };
      validateField();
    }
    prevValue.current = watchedValue;
  }, [watchedValue, id, trigger, isTouched]);

  const handleBlur = async () => {
    setIsTouched(true);
    const result = await trigger(id);
    setHasError(!result);

    const inputField = document.getElementById(id) as HTMLInputElement;
    if (inputField) {
      inputField.removeAttribute("required");
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
        {...rest}
        ref={ref}
        className={`sm:text mb-2 w-full rounded-sm border border-slate-300 bg-white px-[10px] py-[6px] text-sm placeholder-slate-400 shadow-[0_35px_60px_-15px_rgba(59,130,246,0.35)] hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-300 sm:px-4 sm:text-base ${
          isTouched && hasError ? "outline-none ring-1 ring-red-50" : ""
        }`}
        aria-required="true"
        onBlur={handleBlur}
      />
      <small className="mb-5 text-sm text-red-50">{isTouched && hasError ? errorText : " "}</small>
    </>
  );
}
