import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/InteractiveHeader';

const asset = name => `${process.env.PUBLIC_URL}/images/${name}`;
const dishes = [
  { image: 'menu/fish.png', title: 'Seasonal Fish', detail: '제철 생선과 오르조, 깊이 있는 소스', category: 'THE SEASONAL PLATE' },
  { image: 'menu/pasta.png', title: 'Fresh Pasta', detail: '계절의 재료와 허브를 담은 파스타', category: 'A LITTLE INDULGENCE' },
  { image: 'menu/salad.png', title: 'Garden Salad', detail: '싱그러운 채소와 섬세한 드레싱', category: 'FRESH FROM THE GARDEN' },
];
const events = [
  { image: 'gallery/wedding-table-01.png', title: 'Weddings', subtitle: '두 사람만의 이야기를 담은 식탁', to: '/gallery?category=WEDDING' },
  { image: 'gallery/brand-event.png', title: 'Brand Events', subtitle: '브랜드의 감각을 전하는 순간', to: '/gallery?category=BRAND%20EVENT' },
  { image: 'services/private event.png', title: 'Private Dining', subtitle: '가까운 사람들과 나누는 특별한 시간', to: '/gallery?category=PRIVATE' },
  { image: 'gallery/corporate-galadinner.png', title: 'Corporate', subtitle: '사람과 비즈니스가 만나는 자리', to: '/gallery?category=CORPORATE' },
];
const faqs = [
  ['어떤 행사를 상담할 수 있나요?', '웨딩, 기업 행사, 브랜드 이벤트와 프라이빗 다이닝을 상담합니다. 행사 유형과 일정, 장소를 알려주세요.'],
  ['메뉴는 어떻게 정하나요?', '계절의 재료와 공간, 인원, 원하는 분위기를 함께 살펴 메뉴를 제안합니다. 메뉴 페이지에서 스타일을 먼저 확인하실 수 있습니다.'],
  ['상담 전에 무엇을 준비하면 좋을까요?', '예정일, 장소, 예상 인원과 원하시는 분위기를 알려주시면 상담에 도움이 됩니다. 세부 사항은 함께 정할 수 있습니다.'],
];

