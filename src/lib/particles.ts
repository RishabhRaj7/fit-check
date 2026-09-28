/**
 * A small particle engine — ported from The Daily Index masthead.
 *
 * Every particle has a home. Text is rasterised off-screen, sampled on a
 * grid, and each lit sample becomes a home. Particles spring towards their
 * homes, get pushed aside by the pointer, and light up in the accent while
 * they move. Changing the text just hands out new homes — so "UK 7.5"
 * re-forms into "UK 8" out of the very same points. Same feet, different
 * numbers.
 *
 * Pure canvas 2D. Rendering stops when the canvas is off screen or the tab
 * is hidden; reduced-motion readers get a single static frame.
 */

export interface ShapeSpec {
  /** One string per line. */
  lines: string[];
  family: string;
  weight?: number;
  /** Canvas font-stretch keyword. */
  stretch?: CanvasFontStretch;
  /** Fraction of the canvas width the widest line may fill. */
  fill?: number;
  /** Fraction of the canvas height the block may fill. */
  fillHeight?: number;
  leading?: number;
  align?: "left" | "center" | "right";
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  hx: number;
  hy: number;
  bound: boolean;
  delay: number;
  seed: number;
  accent: boolean;
}

export interface FieldOptions {
  /** Grid step in CSS px when sampling. Smaller = denser. */
  gap?: number;
  /** Dot size in CSS px. */
  dot?: number;
  /** Pointer influence radius in CSS px. */
  radius?: number;
  /** Share of particles that are permanently accent-coloured. */
  accentShare?: number;
}

const SPRING = 0.06;
const DAMPING = 0.83;
const LIT = 1.1;

