import { describe, expect, it } from 'vitest';
import { normalizeProducts, parsePrice } from './products';

describe('catálogo de produtos', () => {
  it('converte preços em reais', () => {
    expect(parsePrice('R$ 1.299,90')).toBe(1299.9);
    expect(parsePrice(39.5)).toBe(39.5);
    expect(parsePrice('1.299')).toBe(1299);
  });

  it('normaliza a estrutura do catálogo da vitrine', () => {
    expect(normalizeProducts({ products: [{ productName: 'Fone Bluetooth', photo: '/fone.png', price: 199.9 }] }))
      .toMatchObject([{ name: 'Fone Bluetooth', image: '/fone.png', price: 199.9 }]);
  });

  it('rejeita respostas inesperadas', () => {
    expect(() => normalizeProducts({ invalid: [] })).toThrow('formato');
  });
});
