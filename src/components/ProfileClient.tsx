"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { User } from "firebase/auth";
import {
  ArrowUpRight,
  CloudUpload,
  Loader2,
  LogOut,
  Pencil,
  Ruler,
  Trash2,
  X,
} from "lucide-react";
import { CATEGORIES, isCategory, type CategoryId } from "@/lib/categories";
import { cn } from "@/lib/format";
import { loadProfile, removeEntry, saveEntry, type Profile } from "@/lib/profile";
import {
  initClientFirebase,
  onAuthChange,
  signInGoogle,
  signOutUser,
} from "@/lib/firebase/clientAuth";
import KnownSizePicker, {
  type LiteBrand,
  type PickedSize,
} from "@/components/KnownSizePicker";

export default function ProfileClient({
  brandSets,
}: {
  brandSets: Record<CategoryId, LiteBrand[]>;
}) {
  const [profile, setProfile] = useState<Profile>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [gateBusy, setGateBusy] = useState(false);

  const reload = () => {
    void loadProfile().then((p) => {
      setProfile(p);
      setLoaded(true);
    });
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    initClientFirebase().then((ok) => {
      setConfigured(ok);
      if (ok) {
        unsub = onAuthChange((u) => {
          setUser(u);
          reload();
        });
        return;
      }
      reload();
    });
    return () => unsub?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPick = (gender: string, cat: CategoryId) => async (v: PickedSize) => {
    await saveEntry(cat, gender, {
      anchorValue: v.anchorValue,
      sourceBrandSlug: v.slug,
      sourceBrandName: v.name,
      sourceSizeLabel: v.label,
      confidence: "exact",
    });
    reload();
    setEditing(null);
  };

  if (!loaded || configured === null) {
    return (
      <div className="flex min-h-56 items-center justify-center">
        <Loader2 className="animate-spin text-frost" size={20} />
      </div>
    );
  }

  /* -------- Firebase configured but signed out → sign-in gate -------- */
  if (configured && !user) {
    return (
      <div className="mx-auto max-w-md border border-bone/12 bg-coal p-8">
        <div className="flex items-center gap-3">
          <CloudUpload size={18} className="text-frost" strokeWidth={1.8} />
          <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
            PROFILE — SYNCED VIA FIREBASE
          </span>
        </div>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-bone">
          SIGN IN TO SYNC<span className="text-frost">.</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-fog">
          Your saved sizes live on your account — any device, every visit.
          Sizes already measured on this device are merged up on first
          sign-in.
        </p>
        <button
          disabled={gateBusy}
          onClick={() => {
            setGateBusy(true);
            signInGoogle().catch(() => setGateBusy(false));
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-signal px-4 py-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-frost hover:text-ink disabled:opacity-40"
        >
          {gateBusy ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <CloudUpload size={13} strokeWidth={2.2} />
          )}
          Sign in with Google
        </button>
        <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-fog">
          ONLY YOUR SIZE PROFILE IS STORED — READABLE AND WRITABLE BY YOU
          ALONE.
        </p>
      </div>
    );
  }

  const keys = Object.keys(profile).sort();
  const allCategories = Object.keys(brandSets) as CategoryId[];
  const missing = allCategories.filter(
    (c) => !keys.some((k) => k.startsWith(`${c}:`))
  );

  return (
    <div>
      {/* sync status */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {user ? (
          <>
            <span className="flex items-center gap-2 border border-frost/40 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-frost uppercase">
              <CloudUpload size={11} /> Synced — {user.email}
            </span>
            <button
              onClick={() => void signOutUser()}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-fog uppercase transition-colors hover:text-bone"
            >
              <LogOut size={11} /> Sign out
            </button>
          </>
        ) : (
          <span className="border border-bone/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-fog uppercase">
            Stored on this device
          </span>
        )}
      </div>

      {keys.length === 0 ? (
        <div className="border border-dashed border-bone/20 p-10 text-center md:p-16">
          <Ruler size={20} className="mx-auto text-frost" strokeWidth={1.8} />
          <h2 className="mt-4 font-display text-4xl tracking-tight text-bone md:text-6xl">
            NOTHING ANCHORED YET<span className="text-frost">.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-fog">
            Tell us one size you trust and every brand page converts for you
            instantly. Takes about twenty seconds.
          </p>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex items-center gap-2 bg-signal px-6 py-3.5 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-frost hover:text-ink"
          >
            Start onboarding <ArrowUpRight size={14} strokeWidth={2.4} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-px border border-bone/12 bg-bone/12 md:grid-cols-2">
          {keys.map((key, i) => {
            const [catId, gender] = key.split(":");
            const entry = profile[key];
            const cat = isCategory(catId) ? CATEGORIES[catId] : null;
            const isEditing = editing === key;
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-ink p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.22em] text-fog">
                      {cat?.nav ?? catId.toUpperCase()} · {gender.toUpperCase()}
                    </span>
                    <p className="mt-2 font-display text-5xl leading-none text-bone">
                      {Math.round(entry.anchorValue * 10) / 10}
                      <span className="text-frost">
                        {" "}
                        {cat?.anchorUnit ?? "CM"}
                      </span>
                    </p>
                    <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-fog">
                      {cat?.anchorLabel ?? "ANCHOR"} — VIA{" "}
                      {entry.sourceBrandSlug === "measured"
                        ? "SELF-MEASURED"
                        : `${(entry.sourceBrandName ?? entry.sourceBrandSlug).toUpperCase()} ${entry.sourceSizeLabel}`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={cn(
                        "px-2 py-1 font-mono text-[9px] tracking-[0.2em]",
                        entry.confidence === "exact"
                          ? "bg-bone text-ink"
                          : "border border-frost text-frost"
                      )}
                    >
                      {entry.confidence === "exact" ? "EXACT" : "INFERRED"}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        aria-label="Edit"
                        onClick={() => setEditing(isEditing ? null : key)}
                        className="flex h-8 w-8 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-frost hover:text-frost"
                      >
                        {isEditing ? <X size={13} /> : <Pencil size={13} />}
                      </button>
                      <button
                        aria-label="Remove"
                        onClick={() => {
                          void removeEntry(key).then(reload);
                        }}
                        className="flex h-8 w-8 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-frost hover:text-frost"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {isEditing && isCategory(catId) && (
                  <div className="mt-5 border-t border-bone/12 pt-5">
                    <KnownSizePicker
                      category={catId}
                      gender={gender === "women" ? "women" : "men"}
                      brands={brandSets[catId]}
                      value={null}
                      onChange={onPick(gender, catId)}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {missing.length > 0 && keys.length > 0 && (
        <div className="mt-8 border border-bone/12 bg-coal p-6">
          <span className="font-mono text-[10px] tracking-[0.22em] text-fog">
            NOT ANCHORED YET
          </span>
          <div className="mt-3 flex flex-wrap gap-2">
            {missing.map((c) => (
              <Link
                key={c}
                href={`/category/${c}`}
                className="group flex items-center gap-2 border border-bone/20 px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] text-bone uppercase transition-colors hover:border-frost hover:text-frost"
              >
                {CATEGORIES[c].label}
                <ArrowUpRight
                  size={12}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
