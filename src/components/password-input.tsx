import { useState } from "react";

export function PasswordInput({
  value,
  onChange,
  autoComplete,
  placeholder,
  maxLength,
}: {
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="w-full rounded-xl bg-surface/80 py-3 pr-12 pl-4 text-[14px] ring-1 ring-line outline-none focus:ring-2 focus:ring-sungold"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 font-mono text-[11px] font-semibold text-muted-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
