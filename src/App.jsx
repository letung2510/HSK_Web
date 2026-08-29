import { HashRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Vocabulary from './pages/Vocabulary'
import Grammar from './pages/Grammar'
import Flashcard from './pages/Flashcard'
import Quiz from './pages/Quiz'
import Speaking from './pages/Speaking'

function Layout() {
  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-zh">中文</span>
          <span className="brand-name">HSK Việt</span>
        </Link>
        <nav className="site-nav">
          <NavLink to="/vocabulary" className={({ isActive }) => (isActive ? 'active' : '')}>
            Từ vựng
          </NavLink>
          <NavLink to="/grammar" className={({ isActive }) => (isActive ? 'active' : '')}>
            Ngữ pháp
          </NavLink>
          <NavLink to="/flashcard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Flashcard
          </NavLink>
          <NavLink to="/quiz" className={({ isActive }) => (isActive ? 'active' : '')}>
            Quiz
          </NavLink>
          <NavLink to="/speaking" className={({ isActive }) => (isActive ? 'active' : '')}>
            Luyện nói
          </NavLink>
        </nav>
      </header>
      <main className="site-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/flashcard" element={<Flashcard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/speaking" element={<Speaking />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>
          Dữ liệu từ vựng: HSK 2.0 (nguồn mở, CC-CEDICT) · Nghĩa tiếng Việt tự dịch ·
          Học 100% miễn phí
        </p>
      </footer>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}
