const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  regularPrice: string | number;  // API returns string
  salePrice: string | number | null;  // API returns string or null
  isFeatured: boolean;
  status: string;
  weightKg: number | null;
  lengthCm: number | null;
  widthCm: number | null;
  media: ProductMedia[];
  variants: ProductVariant[];
  createdAt?: string;
}

export interface ProductMedia {
  id: string;
  url: string;
  altText: string | null;
  type: string;
  isMain: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stockQty: number;
  regularPrice: number | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  status: string;
}

export async function getProducts(limit?: number): Promise<Product[]> {
  try {
    const url = new URL(`${API_URL}/storefront/products`);
    if (limit) url.searchParams.append('limit', limit.toString());

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    
    // Handle API response structure: { success: true, data: { items: [...], total: 5 } }
    if (data.success && data.data && Array.isArray(data.data.items)) {
      return data.data.items;
    }
    
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/storefront/categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    
    // Handle API response structure: { success: true, data: [...] }
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function getStorefrontCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/storefront/categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Failed to fetch storefront categories:', error);
    return [];
  }
}
