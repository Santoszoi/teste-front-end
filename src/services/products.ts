import type { Product } from '../types/product';

export const PRODUCTS_URL = '/api/produtos';

type RecordValue = Record<string, unknown>;

const isRecord = (value: unknown): value is RecordValue =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const firstString = (...values: unknown[]): string =>
  values.find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim() ?? '';

export function parsePrice(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[^\d,.-]/g, '');
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned.match(/^\d{1,3}(\.\d{3})+$/) ? cleaned.replace(/\./g, '') : cleaned;
  const price = Number(normalized);
  return normalized && Number.isFinite(price) ? price : undefined;
}

export function normalizeProducts(payload: unknown): Product[] {
  const entries = Array.isArray(payload)
    ? payload
    : isRecord(payload)
      ? [payload.products, payload.produtos, payload.items, payload.data].find(Array.isArray)
      : undefined;
  if (!entries) throw new Error('O catálogo retornou um formato de dados inesperado.');

  return entries.flatMap((item: unknown, index: number): Product[] => {
    if (!isRecord(item)) return [];
    const name = firstString(item.productName, item.name, item.nome, item.title);
    const image = firstString(item.photo, item.image, item.imagem, item.imageUrl, item.thumbnail);
    const price = parsePrice(item.price ?? item.preco ?? item.salePrice ?? item.valor);
    if (!name || price === undefined) return [];
    const previousPrice = parsePrice(item.oldPrice ?? item.previousPrice ?? item.precoAntigo ?? item.listPrice);
    return [{
      id: String(item.id ?? item.productId ?? `${index}-${name}`),
      name,
      image,
      price,
      previousPrice: previousPrice && previousPrice > price ? previousPrice : undefined,
      description: firstString(item.descriptionShort, item.description, item.descricao, name),
      category: firstString(item.category, item.categoria),
      installments: firstString(item.installments, item.parcelamento),
    }];
  });
}

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Não foi possível carregar os produtos (HTTP ${response.status}).`);
  const products = normalizeProducts(await response.json());
  if (!products.length) throw new Error('Nenhum produto válido foi encontrado no catálogo.');
  return products;
}
