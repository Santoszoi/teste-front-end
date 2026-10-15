import type { Product } from '../types/product';
import { formatCurrency } from '../utils';

type Props = { product: Product; onSelect: (product: Product) => void };

export function ProductCard({ product, onSelect }: Props) {
  return (
    <article className="product-card">
      <button className="product-card__main" type="button" onClick={() => onSelect(product)} aria-label={`Ver detalhes de ${product.name}`}>
        <div className="product-card__picture">
          {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <span aria-hidden="true">Imagem indisponível</span>}
        </div>
        <div className="product-card__body">
          <h3>{product.name}</h3>
          {product.previousPrice && <span className="product-card__old">{formatCurrency(product.previousPrice)}</span>}
          <strong className="product-card__price">{formatCurrency(product.price)}</strong>
          <p>ou em até 10x sem juros</p>
          <span className="product-card__shipping">Frete grátis</span>
        </div>
      </button>
      <button className="button button--primary product-card__buy" type="button" onClick={() => onSelect(product)}>COMPRAR</button>
    </article>
  );
}
