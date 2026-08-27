"use client";

import type { FocusEvent, Ref } from "react";

import {
  BRAZIL_PHONE_PLACEHOLDER,
  formatBrazilianPhone,
} from "@/lib/form/formatters";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (formatted: string) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
  className?: string;
  inputClassName?: string;
  inputRef?: Ref<HTMLInputElement>;
};

export function PhoneInput({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = BRAZIL_PHONE_PLACEHOLDER,
  disabled,
  autoComplete = "tel-national",
  autoFocus,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
  className,
  inputClassName,
  inputRef,
}: PhoneInputProps) {
  return (
    <div className={cn("flex min-w-0 items-stretch overflow-hidden", className)}>
      <span
        className="flex h-full shrink-0 items-center bg-[#1a1a1a] px-2.5 text-white"
        title="Código do país já selecionado"
        aria-hidden
      >
        <span className="flex flex-col items-center justify-center leading-none">
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65">
            Brasil
          </span>
          <span className="mt-0.5 text-[15px] font-bold tabular-nums">+55</span>
        </span>
      </span>
      <span className="sr-only">
        Código do país Brasil, mais 55, já selecionado
      </span>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        maxLength={15}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        onChange={(event) => onChange(formatBrazilianPhone(event.target.value))}
        onBlur={onBlur}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] outline-none disabled:opacity-60",
          inputClassName,
        )}
      />
    </div>
  );
}
