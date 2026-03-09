
import axios from 'axios';
import { API_BASE_URL } from '@/constants';

export interface Sheet {
    id: string;
    path: string;
    name: string;
    thumbnail?: string;
    category?: string;
    description?: string;
}

export interface PaginationInfo {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface SheetsResponse {
    sheets: Sheet[];
    pagination: PaginationInfo;
}

const BASE_API_URL = `${API_BASE_URL}/areas/products`;
const CACHE_KEY_PREFIX = 'sheets_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch sheets from API with pagination
 * Includes caching mechanism to reduce API calls
 */
export async function fetchSheets(slug?: string, page: number = 1, useCache: boolean = true): Promise<SheetsResponse> {
    // If no slug is provided, return empty response
    if (!slug) {
        return {
            sheets: [],
            pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 6,
                total: 0
            }
        };
    }

    const cacheKey = `${slug}_page_${page}`;

    // Check cache first
    if (useCache) {
        const cached = getCachedSheetsWithPagination(cacheKey);
        if (cached) {
            return cached;
        }
    }

    // Fetch from API
    try {
        const response = await axios.post(`${BASE_API_URL}?page=${page}`, {
            slugs: [slug]
        });
        const data = response.data;

        let sheets: any[] = [];
        let pagination: PaginationInfo = {
            current_page: 1,
            last_page: 1,
            per_page: 6,
            total: 0
        };

        // Handle different response formats
        if (Array.isArray(data)) {
            sheets = data;
        } else if (data.sheets && Array.isArray(data.sheets)) {
            sheets = data.sheets;
            if (data.pagination) {
                pagination = data.pagination;
            }
        } else if (data.data && Array.isArray(data.data)) {
            sheets = data.data;
            if (data.pagination) {
                pagination = data.pagination;
            }
        } else {
            // As a fallback, let's wrap it if it looks like a single sheet.
            sheets = data ? [data] : [];
        }

        // Validate/Map response to Sheet interface if necessary
        const mappedSheets: Sheet[] = sheets.map((item: any) => ({
            id: String(item.id) || String(Math.random()),
            path: item.image, // Mapped 'image' to 'path'
            name: item.title || 'Untitled Sheet', // Mapped 'title' to 'name'
            thumbnail: item.image, // Mapped 'image' to 'thumbnail'
        })).filter(item => item.path); // Ensure path exists

        const result: SheetsResponse = {
            sheets: mappedSheets,
            pagination: pagination
        };

        // Cache the result
        cacheSheetsWithPagination(cacheKey, result);

        return result;
    } catch (error) {
        console.error(`Error fetching sheets for slug "${slug}" page ${page} from API:`, error);
        return {
            sheets: [],
            pagination: {
                current_page: page,
                last_page: page,
                per_page: 6,
                total: 0
            }
        };
    }
}

/**
 * Get cached sheets if available and not expired
 * @deprecated Use getCachedSheetsWithPagination instead
 */
function getCachedSheets(cacheKey: string): Sheet[] | null {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error(`Error reading cache for key "${cacheKey}":`, error);
        return null;
    }
}

/**
 * Get cached sheets with pagination if available and not expired
 */
function getCachedSheetsWithPagination(cacheKey: string): SheetsResponse | null {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        // Check if cache is still valid
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
        }

        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
    } catch (error) {
        console.error(`Error reading cache for key "${cacheKey}":`, error);
        return null;
    }
}

/**
 * Cache sheets data
 * @deprecated Use cacheSheetsWithPagination instead
 */
function cacheSheets(cacheKey: string, sheets: Sheet[]): void {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        localStorage.setItem(key, JSON.stringify({
            data: sheets,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error(`Error caching sheets for key "${cacheKey}":`, error);
    }
}

/**
 * Cache sheets data with pagination
 */
function cacheSheetsWithPagination(cacheKey: string, response: SheetsResponse): void {
    try {
        const key = `${CACHE_KEY_PREFIX}${cacheKey}`;
        localStorage.setItem(key, JSON.stringify({
            data: response,
            timestamp: Date.now(),
        }));
    } catch (error) {
        console.error(`Error caching sheets for key "${cacheKey}":`, error);
    }
}

/**
 * Clear sheets cache
 */
export function clearSheetsCache(slug?: string): void {
    const prefix = slug ? `${CACHE_KEY_PREFIX}${slug}` : CACHE_KEY_PREFIX;

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(prefix)) {
            localStorage.removeItem(key);
        }
    });
}

/**
 * Refresh sheets (bypass cache)
 */
export async function refreshSheets(slug: string): Promise<SheetsResponse> {
    clearSheetsCache(slug);
    return fetchSheets(slug, 1, false);
}
