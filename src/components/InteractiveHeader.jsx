import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [['/about', 'About'], ['/service', 'Services'], ['/menu', 'Menu'], ['/gallery', 'Events'], ['/journal', 'Journal'], ['/process', 'Process'], ['/contact', 'Contact']];
export default function InteractiveHeader({ onMenuChange }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const home = pathname === '/';
  const toggle = useRef(null);
  const drawer = useRef(null);
  const close = useRef(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 40);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => { onMenuChange?.(open); }, [open, onMenuChange]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    close.current?.focus();
    const keys = event => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
      if (event.key === 'Tab') {
        const items = drawer.current.querySelectorAll('a,button');
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', keys);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', keys); };
  }, [open]);
  const closeMenu = () => { setOpen(false); toggle.current?.focus(); };
  return <header className={`ix-header${open ? ' is-open' : ''}${scrolled ? ' is-scrolled' : ''}`}>
    <Link to="/" className="ix-logo" aria-label="ARO 홈"><img src={`${process.env.PUBLIC_URL}/images/aro-logo.png`} alt="ARO" /></Link>
    {!home && <nav className="ix-desktop-nav" aria-label="주 메뉴">{links.slice(0,4).map(([to, label]) => <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined}>{label.toUpperCase()}</Link>)}</nav>}
    <Link to="/contact" className="ix-header-quote">{home ? '문의하기' : 'PLAN YOUR EVENT'} <span aria-hidden="true">↗</span></Link>
    <button ref={toggle} className="ix-menu-button" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="ix-site-menu" onClick={() => setOpen(!open)}><span/><span/></button>
    <button className="ix-drawer-backdrop" type="button" aria-label="메뉴 바깥 영역 닫기" hidden={!open} onClick={closeMenu} tabIndex={-1} />
    <div className="ix-drawer" id="ix-site-menu" ref={drawer} role="dialog" aria-modal="true" aria-label="사이트 메뉴" hidden={!open}>
      <button ref={close} className="ix-drawer-close" type="button" onClick={closeMenu} aria-label="사이트 메뉴 닫기">×</button>
      <p className="ix-drawer-title">aro</p>
      <nav aria-label="전체 메뉴">{links.map(([to, label]) => <Link to={to} key={to} onClick={() => setOpen(false)} aria-current={pathname === to ? 'page' : undefined}>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
      <p className="ix-drawer-footer">CATERING & EVENTS</p>
    </div>
  </header>;
}
