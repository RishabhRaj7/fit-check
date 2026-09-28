const NODES = ["NK", "AD", "PM", "NB", "AS", "SK", "HR", "BT"];
const R = 92;
const C = 120;

function pos(i: number, n: number) {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
}

function Panel({ hub }: { hub: boolean }) {
  const pts = NODES.map((_, i) => pos(i, NODES.length));
  const edges: [number, number][] = [];
  if (!hub) for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) edges.push([i, j]);
  return (
    <svg viewBox="0 0 240 240" className="h-auto w-full" role="img" aria-label={hub ? "Eight brands, each linked once to a single central anchor" : "Eight brands, every pair linked to every other"}>
      {hub
        ? pts.map((p, i) => (
            <line key={i} x1={C} y1={C} x2={p.x} y2={p.y} stroke="var(--color-frost)" strokeOpacity="0.7" strokeWidth="1" />
          ))
        : edges.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={pts[a].x}
              y1={pts[a].y}
              x2={pts[b].x}
              y2={pts[b].y}
              stroke="var(--color-bone)"
              strokeOpacity="0.22"
              strokeWidth="0.75"
            />
          ))}
      {hub && (
        <g>
          <rect x={C - 16} y={C - 16} width="32" height="32" fill="var(--color-ink)" stroke="var(--color-frost)" />
          <text x={C} y={C + 3.5} textAnchor="middle" fontSize="10" fontFamily="var(--font-plex-mono)" fill="var(--color-frost)">
            cm
          </text>
        </g>
      )}
      {pts.map((p, i) => (
        <g key={NODES[i]}>
          <rect x={p.x - 13} y={p.y - 9} width="26" height="18" fill="var(--color-ink)" stroke="var(--color-bone)" strokeOpacity="0.4" />
          <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9" letterSpacing="1" fontFamily="var(--font-plex-mono)" fill="var(--color-bone)">
            {NODES[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

/** N×N pairwise tables versus one anchor. */
export default function AnchorDiagram() {
  const n = NODES.length;
  return (
    <div className="grid gap-px border border-bone/12 bg-bone/12 sm:grid-cols-2">
      <figure className="bg-ink p-6">
        <Panel hub={false} />
        <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-bone/12 pt-4">
          <span className="kicker text-fog">Brand ↔ brand tables</span>
          <span className="font-display text-2xl font-light tabular text-bone">{(n * (n - 1)) / 2}</span>
        </figcaption>
      </figure>
      <figure className="bg-ink p-6">
        <Panel hub />
        <figcaption className="mt-4 flex items-baseline justify-between gap-4 border-t border-bone/12 pt-4">
          <span className="kicker text-fog">Charts against one anchor</span>
          <span className="font-display text-2xl font-light tabular text-frost">{n}</span>
        </figcaption>
      </figure>
    </div>
  );
}
