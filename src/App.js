import { Routes, Route } from 'react-router-dom';
import Home from './pages/InteractiveHome';
import About from './pages/About';
import Service from './pages/Service';
import Gallery from './pages/Gallery';
import Menu from './pages/Menu';
import Process from './pages/Process';
import Journal from './pages/Journal';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/service" element={<Service />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/process" element={<Process />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<div style={{ padding: '200px 40px', textAlign: 'center' }}>페이지를 찾을 수 없습니다.</div>} />
    </Routes>
  );
}

export default App;
