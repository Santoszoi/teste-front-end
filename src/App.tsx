import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, CreditCard, Heart, Menu, Search, ShieldCheck, ShoppingCart, Truck, UserRound, X } from 'lucide-react';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { fetchProducts } from './services/products';
import type { Product } from './types/product';
import './styles.scss';

const categories = ['Todas Categorias', 'Supermercado', 'Livros', 'Moda', 'Lançamentos', 'Ofertas do dia', 'Assinatura'];
const productTabs = ['celular', 'acessórios', 'tablets', 'NOTEBOOKS', 'TVs', 'Ver todos'];
const shoppingCategories = ['Tecnologia', 'Supermercado', 'Bebidas', 'Ferramentas', 'Saúde', 'Esportes e Fitness', 'Moda'];

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas Categorias');
  const [menuOpen, setMenuOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    fetchProducts(controller.signal)
      .then((data) => { if (!controller.signal.aborted) { setProducts(data); setStatus('success'); } })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : 'Ocorreu um erro ao carregar os produtos.');
        setStatus('error');
      });
    return () => controller.abort();
  }, [retry]);

  const filtered = useMemo(() => products.filter((product) => {
    const matchesSearch = `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'));
    const matchesCategory = activeCategory === 'Todas Categorias' || product.category?.toLocaleLowerCase('pt-BR') === activeCategory.toLocaleLowerCase('pt-BR');
    return matchesSearch && matchesCategory;
  }), [products, search, activeCategory]);

  const visible = filtered.slice(offset, offset + 8);
  const selectCategory = (category: string) => { setActiveCategory(category); setOffset(0); setMenuOpen(false); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }); };
  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      <header className="site-header">
        <div className="benefits container" aria-label="Benefícios da loja">
          <span><ShieldCheck size={17}/> Compra <strong>100% segura</strong></span>
          <span><Truck size={18}/> <strong>Frete grátis</strong> acima de R$ 200</span>
          <span><CreditCard size={18}/> <strong>Parcele</strong> suas compras</span>
        </div>
        <div className="header-main container">
          <button type="button" className="icon-button mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen}>{menuOpen ? <X/> : <Menu/>}</button>
          <a className="brand" href="#inicio" aria-label="Econverse, início"><span className="brand__mark">e</span><span>econverse<span className="brand__dot">.</span></span></a>
          <form className="search-field" role="search" onSubmit={(event) => { event.preventDefault(); document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }); }}>
            <input aria-label="Buscar produtos" placeholder="O que você está buscando?" value={search} onChange={(event) => { setSearch(event.target.value); setOffset(0); }} />
            <button type="submit" aria-label="Buscar"><Search size={23}/></button>
          </form>
          <div className="header-actions"><a href="#produtos" aria-label="Meus favoritos"><Heart/></a><a href="#produtos" aria-label="Minha conta"><UserRound/></a><a href="#produtos" aria-label="Ver produtos"><ShoppingCart/></a></div>
        </div>
        <nav className={`category-nav ${menuOpen ? 'category-nav--open' : ''}`} aria-label="Navegação principal">
          <div className="container category-nav__inner">{categories.map((category) => <button key={category} className={category === activeCategory ? 'active' : ''} type="button" onClick={() => selectCategory(category)}>{category}</button>)}</div>
        </nav>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="container hero__inner">
            <div className="hero__copy"><h1 id="hero-title">Venha conhecer nossas promoções</h1><p>50% Off nos produtos</p><a className="button button--primary" href="#produtos">Ver produto</a></div>
            <div className="hero__art" aria-hidden="true"><div className="hero__orb"><ShoppingCart strokeWidth={1.25}/></div></div>
          </div>
        </section>

        <section className="shop-categories container" aria-label="Compre por categoria">
          {shoppingCategories.map((category, index) => <button key={category} type="button" onClick={() => selectCategory(category)} className="shop-category"><span className="shop-category__icon" aria-hidden="true">{['⌨', '▣', '◉', '⚒', '✚', '◈', '♧'][index]}</span><span>{category}</span></button>)}
        </section>

        <section className="catalog container" id="produtos" aria-labelledby="catalog-title">
          <div className="section-heading"><h2 id="catalog-title">Produtos relacionados</h2><button type="button" className="see-all" onClick={() => { setActiveCategory('Todas Categorias'); setSearch(''); setOffset(0); }}>Ver todos</button></div>
          <div className="catalog__tabs" aria-label="Navegar por tipos de produtos">{productTabs.map((tab) => <button key={tab} type="button" className={activeCategory.toLowerCase() === tab.toLowerCase() ? 'active' : ''} onClick={() => selectCategory(tab === 'Ver todos' ? 'Todas Categorias' : tab)}>{tab}</button>)}</div>
          {status === 'loading' && <div className="product-grid" role="status" aria-label="Carregando produtos">{Array.from({ length: 8 }, (_, index) => <div className="product-skeleton" key={index}><div/><span/><span/><span/></div>)}</div>}
          {status === 'error' && <div className="catalog-state" role="alert"><h3>Não foi possível carregar a vitrine</h3><p>{error}</p><button type="button" className="button button--primary" onClick={() => setRetry((value) => value + 1)}>TENTAR NOVAMENTE</button></div>}
          {status === 'success' && (filtered.length ? <><div className="product-grid">{visible.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelected}/>)}</div><div className="catalog__pagination"><span>Exibindo {Math.min(offset + 1, filtered.length)}–{Math.min(offset + 8, filtered.length)} de {filtered.length} produtos</span><div><button type="button" aria-label="Página anterior" disabled={offset === 0} onClick={() => setOffset((value) => Math.max(0, value - 8))}><ChevronLeft/></button><button type="button" aria-label="Próxima página" disabled={offset + 8 >= filtered.length} onClick={() => setOffset((value) => value + 8)}><ChevronRight/></button></div></div></> : <div className="catalog-state"><h3>Nenhum produto encontrado</h3><p>Tente outra busca ou selecione uma categoria diferente.</p><button type="button" className="button button--primary" onClick={() => { setSearch(''); setActiveCategory('Todas Categorias'); }}>LIMPAR FILTROS</button></div>)}
        </section>

        <section className="newsletter" id="atendimento"><div className="container newsletter__inner"><div><h2>Receba nossas novidades!</h2><p>Cadastre-se para acompanhar ofertas e lançamentos.</p></div><a href="#produtos" className="button button--light">VER OFERTAS <ChevronDown size={18}/></a></div></section>
      </main>
      <footer className="site-footer"><div className="container"><a className="brand" href="#inicio"><span className="brand__mark">e</span><span>econverse<span className="brand__dot">.</span></span></a><p>Uma experiência de compra feita para você.</p><small>Projeto demonstrativo de desenvolvimento Front-End.</small></div></footer>
      {selected && <ProductModal product={selected} onClose={closeModal} />}
    </>
  );
}
