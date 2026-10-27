import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [['/about', 'ABOUT'], ['/service', 'SERVICES'], ['/menu', 'MENU'], ['/gallery', 'GALLERY']];
export default function InteractiveHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const home = pathname === '/';
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);
  useEffect(() => {
    const escape = e => { if (e.key === 'Escape') { setOpen(false); document.querySelector('.ix-menu-button')?.focus(); } };
    if (open) window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);
  return <header className={`ix-header ${home ? 'ix-header-home' : ''} ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
    <Link to="/" className="ix-logo" aria-label="ARO 홈"><img src={`${process.env.PUBLIC_URL}/images/aro-logo.png`} alt="ARO" /></Link>
    <nav className="ix-desktop-nav" aria-label="주 메뉴">{links.map(([to, label]) => <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined}>{label}</Link>)}</nav>
    <Link to="/contact" className="ix-header-quote">PLAN YOUR EVENT <span aria-hidden="true">↗</span></Link>
    <button className="ix-menu-button" type="button" aria-label={open ? '메뉴 닫기' : '메뉴 열기'} aria-expanded={open} aria-controls="ix-mobile-nav" onClick={() => setOpen(!open)}><span/><span/></button>
    <nav id="ix-mobile-nav" className="ix-mobile-nav" aria-label="모바일 메뉴" hidden={!open}>{[...links, ['/journal', 'JOURNAL'], ['/process', 'PROCESS'], ['/contact', 'CONTACT']].map(([to, label]) => <Link to={to} key={to}>{label}<span aria-hidden="true">↗</span></Link>)}</nav>
  </header>;
}
