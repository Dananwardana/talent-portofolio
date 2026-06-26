import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function VintageField({ label, className, ...rest }: Props) {
  return (
    <label className="block">
      <span className="block font-typewriter text-sm text-maroon mb-1.5">{label}</span>
      <input
        {...rest}
        className={cn(
          "w-full px-4 py-3 rounded-md bg-transparent border-2 border-maroon/70 font-typewriter text-ink placeholder:text-ink/40 outline-none focus:border-maroon focus:ring-2 focus:ring-maroon/30 transition",
          className,
        )}
      />
    </label>
  );
}
