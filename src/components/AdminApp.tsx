"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Database,
  KeyRound,
  Loader2,
  LogOut,
  Package,
  Plus,
  Table2,
  Trash2,
  TriangleAlert,
  Upload,
} from "lucide-react";
import { CATEGORY_ORDER, CATEGORIES, isCategory } from "@/lib/categories";
import { cn } from "@/lib/format";

export interface AdminBrand {
  /** Equals the brand slug for all backends. */
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  categories: string[];
  priority: number;
  needsData: boolean;
}

export interface AdminChart {
  id: string;
  brandSlug: string;
  brandName: string;
  category: string;
  gender: string;
  needsData: boolean;
  rowCount: number;
  updatedAt: string;
  updatedBy: string | null;
}

export interface AdminProduct {
  id: string;
  brandSlug: string;
  brandName: string;
  category: string;
  name: string;
  priceInr: number | null;
}

interface EditRow {
  anchorValue: string;
  eu: string;
  uk: string;
  us: string;
  jpn: string;
  ind: string;
  label: string;
}

const emptyRow = (): EditRow => ({
  anchorValue: "",
  eu: "",
  uk: "",
  us: "",
  jpn: "",
  ind: "",
  label: "",
});

function parseCsv(text: string): EditRow[] {
  const out: EditRow[] = [];
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    if (/^anchor/i.test(t)) continue;
    const cols = t.split(/[\t,;|]/).map((s) => s.trim());
    if (!Number.isFinite(parseFloat(cols[0] ?? ""))) continue;
    out.push({
      anchorValue: cols[0],
      eu: cols[1] ?? "",
      uk: cols[2] ?? "",
      us: cols[3] ?? "",
      jpn: cols[4] ?? "",
      ind: cols[5] ?? "",
      label: cols[6] ?? "",
    });
  }
  return out;
}

const KEY_STORE = "sh_admin_key";

