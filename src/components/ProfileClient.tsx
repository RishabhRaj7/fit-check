"use client";

import { useState } from "react";
import Link from "next/link";
import AnchorInput, { type Anchor } from "@/components/AnchorInput";
import SizePassport from "@/components/SizePassport";
import {
  CATEGORY_ORDER,
  CATEGORIES,
  GENDERS,
  formatCm,
  type CategoryId,
} from "@/lib/categories";
import { isUserCancelled } from "@/lib/firebase/clientAuth";
import { cn } from "@/lib/format";
import {
  entryKey,
  removeEntry,
  saveEntry,
  setGender,
  signIn,
  signOut,
  useProfile,
} from "@/lib/profile";
import type { CategoryCharts, LiteBrand } from "@/lib/sizing";

function SyncPanel() {
  const { user, syncAvailable, ready } = useProfile();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (!ready) return <div className="h-24 border border-bone/12" aria-busy="true" />;

  return (
    <div className="flex flex-col justify-between gap-5 border border-bone/12 p-5 md:flex-row md:items-center md:p-6">
      <div className="flex items-start gap-4">
        <span
          className={cn("mt-1.5 inline-block h-2 w-2 shrink-0", user ? "bg-signal" : "border border-bone/40")}
          aria-hidden="true"
        />
        <div>
          <p className="text-base text-bone">
            {user ? `Synced to ${user.email ?? "your Google account"}` : "Kept on this device only"}
          </p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-fog">
            {user
              ? "Your sizes follow you to any device you sign in on. Only you can read them."
              : syncAvailable
                ? "Sign in with Google to keep your sizes on every device. Anything saved here moves over automatically."
                : "Clearing your browser data clears these sizes."}
          </p>
          {error && <p className="mt-2 text-sm text-frost">{error}</p>}
        </div>
      </div>
      {syncAvailable && (
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await (user ? signOut() : signIn());
            } catch (e) {
              if (!isUserCancelled(e)) setError("Sign-in didn't complete. Please try again.");
            } finally {
              setBusy(false);
            }
          }}
          className={cn(
            "kicker flex h-11 shrink-0 items-center justify-center px-5 transition-colors disabled:opacity-40",
            user ? "border border-bone/20 text-fog hover:text-bone" : "bg-signal text-bone hover:bg-bone hover:text-ink"
          )}
        >
          {busy ? "One moment…" : user ? "Sign out" : "Sign in with Google"}
        </button>
      )}
    </div>
  );
}

export default function ProfileClient({
  charts,
  brands,
}: {
  charts: Record<CategoryId, CategoryCharts>;
  brands: Record<CategoryId, LiteBrand[]>;
}) {
  const { profile, gender, ready } = useProfile();
  const [editing, setEditing] = useState<CategoryId | null>(null);
  const [draft, setDraft] = useState<Anchor | null>(null);

  const otherGender = gender === "men" ? "women" : "men";
  const otherCount = CATEGORY_ORDER.filter((c) => profile[entryKey(c, otherGender)]).length;

  const startEdit = (c: CategoryId) => {
    setEditing(c);
    setDraft(profile[entryKey(c, gender)] ?? null);
  };

  const commit = async (c: CategoryId) => {
    if (!draft) return;
    await saveEntry(c, gender, { ...draft, confidence: "exact" });
    setEditing(null);
    setDraft(null);
  };

  return (
    <div className="space-y-10">
      <SyncPanel />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex border border-bone/15" role="group" aria-label="Sizes for">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              aria-pressed={gender === g.id}
              onClick={() => {
                setGender(g.id);
                setEditing(null);
              }}
              className={cn(
                "kicker px-4 py-2 transition-colors",
                gender === g.id ? "bg-bone text-ink" : "text-fog hover:text-bone"
              )}
            >
              {g.label}
            </button>
          ))}
        </div>
        {otherCount > 0 && (
          <p className="kicker text-fog">
            {otherCount} saved under {otherGender}
          </p>
        )}
      </div>

      <div className="border-t border-bone/12">
        {CATEGORY_ORDER.map((c, i) => {
          const def = CATEGORIES[c];
          const entry = profile[entryKey(c, gender)];
          const isEditing = editing === c;
          return (
            <section key={c} aria-labelledby={`cat-${c}`} className="border-b border-bone/12 py-8 md:py-10">
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-4">
                  <p className="kicker text-fog">
                    <span className="text-frost">0{i + 1}</span> — {def.anchor}
                  </p>
                  <h2 id={`cat-${c}`} className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-bone">
                    {def.label}
                  </h2>
                  {!ready ? (
                    <div className="mt-4 h-12 w-40 bg-coal" aria-busy="true" />
                  ) : entry ? (
                    <>
                      <p className="mt-4 font-display text-5xl font-light tabular text-bone">
                        {formatCm(entry.anchorValue)}
                        <span className="ml-2 font-mono text-sm text-fog">cm</span>
                      </p>
                      <p className="kicker mt-2 text-fog">
                        {entry.sourceBrandSlug === "measured"
                          ? "Measured"
                          : `Via ${entry.sourceBrandName ?? entry.sourceBrandSlug} ${entry.sourceSizeLabel}`}
                        {" · "}
                        {new Date(entry.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-fog">Not set yet.</p>
                  )}
                  {ready && !isEditing && (
                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => startEdit(c)}
                        className={cn(
                          "kicker flex h-9 items-center px-4 transition-colors",
                          entry ? "border border-bone/20 text-bone hover:border-bone/60" : "bg-signal text-bone hover:bg-bone hover:text-ink"
                        )}
                      >
                        {entry ? "Change" : "Set my size"}
                      </button>
                      {entry && (
                        <button
                          onClick={() => void removeEntry(entryKey(c, gender))}
                          className="kicker flex h-9 items-center px-3 text-fog transition-colors hover:text-bone"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="md:col-span-8">
                  {isEditing ? (
                    <div className="border border-bone/12 bg-coal p-5 md:p-6">
                      <AnchorInput
                        category={c}
                        gender={gender}
                        brands={brands[c]}
                        charts={charts[c]}
                        value={draft}
                        onChange={setDraft}
                      />
                      <div className="mt-6 flex gap-2">
                        <button
                          disabled={!draft}
                          onClick={() => void commit(c)}
                          className="kicker flex h-10 items-center bg-signal px-5 text-bone transition-colors hover:bg-bone hover:text-ink disabled:opacity-30"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="kicker flex h-10 items-center px-4 text-fog transition-colors hover:text-bone"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : entry ? (
                    <SizePassport
                      category={c}
                      gender={gender}
                      anchor={entry.anchorValue}
                      brands={brands[c]}
                      charts={charts[c]}
                    />
                  ) : (
                    <div className="flex h-full min-h-32 items-center border border-dashed border-bone/12 p-6">
                      <p className="max-w-md text-sm leading-relaxed text-fog">
                        Set your {def.anchor.toLowerCase()} once and you&apos;ll see your size in all{" "}
                        {brands[c].length} {def.label.toLowerCase()} brands here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-sm text-fog">
        New here?{" "}
        <Link href="/onboarding" className="text-bone underline underline-offset-4 hover:text-frost">
          The 30-second setup
        </Link>{" "}
        covers sneakers, tops and trousers in one go.
      </p>
    </div>
  );
}
