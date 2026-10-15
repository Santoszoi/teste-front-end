import { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../types/product';
import { formatCurrency } from '../utils';

type Props = { product: Product; onClose: () => void };

export function ProductModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const elements = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input:not(:disabled)');
        if (!elements?.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKeyDown); previousFocus?.focus(); };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialog}>
        <button className="modal-close" ref={closeButton} type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={22} /></button>
        <div className="product-modal__picture">{product.image && <img src={product.image} alt={product.name} />}</div>
        <div className="product-modal__details">
          <h2 id="modal-title">{product.name}</h2>
          <strong>{formatCurrency(product.price)}</strong>
          <p className="product-modal__description">{product.description}</p>
          <p className="product-modal__availability">Disponível para consulta</p>
          <div className="product-modal__quantity" aria-label="Quantidade">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade"><Minus size={16}/></button>
            <span aria-live="polite">{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(99, value + 1))} aria-label="Aumentar quantidade"><Plus size={16}/></button>
          </div>
          <p className="product-modal__total">Total: <strong>{formatCurrency(product.price * quantity)}</strong></p>
          <button className="button button--primary" type="button" onClick={onClose}>CONTINUAR NAVEGANDO</button>
          <span className="product-modal__note">Vitrine demonstrativa, sem finalização de compra.</span>
        </div>
      </div>
    </div>
  );
}
