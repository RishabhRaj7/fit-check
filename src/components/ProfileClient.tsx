"use client";

import { useState } from "react";
import Link from "next/link";
import AnchorInput, { type Anchor, type Lines } from "@/components/AnchorInput";
import SizePassport from "@/components/SizePassport";
import {
  ANCHOR_LABEL,
  CATEGORIES,
  GENDERS,
  GROUPS,
  formatCm,
  type CategoryId,
  type GroupDef,
  type ShopperGender,
} from "@/lib/categories";
import { isUserCancelled } from "@/lib/firebase/clientAuth";
import { cn } from "@/lib/format";
import {
  entryFor,
  entryKey,
  removeEntry,
  saveEntry,
  setGender,
  signIn,
  signOut,
  useProfile,
} from "@/lib/profile";
import type { CategoryCharts, LiteBrand } from "@/lib/sizing";

type AllCharts = Record<CategoryId, CategoryCharts>;
type AllBrands = Record<CategoryId, LiteBrand[]>;

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

/** One body measurement: its anchor, the lines sized against it, and a passport. */
function GroupSection({
  group,
  index,
  gender,
  charts,
  brands,
}: {
  group: GroupDef;
  index: number;
  gender: ShopperGender;
  charts: AllCharts;
  brands: AllBrands;
}) {
  const { profile, ready } = useProfile();
  const [tab, setTab] = useState<CategoryId>(group.categories[0]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Anchor | null>(null);

  const calibrated = group.categories.filter((c) => profile[entryKey(c, gender)]);
  // The headline anchor is the most recent entry in the group.
  const latest = calibrated
    .map((c) => profile[entryKey(c, gender)]!)
    .sort((x, y) => y.updatedAt - x.updatedAt)[0];
  const current = entryFor(profile, tab, gender);
  const lines: Lines = Object.fromEntries(
    group.categories.filter((c) => c !== tab).map((c) => [c, { brands: brands[c], charts: charts[c] }])
  );

  const commit = async () => {
    if (!draft) return;
    await saveEntry(draft.sourceCategory ?? tab, gender, { ...draft, confidence: "exact" });
    setEditing(false);
    setDraft(null);
  };

  return (
    <section aria-labelledby={`g-${group.id}`} className="border-b border-bone/12 py-10 md:py-12">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="kicker text-fog">
            <span className="text-frost">0{index + 1}</span> — {ANCHOR_LABEL[group.anchorKey]}
          </p>
          <h2 id={`g-${group.id}`} className="mt-3 font-display text-3xl font-light tracking-[-0.02em] text-bone">
            {group.label}
          </h2>
          {!ready ? (
            <div className="mt-4 h-12 w-40 bg-coal" aria-busy="true" />
          ) : latest ? (
            <p className="mt-4 font-display text-5xl font-light tabular text-bone">
              {formatCm(latest.anchorValue)}
              <span className="ml-2 font-mono text-sm text-fog">cm</span>
            </p>
          ) : (
            <p className="mt-4 text-sm text-fog">Not set yet.</p>
          )}

          {calibrated.length > 0 && (
            <ul className="mt-5 border-t border-bone/12">
              {calibrated.map((c) => {
                const e = profile[entryKey(c, gender)]!;
                return (
                  <li key={c} className="flex items-baseline justify-between gap-3 border-b border-bone/8 py-2.5">
                    <span className="text-sm text-bone/85">
                      {CATEGORIES[c].nav}
                      <span className="kicker ml-2 text-fog">
                        {e.sourceBrandSlug === "measured"
                          ? `measured ${formatCm(e.anchorValue)} cm`
                          : `${e.sourceBrandName ?? e.sourceBrandSlug} ${e.sourceSizeLabel}`}
                      </span>
                    </span>
                    <button
                      onClick={() => void removeEntry(entryKey(c, gender))}
                      className="kicker text-fog transition-colors hover:text-bone"
                      aria-label={`Remove ${CATEGORIES[c].label} size`}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {calibrated.length > 0 && group.categories.length > 1 && (
            <p className="mt-3 text-xs leading-relaxed text-fog">
              Lines without their own size use your most recent one. Add a size per line if you
              wear them differently — running shoes half a size up, say.
            </p>
          )}

          {ready && !editing && (
            <button
              onClick={() => {
                setEditing(true);
                setDraft(null);
              }}
              className={cn(
                "kicker mt-5 flex h-9 items-center px-4 transition-colors",
                latest
                  ? "border border-bone/20 text-bone hover:border-bone/60"
                  : "bg-signal text-bone hover:bg-bone hover:text-ink"
              )}
            >
              {latest ? "Add or change a size" : "Set my size"}
            </button>
          )}
        </div>

        <div className="md:col-span-8">
          <div
            className="scroll-thin flex overflow-x-auto border-b border-bone/12"
            role="tablist"
            aria-label={`${group.label} categories`}
          >
            {group.categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={tab === c}
                onClick={() => setTab(c)}
                className={cn(
                  "kicker -mb-px min-w-max border-b px-4 pb-3 transition-colors",
                  tab === c ? "border-frost text-bone" : "border-transparent text-fog hover:text-bone"
                )}
              >
                {CATEGORIES[c].nav}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {editing ? (
              <div className="border border-bone/12 bg-coal p-5 md:p-6">
                <AnchorInput
                  key={`${tab}-${gender}`}
                  category={tab}
                  gender={gender}
                  brands={brands[tab]}
                  charts={charts[tab]}
                  lines={lines}
                  value={draft}
                  onChange={setDraft}
                />
                <div className="mt-6 flex gap-2">
                  <button
                    disabled={!draft}
                    onClick={() => void commit()}
                    className="kicker flex h-10 items-center bg-signal px-5 text-bone transition-colors hover:bg-bone hover:text-ink disabled:opacity-30"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="kicker flex h-10 items-center px-4 text-fog transition-colors hover:text-bone"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : current && current.gender === gender ? (
              <>
                {current.from !== tab && (
                  <p className="kicker mb-3 text-frost">
                    From your {CATEGORIES[current.from].label.toLowerCase()} size
                  </p>
                )}
                <SizePassport
                  category={tab}
                  gender={gender}
                  anchor={current.entry.anchorValue}
                  brands={brands[tab]}
                  charts={charts[tab]}
                />
              </>
            ) : (
              <div className="flex min-h-32 items-center border border-dashed border-bone/12 p-6">
                <p className="max-w-md text-sm leading-relaxed text-fog">
                  Set your {ANCHOR_LABEL[group.anchorKey].toLowerCase()} once — from any{" "}
                  {group.label.toLowerCase()} size you know — and you&apos;ll see your size in all{" "}
                  {brands[tab].length} {CATEGORIES[tab].label.toLowerCase()} brands here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProfileClient({ charts, brands }: { charts: AllCharts; brands: AllBrands }) {
  const { profile, gender } = useProfile();
  const otherGender = gender === "men" ? "women" : "men";
  const otherCount = Object.keys(profile).filter((k) => k.endsWith(`:${otherGender}`)).length;

  return (
    <div className="space-y-10">
      <SyncPanel />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex border border-bone/15" role="group" aria-label="Sizes for">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              aria-pressed={gender === g.id}
              onClick={() => setGender(g.id)}
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
        {GROUPS.map((g, i) => (
          <GroupSection key={`${g.id}-${gender}`} group={g} index={i} gender={gender} charts={charts} brands={brands} />
        ))}
      </div>

      <p className="text-sm text-fog">
        New here?{" "}
        <Link href="/onboarding" className="text-bone underline underline-offset-4 hover:text-frost">
          The 30-second setup
        </Link>{" "}
        covers shoes, tops and bottoms in one go.
      </p>
    </div>
  );
}
