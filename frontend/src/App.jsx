import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Sites from './pages/Sites/Sites'
import SiteDetail from './pages/SiteDetail/SiteDetail'
import About from './pages/About/About'
import Stats from './pages/Stats/Stats'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/site/:domain" element={<SiteDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
