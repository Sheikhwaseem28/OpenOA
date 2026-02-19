import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import AnalysisForm from './components/AnalysisForm'

function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center p-4">
                <section id="analysis" className="w-full max-w-5xl mx-auto">
                    <AnalysisForm />
                </section>
            </main>
        </div>
    )
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    )
}

export default App
