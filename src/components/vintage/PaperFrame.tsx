import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PaperFrameProps {
  children: ReactNode;
  className?: string;
  withPin?: boolean;
  withCorners?: boolean;
}

function CornerOrnament() {
  // Decorative vintage corner flourish
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 24C2 11.85 11.85 2 24 2M2 14C2 7.37 7.37 2 14 2M8 24C8 15.16 15.16 8 24 8"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M4 4L18 4M4 4L4 18M10 6C7.79 6 6 7.79 6 10"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6" r="1.2" fill="currentColor" />
      <path
        d="M14 2C14 4.5 12 4.5 12 7M20 2C20 6 16 6 16 10M2 14C4.5 14 4.5 12 7 12M2 20C6 20 6 16 10 16"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PaperFrame({ children, className, withPin, withCorners = true }: PaperFrameProps) {
  return (
    <div className={cn("ornate-frame ornate-corners p-8 sm:p-12", className)}>
      {withCorners && (
        <>
          <span className="corner tl"><CornerOrnament /></span>
          <span className="corner tr"><CornerOrnament /></span>
          <span className="corner bl"><CornerOrnament /></span>
          <span className="corner br"><CornerOrnament /></span>
        </>
      )}
      {withPin && (
        <span className="red-pin absolute -top-2 right-8 z-10" aria-hidden />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

export function DoilyNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative paper-surface p-6 text-center", className)}
      style={{
        clipPath:
          "polygon(0% 8%, 4% 4%, 8% 0%, 92% 0%, 96% 4%, 100% 8%, 100% 92%, 96% 96%, 92% 100%, 8% 100%, 4% 96%, 0% 92%)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <span className="red-pin absolute -top-2 left-1/2 -translate-x-1/2" aria-hidden />
      {children}
    </div>
  );
}

export function PinnedCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative paper-surface rounded-lg px-5 py-4 shadow-[var(--shadow-paper)]", className)}>
      <span className="red-pin absolute -top-2 left-1/2 -translate-x-1/2" aria-hidden />
      {children}
    </div>
  );
}
