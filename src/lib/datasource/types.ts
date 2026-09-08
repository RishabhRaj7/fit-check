export interface BrandRec {
  /** String id — brand slug for Firestore (and mirrored for Postgres). */
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  categories: string[];
  priority: number;
  needsData: boolean;
}

export interface ChartRowRec {
  anchorValue: number;
  eu: string | null;
  uk: string | null;
  us: string | null;
  jpn: string | null;
  ind: string | null;
  label: string | null;
}

export interface ChartRec {
  id: string;
  brandSlug: string;
  brandName: string;
  category: string;
  gender: string;
  needsData: boolean;
  updatedAt: string;
  updatedBy: string | null;
  rows: ChartRowRec[];
}

export interface ProductRec {
  id: string;
  brandSlug: string;
  brandName?: string;
  category: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  priceInr: number | null;
}

export interface StatsRec {
  brands: number;
  charts: number;
  rows: number;
}

export interface BrandInput {
  name: string;
  categories: string[];
  priority?: number;
  logoUrl?: string;
}

export interface BrandPatch {
  name?: string;
  priority?: number;
  needsData?: boolean;
  logoUrl?: string;
  categories?: string[];
}

export interface ChartInput {
  brandSlug: string;
  category: string;
  gender: string;
  needsData: boolean;
  updatedBy?: string;
  rows: ChartRowRec[];
}

export interface ProductInput {
  brandSlug: string;
  category: string;
  name: string;
  priceInr?: number | null;
  imageUrl?: string | null;
}

export interface DataSource {
  name: string;
  listBrands(): Promise<BrandRec[]>;
  getBrandBySlug(slug: string): Promise<BrandRec | null>;
  getChart(
    brandSlug: string,
    category: string,
    gender: string
  ): Promise<ChartRec | null>;
  listCharts(): Promise<ChartRec[]>;
  getChartAvailability(category: string): Promise<Record<string, string[]>>;
  listProducts(brandSlug?: string, category?: string): Promise<ProductRec[]>;
  getStats(): Promise<StatsRec>;
  createBrand(input: BrandInput): Promise<{ brand?: BrandRec; error?: string }>;
  updateBrand(slug: string, patch: BrandPatch): Promise<BrandRec | null>;
  deleteBrand(slug: string): Promise<void>;
  upsertChart(input: ChartInput): Promise<{ chartId: string; rowCount: number }>;
  createProduct(input: ProductInput): Promise<ProductRec>;
  deleteProduct(id: string): Promise<void>;
}