function EventRail() {
  const rail = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const measure = () => {
    const el = rail.current;
    if (el) setProgress(el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth));
  };
  const down = e => {
    suppressClick.current = false;
    if (e.pointerType === 'mouse' && e.button === 0) drag.current = { x: e.clientX, left: rail.current.scrollLeft, moved: false };
  };
  const move = e => {
    const d = drag.current;
    if (!d) return;
    if (Math.abs(e.clientX - d.x) > 6) { d.moved = true; suppressClick.current = true; setDragging(true); rail.current.scrollLeft = d.left - (e.clientX - d.x); }
  };
  useEffect(() => {
    const up = () => { drag.current = null; setDragging(false); };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, []);
  const slide = direction => rail.current.scrollBy({ left: direction * rail.current.clientWidth * .55, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return <>
    <div className={`ix-event-rail ${dragging ? 'is-dragging' : ''}`} ref={rail} onScroll={measure} onPointerDown={down} onPointerMove={move} onClickCapture={e => { if (suppressClick.current && e.detail !== 0) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}>
      {events.map((event, i) => <Link className="ix-event" to={event.to} key={event.title} draggable="false" onDragStart={e => e.preventDefault()}>
        <div className="ix-event-photo"><img src={asset(event.image)} alt={event.subtitle} loading="lazy" draggable="false" /><span className="ix-event-arrow" aria-hidden="true">↗</span></div>
        <div className="ix-event-caption"><span className="ix-event-number">0{i + 1}</span><h3>{event.title}</h3></div><p>{event.subtitle}</p>
      </Link>)}
    </div>
    <div className="ix-rail-controls"><button type="button" onClick={() => slide(-1)} aria-label="이전 행사 보기">←</button><div><div className="ix-rail-track"><span style={{ transform: `translateX(${progress * 200}%)` }}/></div><span className="ix-micro">DRAG TO EXPLORE</span></div><button type="button" onClick={() => slide(1)} aria-label="다음 행사 보기">→</button></div>
  </>;
}

export default function InteractiveHome() {
  const [active, setActive] = useState(0);
  const [cursor, setCursor] = useState(null);
  const page = useRef(null);
  const hero = useRef(null);
  const pointerFrame = useRef(null);
  const dish = dishes[active];
  useEffect(() => {
    const items = page.current.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    items.forEach(item => observer.observe(item));
    return () => { observer.disconnect(); if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current); };
  }, []);
  const next = delta => setActive(value => (value + delta + dishes.length) % dishes.length);
  const pointer = e => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      hero.current?.style.setProperty('--dish-x', `${(x / rect.width - .5) * 18}px`);
      hero.current?.style.setProperty('--dish-y', `${(y / rect.height - .5) * 14}px`);
      setCursor({ x, y });
    });
  };
  return <div className="ix-page" ref={page}>
    <Header />
    <main>
      <section className="ix-hero" ref={hero} aria-labelledby="ix-title" onPointerMove={pointer} onPointerLeave={() => { setCursor(null); hero.current?.style.setProperty('--dish-x', '0px'); hero.current?.style.setProperty('--dish-y', '0px'); }}>
        <div className="ix-hero-texture" aria-hidden="true" />
        <div className="ix-hero-image" key={dish.image}><img src={asset(dish.image)} alt={dish.detail} fetchPriority="high" /></div>
        <div className="ix-hero-copy"><p className="ix-micro">THOUGHTFULLY MADE. BEAUTIFULLY SHARED.</p><h1 id="ix-title">Taste the<br/><em>occasion.</em></h1><p className="ix-hero-korean">당신의 순간에 어울리는 한 접시</p><Link to="/menu" className="ix-text-link">DISCOVER OUR MENU <span aria-hidden="true">↗</span></Link></div>
        {cursor && <span className="ix-cursor" aria-hidden="true" style={{ left: cursor.x, top: cursor.y }}>TASTE<br/>↗</span>}
        <a className="ix-scroll-cue" href="#occasions"><span className="ix-micro">SCROLL TO DISCOVER</span><span aria-hidden="true">↓</span></a>
        <div className="ix-dish-controls"><div className="ix-dish-label" aria-live="polite"><span className="ix-micro">{dish.category}</span><span>{dish.title}</span></div><div className="ix-slide-buttons"><button type="button" onClick={() => next(-1)} aria-label="이전 요리">←</button><span className="ix-counter">0{active + 1}<span> / 03</span></span><button type="button" onClick={() => next(1)} aria-label="다음 요리">→</button></div></div>
      </section>

      <section className="ix-occasions" id="occasions" aria-labelledby="ix-occasions-title">
        <div className="ix-section-heading" data-reveal><span className="ix-micro">FOR EVERY OCCASION</span><h2 id="ix-occasions-title">Made for <em>your moment.</em></h2><p>좋은 음식과 섬세한 준비로, 오래 기억될 자리를 만듭니다.</p></div>
        <EventRail />
      </section>

      <section className="ix-story" aria-labelledby="ix-story-title"><div className="ix-story-image" data-reveal><img src={asset('main/table.png')} alt="ARO 메뉴 카드와 올리브 가지로 준비한 테이블" loading="lazy" /></div><div className="ix-story-copy" data-reveal><span className="ix-micro">THE ARO WAY</span><h2 id="ix-story-title">More than a meal.<br/><em>A memory.</em></h2><p>음식과 공간, 그리고 사람.<br/>그 사이에 흐르는 이야기를 식탁에 담습니다.</p><p>계절을 담은 메뉴와 세심한 서비스로<br/>당신의 순간을 오래도록 아로새깁니다.</p><Link to="/about" className="ix-text-link">OUR STORY <span aria-hidden="true">↗</span></Link></div></section>

      <section className="ix-faq" aria-labelledby="ix-faq-title"><div data-reveal><span className="ix-micro">A FEW THINGS TO KNOW</span><h2 id="ix-faq-title">Before we<br/><em>set the table.</em></h2><Link to="/process" className="ix-text-link">HOW IT WORKS <span aria-hidden="true">↗</span></Link></div><div className="ix-faq-list" data-reveal>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="ix-invitation" aria-labelledby="ix-invitation-title"><img src={asset('main/table2.png')} alt="행사를 위해 정성스럽게 준비한 다이닝 테이블" loading="lazy"/><div data-reveal><span className="ix-micro">YOUR NEXT BEAUTIFUL GATHERING</span><h2 id="ix-invitation-title">Let’s set<br/><em>the table.</em></h2><Link to="/contact" className="ix-text-link">REQUEST A QUOTE <span aria-hidden="true">↗</span></Link></div></section>
    </main>
    <footer className="ix-footer"><Link to="/" className="ix-footer-wordmark" aria-label="ARO 홈">aro</Link><p>FOOD FOR LASTING MOMENTS</p><nav aria-label="하단 메뉴"><Link to="/journal">JOURNAL</Link><Link to="/contact">CONTACT</Link><a href="https://www.instagram.com/atelieraro/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></nav><span>© {new Date().getFullYear()} ARO CATERING & EVENTS</span></footer>
  </div>;
}
