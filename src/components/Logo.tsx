/** The mark: a measuring frame with a scale along its top and a steel band. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="5" y="5" width="54" height="54" fill="none" stroke="#8cb8dd" strokeWidth="5" />
      <path d="M15 5v11M25 5v7M35 5v11M45 5v7" stroke="#8cb8dd" strokeWidth="5" fill="none" />
      <rect x="14" y="36" width="36" height="11" fill="#2c5f87" />
      <rect x="14" y="36" width="4" height="11" fill="#f5f5f0" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5 text-bone">
      <LogoMark className="h-6 w-6" />
      <span className="font-display text-[13px] font-medium tracking-[0.18em] uppercase">
        Fit Check
      </span>
      <span className="inline-block h-1.5 w-1.5 bg-signal" aria-hidden="true" />
    </span>
  );
}
