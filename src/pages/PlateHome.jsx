import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/InteractiveHeader';

const dishes = [
  { title: 'Signature steak', image: 'steak-white', alt: '흰색 접시에 담은 스테이크와 감자 퓌레, 브라운 소스' },
  { title: 'Seasonal fish', image: 'fish', alt: '제철 생선과 오르조를 소스에 담은 흰색 접시' },
  { title: 'Fresh pasta', image: 'pasta', alt: '치즈와 허브를 올린 리가토니 파스타 접시' },
  { title: 'Garden salad', image: 'salad', alt: '싱싱한 채소와 토마토, 크루통을 담은 샐러드 접시' },
  { title: 'Butter shrimp', image: 'shrimp', alt: '새우와 완두콩을 버터 소스에 담은 흰색 접시' },
];

export default function PlateHome() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const stage = useRef(null);
  const invitation = useRef(null);
  const touch = useRef(null);
  const select = useCallback((index, dir = 1) => {
    setDirection(dir);
    setActive((index + dishes.length) % dishes.length);
  }, []);
  const next = useCallback(delta => {
    setDirection(delta);
    setActive(value => (value + delta + dishes.length) % dishes.length);
  }, []);

  return <div className="plate-home">
    <Header onMenuChange={setMenuOpen} />
    <main inert={menuOpen ? true : undefined}>
    <section className="plate-stage" ref={stage}
      aria-label="ARO 시그니처 메뉴" aria-roledescription="캐러셀" tabIndex={0}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          if (event.key === 'Home') select(0);
          else if (event.key === 'End') select(dishes.length - 1);
          else next(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}
      onTouchStart={event => { if (event.touches.length === 1) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={event => {
        if (!touch.current || !event.changedTouches.length) return;
        const end = event.changedTouches[0];
        const x = touch.current.x - end.clientX; const y = touch.current.y - end.clientY;
        if (Math.abs(x) > 45 && Math.abs(x) > Math.abs(y) * 1.3) next(x > 0 ? 1 : -1);
        touch.current = null;
      }} onTouchCancel={() => { touch.current = null; }}>

      <div className="plate-copy" aria-live="polite" aria-atomic="true">
        <h1 key={active}>{dishes[active].title}</h1>
        <p className="plate-count"><span>{String(active + 1).padStart(2, '0')}</span><span aria-hidden="true"> / </span><span>{String(dishes.length).padStart(2, '0')}</span></p>
        <div className="plate-arrows">
          <button type="button" onClick={() => next(-1)} aria-label="이전 요리"><span aria-hidden="true">‹</span></button>
          <button type="button" onClick={() => next(1)} aria-label="다음 요리"><span aria-hidden="true">›</span></button>
        </div>
      </div>

      <div className="plate-display">
        <div className="plate-orbit" aria-label="요리 선택">
          {dishes.map((dish, index) => {
            const angle = (-90 + index * 360 / dishes.length) * Math.PI / 180;
            return <button key={dish.image} className={`plate-dot${active === index ? ' is-selected' : ''}`} style={{left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%`}} type="button" aria-label={`${dish.title} 보기`} aria-pressed={active === index} onClick={() => select(index, index >= active ? 1 : -1)}><span/></button>;
          })}
        </div>
        <div className={`plate-object ${direction < 0 ? 'from-previous' : 'from-next'}`}>
          {dishes.map((dish, index) => <img key={dish.image} src={`${process.env.PUBLIC_URL}/images/plates/${dish.image}.png`} alt={dish.alt} className={`plate-photo${active === index ? ' is-active' : ''}`} aria-hidden={active !== index} fetchPriority={index === 0 ? 'high' : 'auto'} draggable="false" />)}
        </div>
      </div>

      <button className="plate-scroll" type="button" onClick={() => {
        invitation.current?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
        invitation.current?.focus({preventScroll: true});
      }} aria-label="아래 행사 문의 영역으로 이동"><span>SCROLL TO DISCOVER</span><span className="plate-scroll-arrow" aria-hidden="true">↓</span></button>
      <nav className="plate-bottom-nav" aria-label="빠른 메뉴"><Link to="/menu">MENU</Link><span aria-hidden="true"/><Link to="/gallery">EVENTS</Link></nav>
    </section>
    <section className="ix-invitation plate-invitation" ref={invitation} tabIndex={-1} aria-labelledby="plate-invitation-title">
      <img src={`${process.env.PUBLIC_URL}/images/main/table2.png`} alt="초록 식물과 흰 테이블보로 꾸민 ARO 행사 식탁" loading="lazy" />
      <div><span className="ix-micro">YOUR NEXT BEAUTIFUL GATHERING</span><h2 id="plate-invitation-title">Let’s set<br/><em>the table.</em></h2><Link to="/contact" className="ix-text-link">REQUEST A QUOTE <span aria-hidden="true">↗</span></Link></div>
    </section>
    </main>
    <footer className="ix-footer" inert={menuOpen ? true : undefined}><Link to="/" className="ix-footer-wordmark" aria-label="ARO 홈">aro</Link><p>FOOD FOR LASTING MOMENTS</p><nav aria-label="하단 메뉴"><Link to="/journal">JOURNAL</Link><Link to="/contact">CONTACT</Link><a href="https://www.instagram.com/atelieraro/" target="_blank" rel="noreferrer">INSTAGRAM ↗</a></nav><span>© {new Date().getFullYear()} ARO CATERING & EVENTS</span></footer>
  </div>;
}