export default function AdminApp({
  brands: initialBrands,
  charts: initialCharts,
  products: initialProducts,
}: {
  brands: AdminBrand[];
  charts: AdminChart[];
  products: AdminProduct[];
}) {
  const [key, setKey] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [keyInput, setKeyInput] = useState("");
  const [gateError, setGateError] = useState("");
  const [tab, setTab] = useState<"brands" | "charts" | "products">("brands");

  const [brands, setBrands] = useState(initialBrands);
  const [charts, setCharts] = useState(initialCharts);
  const [products, setProducts] = useState(initialProducts);

  const call = async (path: string, init?: RequestInit) => {
    const res = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": key ?? "",
        ...(init?.headers ?? {}),
      },
    });
    if (res.status === 401) {
      setKey(null);
      sessionStorage.removeItem(KEY_STORE);
      throw new Error("unauthorized");
    }
    return res.json();
  };

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY_STORE);
    if (!stored) {
      setChecking(false);
      return;
    }
    fetch("/api/admin/ping", { headers: { "x-admin-key": stored } })
      .then((r) => {
        if (r.ok) setKey(stored);
        else sessionStorage.removeItem(KEY_STORE);
      })
      .finally(() => setChecking(false));
  }, []);

  const tryKey = async () => {
    setGateError("");
    const res = await fetch("/api/admin/ping", {
      headers: { "x-admin-key": keyInput.trim() },
    });
    if (res.ok) {
      sessionStorage.setItem(KEY_STORE, keyInput.trim());
      setKey(keyInput.trim());
    } else {
      setGateError("Wrong key.");
    }
  };

  /* ------------------------------------------------------------- gate */
  if (checking) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="animate-spin text-frost" size={22} />
      </div>
    );
  }

  if (!key) {
    return (
      <div className="mx-auto max-w-md border border-bone/12 bg-coal p-8">
        <div className="flex items-center gap-3">
          <KeyRound size={18} className="text-frost" strokeWidth={1.8} />
          <span className="font-mono text-[10px] tracking-[0.24em] text-fog">
            CONTROL DECK — RESTRICTED
          </span>
        </div>
        <h2 className="mt-4 font-display text-4xl tracking-tight text-bone">
          ADMIN KEY<span className="text-frost">.</span>
        </h2>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && tryKey()}
          placeholder="Enter admin key"
          className="mt-6 w-full border border-bone/20 bg-ink px-4 py-3 font-mono text-sm text-bone outline-none focus:border-frost"
        />
        {gateError && (
          <p className="mt-2 font-mono text-xs text-frost">{gateError}</p>
        )}
        <button
          onClick={tryKey}
          className="mt-4 w-full bg-signal px-4 py-3 font-mono text-[11px] font-semibold tracking-[0.2em] text-bone uppercase transition-colors hover:bg-frost hover:text-bone"
        >
          Enter deck
        </button>
        <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-fog">
          DEFAULT KEY: sizing-admin — OVERRIDE WITH THE ADMIN_KEY ENV VAR.
        </p>
      </div>
    );
  }

  /* ----------------------------------------------------------- brands */
  const BrandsTab = (
    <div>
      <div className="grid gap-px border border-bone/12 bg-bone/12">
        {brands.map((b) => (
          <div
            key={b.id}
            className="flex flex-wrap items-center gap-3 bg-ink px-4 py-3"
          >
            <span className="flex h-8 w-8 items-center justify-center bg-signal font-display text-sm text-bone">
              {b.name.charAt(0)}
            </span>
            <div className="min-w-40">
              <p className="font-display text-lg leading-tight tracking-wide text-bone uppercase">
                {b.name}
              </p>
              <p className="font-mono text-[10px] text-fog">/{b.slug}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {b.categories.map((c) => (
                <span
                  key={c}
                  className="border border-bone/15 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-fog uppercase"
                >
                  {c}
                </span>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <label className="font-mono text-[9px] tracking-wider text-fog">
                PRIO
              </label>
              <input
                type="number"
                defaultValue={b.priority}
                onBlur={(e) => {
                  const v = Number(e.target.value);
                  if (v === b.priority) return;
                  call(`/api/admin/brands/${b.slug}`, {
                    method: "PATCH",
                    body: JSON.stringify({ priority: v }),
                  }).then((d) =>
                    setBrands((prev) =>
                      prev.map((x) => (x.id === b.id ? d.brand : x))
                    )
                  );
                }}
                className="w-16 border border-bone/15 bg-ink px-2 py-1.5 font-mono text-xs text-bone outline-none focus:border-frost"
              />
              <button
                onClick={() =>
                  call(`/api/admin/brands/${b.slug}`, {
                    method: "PATCH",
                    body: JSON.stringify({ needsData: !b.needsData }),
                  }).then((d) =>
                    setBrands((prev) =>
                      prev.map((x) => (x.id === b.id ? d.brand : x))
                    )
                  )
                }
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1.5 font-mono text-[9px] tracking-[0.16em]",
                  b.needsData
                    ? "bg-signal text-bone"
                    : "border border-bone/20 text-fog hover:text-bone"
                )}
              >
                <TriangleAlert size={11} /> NEEDS DATA
              </button>
              <button
                aria-label="Delete brand"
                onClick={() => {
                  if (!window.confirm(`Delete ${b.name} and all its charts?`)) return;
                  call(`/api/admin/brands/${b.slug}`, { method: "DELETE" }).then(() =>
                    setBrands((prev) => prev.filter((x) => x.id !== b.id))
                  );
                }}
                className="flex h-8 w-8 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-frost hover:text-frost"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <AddBrandForm
        onCreated={(brand) => setBrands((prev) => [...prev, brand])}
        call={call}
      />
    </div>
  );

  /* ------------------------------------------------------------------ */

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-px border border-bone/15 bg-bone/15">
          {(
            [
              ["brands", "BRANDS", Database],
              ["charts", "CHARTS", Table2],
              ["products", "PRODUCTS", Package],
            ] as [typeof tab, string, typeof Database][]
          ).map(([t, label, Icon]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] tracking-[0.18em] transition-colors",
                tab === t
                  ? "bg-bone text-ink"
                  : "bg-ink text-fog hover:text-bone"
              )}
            >
              <Icon size={13} strokeWidth={1.8} /> {label}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem(KEY_STORE);
            setKey(null);
          }}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-fog uppercase transition-colors hover:text-bone"
        >
          <LogOut size={12} /> Exit deck
        </button>
      </div>

      <div className="mt-8">
        {tab === "brands" && BrandsTab}
        {tab === "charts" && (
          <ChartsTab brands={brands} charts={charts} setCharts={setCharts} call={call} />
        )}
        {tab === "products" && (
          <ProductsTab
            brands={brands}
            products={products}
            setProducts={setProducts}
            call={call}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================== brands add */

function AddBrandForm({
  onCreated,
  call,
}: {
  onCreated: (b: AdminBrand) => void;
  call: (path: string, init?: RequestInit) => Promise<any>;
}) {
  const [name, setName] = useState("");
  const [cats, setCats] = useState<string[]>(["sneakers"]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="mt-6 border border-bone/12 bg-coal p-5">
      <span className="font-mono text-[10px] tracking-[0.22em] text-fog">
        ADD BRAND — A FORM, NOT A DEPLOY
      </span>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Brand name (e.g. Crocs)"
          className="min-w-56 flex-1 border border-bone/20 bg-ink px-4 py-2.5 text-sm text-bone outline-none focus:border-frost"
        />
        {CATEGORY_ORDER.map((c) => (
          <label
            key={c}
            className={cn(
              "cursor-pointer border px-3 py-2.5 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors",
              cats.includes(c)
                ? "border-signal bg-signal text-bone"
                : "border-bone/20 text-fog hover:text-bone"
            )}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={cats.includes(c)}
              onChange={() =>
                setCats((prev) =>
                  prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
                )
              }
            />
            {CATEGORIES[c].nav}
          </label>
        ))}
        <button
          disabled={busy || !name.trim() || cats.length === 0}
          onClick={() => {
            setBusy(true);
            setErr("");
            call("/api/admin/brands", {
              method: "POST",
              body: JSON.stringify({ name: name.trim(), categories: cats }),
            })
              .then((d) => {
                if (d.error) setErr(d.error);
                else {
                  onCreated(d.brand);
                  setName("");
                }
              })
              .finally(() => setBusy(false));
          }}
          className="flex items-center gap-2 bg-bone px-5 py-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-ink uppercase transition-colors hover:bg-frost disabled:opacity-30"
        >
          <Plus size={12} strokeWidth={2.4} /> Create
        </button>
      </div>
      {err && <p className="mt-2 font-mono text-xs text-frost">{err}</p>}
    </div>
  );
}

/* ============================================================== charts tab */

function ChartsTab({
  brands,
  charts,
  setCharts,
  call,
}: {
  brands: AdminBrand[];
  charts: AdminChart[];
  setCharts: React.Dispatch<React.SetStateAction<AdminChart[]>>;
  call: (path: string, init?: RequestInit) => Promise<any>;
}) {
  const [brandSlug, setBrandSlug] = useState<string>(brands[0]?.slug ?? "");
  const [category, setCategory] = useState<string>("sneakers");
  const [gender, setGender] = useState<string>("men");
  const [rows, setRows] = useState<EditRow[]>([]);
  const [needsData, setNeedsData] = useState(false);
  const [csv, setCsv] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const brand = brands.find((b) => b.slug === brandSlug);

  const load = async () => {
    if (!brand) return;
    setLoading(true);
    setMsg("");
    const d = await fetch(
      `/api/chart?brand=${brand.slug}&category=${category}&gender=${gender}`
    ).then((r) => r.json());
    setRows(
      (d.rows ?? []).map((r: any) => ({
        anchorValue: String(r.anchorValue),
        eu: r.eu ?? "",
        uk: r.uk ?? "",
        us: r.us ?? "",
        jpn: r.jpn ?? "",
        ind: r.ind ?? "",
        label: r.label ?? "",
      }))
    );
    setNeedsData(!!d.needsData);
    setLoading(false);
  };

  const setRow = (i: number, patch: Partial<EditRow>) =>
    setRows((prev) => prev.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const save = async () => {
    setMsg("");
    const payload = rows
      .map((r) => ({
        ...r,
        anchorValue: r.anchorValue === "" ? NaN : Number(r.anchorValue),
      }))
      .filter((r) => Number.isFinite(Number(r.anchorValue)));
    const d = await call("/api/admin/charts", {
      method: "PUT",
      body: JSON.stringify({
        brandSlug,
        category,
        gender,
        needsData,
        rows: payload,
      }),
    });
    setMsg(d.error ? d.error : `SAVED — ${d.rowCount} ROWS`);
    if (!d.error && brand) {
      setCharts((prev) => {
        const idx = prev.findIndex(
          (c) =>
            c.brandSlug === brandSlug &&
            c.category === category &&
            c.gender === gender
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], rowCount: d.rowCount, needsData };
          return next;
        }
        return [
          ...prev,
          {
            id: String(d.chartId),
            brandSlug,
            brandName: brand.name,
            category,
            gender,
            needsData,
            rowCount: d.rowCount,
            updatedAt: new Date().toISOString(),
            updatedBy: "admin",
          },
        ];
      });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* left rail: selector + existing charts */}
      <div>
        <div className="border border-bone/12 bg-coal p-4">
          <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-fog">
            BRAND
          </label>
          <select
            value={brandSlug}
            onChange={(e) => setBrandSlug(e.target.value)}
            className="w-full appearance-none border border-bone/20 bg-ink px-3 py-2.5 font-display text-base tracking-wide text-bone uppercase outline-none focus:border-frost"
          >
            {brands.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
          <label className="mt-4 mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-fog">
            CATEGORY
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none border border-bone/20 bg-ink px-3 py-2.5 font-mono text-xs text-bone uppercase outline-none focus:border-frost"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORIES[c].label}
              </option>
            ))}
          </select>
          <label className="mt-4 mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-fog">
            GENDER
          </label>
          <div className="flex border border-bone/15">
            {["men", "women", "unisex"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={cn(
                  "flex-1 px-2 py-2 font-mono text-[9px] tracking-[0.14em] uppercase transition-colors",
                  gender === g ? "bg-bone text-ink" : "text-fog hover:text-bone"
                )}
              >
                {g}
              </button>
            ))}
          </div>
          <button
            onClick={load}
            disabled={loading || !brand}
            className="mt-4 flex w-full items-center justify-center gap-2 bg-signal px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.18em] text-bone uppercase transition-colors hover:bg-frost hover:text-bone disabled:opacity-40"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Table2 size={12} />}
            Load chart
          </button>
        </div>

        <div className="scroll-thin mt-4 max-h-80 overflow-y-auto border border-bone/12">
          {charts.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setBrandSlug(c.brandSlug);
                setCategory(c.category);
                setGender(c.gender);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 border-b border-bone/10 px-3 py-2.5 text-left transition-colors hover:bg-coal",
                c.brandSlug === brandSlug &&
                  c.category === category &&
                  c.gender === gender
                  ? "bg-coal"
                  : "bg-ink"
              )}
            >
              <span className="font-mono text-[10px] tracking-wider text-bone uppercase">
                {c.brandName}
                <span className="text-fog">
                  {" "}
                  ·{" "}
                  {isCategory(c.category)
                    ? CATEGORIES[c.category as keyof typeof CATEGORIES].nav
                    : c.category}{" "}
                  · {c.gender}
                </span>
              </span>
              <span
                className={cn(
                  "font-mono text-[9px]",
                  c.needsData ? "text-frost" : "text-fog"
                )}
              >
                {c.rowCount}R{c.needsData ? " · !" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* editor */}
      <div>
        <div className="flex items-center gap-3 border border-bone/12 bg-coal px-4 py-3">
          <label className="flex cursor-pointer items-center gap-2 font-mono text-[10px] tracking-[0.16em] text-fog uppercase">
            <input
              type="checkbox"
              checked={needsData}
              onChange={(e) => setNeedsData(e.target.checked)}
              className="accent-frost"
            />
            Flag: needs more data
          </label>
          <button
            onClick={() => setRows((prev) => [...prev, emptyRow()])}
            className="ml-auto flex items-center gap-1.5 border border-bone/20 px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] text-bone uppercase transition-colors hover:border-frost hover:text-frost"
          >
            <Plus size={11} strokeWidth={2.4} /> Row
          </button>
          <button
            onClick={save}
            className="flex items-center gap-1.5 bg-bone px-4 py-1.5 font-mono text-[10px] font-semibold tracking-[0.14em] text-ink uppercase transition-colors hover:bg-frost"
          >
            <Check size={11} strokeWidth={2.4} /> Save chart
          </button>
        </div>
        {msg && (
          <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-frost">{msg}</p>
        )}

        <div className="mt-4 overflow-x-auto border border-bone/12">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-coal">
                {["ANCHOR", "EU", "UK", "US", "JPN", "IND", "LABEL", ""].map((h) => (
                  <th
                    key={h}
                    className="border-b border-bone/12 px-2 py-2 text-left font-mono text-[9px] font-normal tracking-[0.2em] text-fog"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center font-mono text-[11px] text-fog"
                  >
                    EMPTY — LOAD AN EXISTING CHART, ADD ROWS, OR PASTE CSV BELOW.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-bone/8">
                  {(
                    ["anchorValue", "eu", "uk", "us", "jpn", "ind", "label"] as const
                  ).map((f) => (
                    <td key={f} className="px-1 py-1">
                      <input
                        value={r[f]}
                        onChange={(e) => setRow(i, { [f]: e.target.value })}
                        className={cn(
                          "w-full bg-transparent px-2 py-1.5 font-mono text-xs text-bone outline-none focus:bg-coal",
                          f === "anchorValue" && "text-frost"
                        )}
                      />
                    </td>
                  ))}
                  <td className="px-1 py-1">
                    <button
                      aria-label="Remove row"
                      onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                      className="flex h-7 w-7 items-center justify-center text-fog transition-colors hover:text-frost"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 border border-dashed border-bone/20 p-4">
          <div className="flex items-center gap-2">
            <Upload size={13} className="text-frost" />
            <span className="font-mono text-[10px] tracking-[0.2em] text-fog">
              CSV PASTE — ANCHOR,EU,UK,US,JPN,IND,LABEL (ONE PER LINE)
            </span>
          </div>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={5}
            spellCheck={false}
            placeholder={"26.0,41,7,8,27.0,7,\n26.5,42,7.5,8.5,27.5,7.5,"}
            className="mt-3 w-full border border-bone/15 bg-ink px-3 py-2 font-mono text-xs text-bone outline-none focus:border-frost"
          />
          <button
            onClick={() => {
              const parsed = parseCsv(csv);
              if (parsed.length > 0) setRows((prev) => [...prev, ...parsed]);
              setCsv("");
            }}
            className="border border-bone/25 px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-bone uppercase transition-colors hover:border-frost hover:text-frost"
          >
            Parse &amp; append rows
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ products tab */

function ProductsTab({
  brands,
  products,
  setProducts,
  call,
}: {
  brands: AdminBrand[];
  products: AdminProduct[];
  setProducts: React.Dispatch<React.SetStateAction<AdminProduct[]>>;
  call: (path: string, init?: RequestInit) => Promise<any>;
}) {
  const [brandSlug, setBrandSlug] = useState<string>(brands[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("sneakers");

  const brand = brands.find((b) => b.slug === brandSlug);
  const mine = products.filter((p) => p.brandSlug === brandSlug);

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="border border-bone/12 bg-coal p-4">
        <label className="mb-1.5 block font-mono text-[9px] tracking-[0.2em] text-fog">
          BRAND
        </label>
        <select
          value={brandSlug}
          onChange={(e) => setBrandSlug(e.target.value)}
          className="w-full appearance-none border border-bone/20 bg-ink px-3 py-2.5 font-display text-base tracking-wide text-bone uppercase outline-none focus:border-frost"
        >
          {brands.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="mt-6 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full border border-bone/20 bg-ink px-3 py-2.5 text-sm text-bone outline-none focus:border-frost"
          />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="Price INR (optional)"
            className="w-full border border-bone/20 bg-ink px-3 py-2.5 font-mono text-xs text-bone outline-none focus:border-frost"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full appearance-none border border-bone/20 bg-ink px-3 py-2.5 font-mono text-xs text-bone uppercase outline-none focus:border-frost"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORIES[c].label}
              </option>
            ))}
          </select>
          <button
            disabled={!name.trim()}
            onClick={() => {
              call("/api/admin/products", {
                method: "POST",
                body: JSON.stringify({
                  brandSlug,
                  category,
                  name: name.trim(),
                  priceInr: price ? Number(price) : undefined,
                }),
              }).then((d) => {
                if (d.product) {
                  setProducts((prev) => [
                    ...prev,
                    { ...d.product, brandName: brand?.name ?? "" },
                  ]);
                  setName("");
                  setPrice("");
                }
              });
            }}
            className="flex w-full items-center justify-center gap-2 bg-bone px-4 py-2.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-frost disabled:opacity-30"
          >
            <Plus size={12} strokeWidth={2.4} /> Add product
          </button>
        </div>
      </div>

      <div className="border border-bone/12">
        {mine.length === 0 && (
          <p className="px-4 py-10 text-center font-mono text-[11px] text-fog">
            NO PRODUCTS FOR THIS BRAND YET.
          </p>
        )}
        {mine.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 border-b border-bone/10 px-4 py-3"
          >
            <div>
              <p className="text-sm text-bone">{p.name}</p>
              <p className="font-mono text-[10px] text-fog uppercase">
                {p.category} {p.priceInr ? `· ₹${p.priceInr.toLocaleString("en-IN")}` : ""}
              </p>
            </div>
            <button
              aria-label="Delete product"
              onClick={() =>
                call(`/api/admin/products/${p.id}`, { method: "DELETE" }).then(() =>
                  setProducts((prev) => prev.filter((x) => x.id !== p.id))
                )
              }
              className="flex h-8 w-8 items-center justify-center border border-bone/15 text-fog transition-colors hover:border-frost hover:text-frost"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
