import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/InteractiveHeader';

const dishes = [
  { title: 'Seasonal fish', image: 'fish', alt: '제철 생선과 오르조를 오렌지빛 소스에 담은 접시' },
  { title: 'Fresh pasta', image: 'pasta', alt: '치즈와 허브를 올린 리가토니 파스타 접시' },
  { title: 'Garden salad', image: 'salad', alt: '싱싱한 채소와 토마토, 크루통을 담은 샐러드 접시' },
];

export default function PlateHome() {
  const [active, setActive] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [direction, setDirection] = useState(1);
  const stage = useRef(null);
  const wheel = useRef({ time: 0, total: 0, changed: 0 });
  const touch = useRef(null);
  const select = useCallback((index, dir = 1) => {
    setDirection(dir);
    setActive((index + dishes.length) % dishes.length);
  }, []);
  const next = useCallback(delta => {
    setDirection(delta);
    setActive(value => (value + delta + dishes.length) % dishes.length);
  }, []);

  useEffect(() => {
    const element = stage.current;
    const scroll = event => {
      if (menuOpen || event.ctrlKey || Math.abs(event.deltaY) < 2) return;
      event.preventDefault();
      const now = performance.now();
      const state = wheel.current;
      if (now - state.changed < 850) return;
      if (now - state.time > 180 || Math.sign(state.total) !== Math.sign(event.deltaY)) state.total = 0;
      state.time = now;
      state.total += event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (Math.abs(state.total) >= 55) {
        next(state.total > 0 ? 1 : -1);
        state.total = 0;
        state.changed = now;
      }
    };
    element.addEventListener('wheel', scroll, { passive: false });
    return () => element.removeEventListener('wheel', scroll);
  }, [menuOpen, next]);

  return <div className="plate-home">
    <Header onMenuChange={setMenuOpen} />
    <main className="plate-stage" ref={stage} inert={menuOpen ? true : undefined}
      aria-label="ARO 시그니처 메뉴" aria-roledescription="캐러셀" tabIndex={0}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          if (event.key === 'Home') select(0);
          else if (event.key === 'End') select(dishes.length - 1);
          else next(['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1);
        }
      }}
      onTouchStart={event => { if (event.touches.length === 1) touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={event => {
        if (!touch.current || !event.changedTouches.length) return;
        const end = event.changedTouches[0];
        const x = touch.current.x - end.clientX; const y = touch.current.y - end.clientY;
        if (Math.max(Math.abs(x), Math.abs(y)) > 45) next((Math.abs(x) > Math.abs(y) ? x : y) > 0 ? 1 : -1);
        touch.current = null;
      }} onTouchCancel={() => { touch.current = null; }}>

      <div className="plate-copy" aria-live="polite" aria-atomic="true">
        <h1 key={active}>{dishes[active].title}</h1>
        <p className="plate-count"><span>0{active + 1}</span><span aria-hidden="true"> / </span><span>03</span></p>
        <div className="plate-arrows">
          <button type="button" onClick={() => next(-1)} aria-label="이전 요리"><span aria-hidden="true">‹</span></button>
          <button type="button" onClick={() => next(1)} aria-label="다음 요리"><span aria-hidden="true">›</span></button>
        </div>
      </div>

      <div className="plate-display">
        <div className="plate-orbit" aria-label="요리 선택">
          {dishes.map((dish, index) => <button key={dish.image} className={`plate-dot plate-dot-${index}${active === index ? ' is-selected' : ''}`} type="button" aria-label={`${dish.title} 보기`} aria-pressed={active === index} onClick={() => select(index, index >= active ? 1 : -1)}><span/></button>)}
        </div>
        <div className={`plate-object ${direction < 0 ? 'from-previous' : 'from-next'}`}>
          {dishes.map((dish, index) => <img key={dish.image} src={`${process.env.PUBLIC_URL}/images/plates/${dish.image}.png`} alt={dish.alt} className={`plate-photo${active === index ? ' is-active' : ''}`} aria-hidden={active !== index} fetchPriority={index === 0 ? 'high' : 'auto'} draggable="false" />)}
        </div>
      </div>

      <button className="plate-scroll" type="button" onClick={() => next(1)} aria-label="다음 요리 맛보기"><span>SCROLL TO TASTE</span><span className="plate-scroll-arrow" aria-hidden="true">↓</span></button>
      <nav className="plate-bottom-nav" aria-label="빠른 메뉴"><Link to="/menu">MENU</Link><span aria-hidden="true"/><Link to="/gallery">EVENTS</Link></nav>
    </main>
  </div>;
}