export class ParticleField {
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private width = 0;
  private height = 0;
  private dpr = 1;
  private raf = 0;
  private running = false;
  private visible = true;
  private pointer = { x: -9999, y: -9999, active: false, down: false };
  private formedAt = performance.now();
  private shape: ShapeSpec | null = null;
  private colors = { ink: "#f5f5f0", accent: "#8cb8dd" };
  private reduced: boolean;
  private opts: Required<FieldOptions>;
  private cleanup: Array<() => void> = [];
  private destroyed = false;
  private breatheTimer = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    options: FieldOptions = {}
  ) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas 2d unavailable");
    this.ctx = ctx;
    this.opts = {
      gap: options.gap ?? 4,
      dot: options.dot ?? 2.2,
      radius: options.radius ?? 90,
      accentShare: options.accentShare ?? 0.05,
    };
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.bindEvents();
  }

  /* ---------------------------------------------------------- public API */

  setColors(colors: Partial<{ ink: string; accent: string }>) {
    this.colors = { ...this.colors, ...colors };
    if (this.reduced || !this.running) this.draw(performance.now());
  }

  /** Match the canvas's CSS box and re-home particles on the current shape. */
  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(1, Math.round(rect.width));
    this.height = Math.max(1, Math.round(rect.height));
    this.canvas.width = Math.round(this.width * this.dpr);
    this.canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.shape) this.applyShape(this.shape, false);
  }

  setShape(shape: ShapeSpec, burst = true) {
    this.shape = shape;
    this.applyShape(shape, burst);
    this.wake();
  }

  /** A soft jolt — used when the value doesn't change but the brand did. */
  ripple() {
    for (const p of this.particles) {
      p.vx += (Math.random() - 0.5) * 3;
      p.vy += (Math.random() - 0.5) * 3;
    }
    this.wake();
  }

  setVisible(visible: boolean) {
    this.visible = visible;
    if (visible) this.wake();
  }

  destroy() {
    this.destroyed = true;
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.breatheTimer);
    for (const fn of this.cleanup) fn();
    this.cleanup = [];
  }

  /* ------------------------------------------------------------ sampling */

  private sample(shape: ShapeSpec): Array<[number, number]> {
    const w = this.width;
    const h = this.height;
    const off = document.createElement("canvas");
    off.width = w;
    off.height = h;
    const c = off.getContext("2d", { willReadFrequently: true });
    if (!c) return [];

    const weight = shape.weight ?? 700;
    const leading = shape.leading ?? 0.92;
    const fill = shape.fill ?? 0.98;
    const fillH = shape.fillHeight ?? 0.9;
    const setFont = (px: number) => {
      c.font = `${weight} ${px}px ${shape.family}`;
      if (shape.stretch && "fontStretch" in c) c.fontStretch = shape.stretch;
    };

    setFont(100);
    const widest = Math.max(...shape.lines.map((l) => c.measureText(l).width), 1);
    let size = (w * fill * 100) / widest;
    size = Math.min(size, (h * fillH) / (shape.lines.length * leading * 0.78));

    setFont(size);
    c.fillStyle = "#000";
    c.textBaseline = "alphabetic";
    const lineH = size * leading;
    const capH = size * 0.72;
    const blockH = lineH * (shape.lines.length - 1) + capH;
    const top = (h - blockH) / 2;
    shape.lines.forEach((line, i) => {
      const lw = c.measureText(line).width;
      const x = shape.align === "center" ? (w - lw) / 2 : shape.align === "right" ? w - lw : 0;
      c.fillText(line, x, top + capH + lineH * i);
    });

    const data = c.getImageData(0, 0, w, h).data;
    const gap = this.opts.gap;
    const pts: Array<[number, number]> = [];
    for (let y = 0; y < h; y += gap) {
      for (let x = 0; x < w; x += gap) {
        if (data[(y * w + x) * 4 + 3] > 140) pts.push([x, y]);
      }
    }
    return pts;
  }

  private applyShape(shape: ShapeSpec, burst: boolean) {
    const pts = this.sample(shape);
    // Shuffle so a morph mixes points across the whole word — liquid, not a slide.
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pts[i], pts[j]] = [pts[j], pts[i]];
    }
    const dust = Math.round(pts.length * 0.04);
    const needed = pts.length + dust;
    const fresh = this.particles.length === 0;

    while (this.particles.length < needed) {
      // New points scatter in from around the box.
      const sx = (Math.random() * 1.4 - 0.2) * this.width;
      const sy = (Math.random() * 1.8 - 0.4) * this.height;
      this.particles.push({
        x: sx,
        y: sy,
        vx: 0,
        vy: 0,
        hx: sx,
        hy: sy,
        bound: false,
        delay: 0,
        seed: Math.random() * 1000,
        accent: Math.random() < this.opts.accentShare,
      });
    }
    if (this.particles.length > needed) this.particles.length = needed;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (i < pts.length) {
        p.hx = pts[i][0];
        p.hy = pts[i][1];
        p.bound = true;
      } else {
        p.hx = Math.random() * this.width;
        p.hy = Math.random() * this.height;
        p.bound = false;
      }
      // The first form sweeps left to right; later morphs move together.
      p.delay = fresh ? (p.hx / this.width) * 0.5 + Math.random() * 0.25 : Math.random() * 0.1;
    }

    this.formedAt = performance.now();
    if (burst && !fresh) {
      const cx = this.width / 2;
      const cy = this.height / 2;
      for (const p of this.particles) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const d = Math.hypot(dx, dy) || 1;
        const f = 5 * (0.4 + Math.random() * 0.9);
        p.vx += (dx / d) * f + (Math.random() - 0.5) * 3;
        p.vy += (dy / d) * f + (Math.random() - 0.5) * 3;
      }
    }
    if (this.reduced) {
      for (const p of this.particles) {
        p.x = p.hx;
        p.y = p.hy;
        p.vx = p.vy = 0;
      }
      this.draw(performance.now());
    }
  }

  /* ---------------------------------------------------------------- loop */

  private wake() {
    if (this.destroyed || this.reduced || this.running || !this.visible || document.hidden) return;
    this.running = true;
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    if (this.destroyed || !this.visible || document.hidden) {
      this.running = false;
      return;
    }
    const moving = this.step(now);
    this.draw(now);
    if (moving || this.pointer.active) {
      this.raf = requestAnimationFrame(this.tick);
      return;
    }
    this.running = false;
    // Breathe: a faint wave every few seconds so the readout never looks frozen.
    window.clearTimeout(this.breatheTimer);
    this.breatheTimer = window.setTimeout(() => {
      if (this.running || !this.visible || this.destroyed) return;
      const band = Math.random() * this.width;
      for (const p of this.particles) {
        const d = Math.abs(p.hx - band);
        if (d < 50) p.vy += (Math.random() - 0.5) * 1.4 * (1 - d / 50);
      }
      this.wake();
    }, 4200);
  };

  private step(now: number): boolean {
    const t = (now - this.formedAt) / 1000;
    const { x: mx, y: my, active, down } = this.pointer;
    const R = this.opts.radius;
    const R2 = R * R;
    let energy = 0;

    for (const p of this.particles) {
      if (t > p.delay) {
        const k = p.bound ? SPRING : SPRING * 0.05;
        p.vx += (p.hx - p.x) * k;
        p.vy += (p.hy - p.y) * k;
        if (!p.bound) {
          p.vx += Math.sin(now * 0.0006 + p.seed) * 0.02;
          p.vy += Math.cos(now * 0.0005 + p.seed) * 0.02;
        }
      }
      if (active) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) ** 2 * (down ? 8 : 3.6);
          // Push out with a swirl, so the hole reads as a vortex, not a dent.
          p.vx += (dx / d) * f + (-dy / d) * f * 0.45;
          p.vy += (dy / d) * f + (dx / d) * f * 0.45;
        }
      }
      p.vx *= DAMPING;
      p.vy *= DAMPING;
      p.x += p.vx;
      p.y += p.vy;
      energy +=
        Math.abs(p.vx) +
        Math.abs(p.vy) +
        (p.bound ? Math.abs(p.hx - p.x) + Math.abs(p.hy - p.y) : 0);
    }
    return energy / Math.max(1, this.particles.length) > 0.05;
  }

  private draw(now: number) {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.width, this.height);
    const s = this.opts.dot;
    const half = s / 2;

    // Batched by colour: settled points, dust, then lit (moving) points.
    ctx.fillStyle = this.colors.ink;
    ctx.beginPath();
    for (const p of this.particles) {
      if (!p.bound || p.accent) continue;
      if (Math.abs(p.vx) + Math.abs(p.vy) > LIT) continue;
      ctx.rect(p.x - half, p.y - half, s, s);
    }
    ctx.fill();

    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    for (const p of this.particles) {
      if (p.bound) continue;
      const tw = 0.6 + 0.4 * Math.sin(now * 0.002 + p.seed);
      ctx.rect(p.x - half * tw, p.y - half * tw, s * tw, s * tw);
    }
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = this.colors.accent;
    ctx.beginPath();
    for (const p of this.particles) {
      if (!p.bound) continue;
      const lit = Math.abs(p.vx) + Math.abs(p.vy) > LIT;
      if (!lit && !p.accent) continue;
      ctx.rect(p.x - half, p.y - half, s, s);
    }
    ctx.fill();
  }

  /* --------------------------------------------------------------- input */

  private bindEvents() {
    const c = this.canvas;
    const toLocal = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      this.pointer.x = e.clientX - r.left;
      this.pointer.y = e.clientY - r.top;
    };
    const move = (e: PointerEvent) => {
      toLocal(e);
      this.pointer.active = true;
      this.wake();
    };
    const leave = () => {
      this.pointer.active = false;
      this.pointer.down = false;
    };
    const down = (e: PointerEvent) => {
      toLocal(e);
      this.pointer.down = true;
      this.pointer.active = true;
      this.wake();
    };
    const up = (e: PointerEvent) => {
      this.pointer.down = false;
      // Touch has no hover: lift the finger and the hole closes.
      if (e.pointerType !== "mouse") this.pointer.active = false;
    };
    const vis = () => {
      if (!document.hidden) this.wake();
    };
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", vis);
    this.cleanup.push(() => {
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointerup", up);
      c.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", vis);
    });
  }
}

/** The resolved font stack of an element carrying `className`, for canvas. */
export function resolveFontFamily(className: string): string {
  const probe = document.createElement("span");
  probe.className = className;
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family;
}
