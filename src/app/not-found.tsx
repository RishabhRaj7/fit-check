import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-[1440px] flex-col justify-center px-4 md:px-8">
      <p className="kicker text-fog">Error 404 · out of range</p>
      <h1 className="mt-6 font-display text-[clamp(4rem,16vw,12rem)] leading-[0.9] font-extralight tracking-[-0.04em] text-bone tabular">
        404<span className="text-frost">.</span>0
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-bone/65">
        This page isn&apos;t on any chart we hold — like a UK 17.
      </p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/" className="kicker flex h-12 items-center bg-signal px-6 text-bone transition-colors hover:bg-bone hover:text-ink">
          Back to start
        </Link>
        <Link href="/#categories" className="kicker flex h-12 items-center border border-bone/20 px-6 text-bone transition-colors hover:border-bone/60">
          Browse brands
        </Link>
      </div>
    </section>
  );
}
