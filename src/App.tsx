import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SectionProblem from './components/SectionProblem'
import SectionSolution from './components/SectionSolution'
import SectionBenefits from './components/SectionBenefits'
import UploadSection from './components/UploadSection'
import SectionTeam from './components/SectionTeam'
import MultiFileResultsViewer from './components/MultiFileResultsViewer'
import SectionContact from './components/SectionContact'
import Footer from './components/Footer'
import { useState } from 'react'
import type { FileAnalysisResult } from './types'
import Reveal from './components/Reveal'

export default function App() {
  const [results, setResults] = useState<FileAnalysisResult[]>([])

  return (
    <div className="min-h-screen flex flex-col bg-background text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SectionProblem />
        <SectionSolution />
        <SectionBenefits />
        <section id="demo" className="container mx-auto px-4 py-24 relative section-fade-bottom">
          <Reveal className="glass rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl md:text-3xl font-bold">Demo / Upload & Analyze</h2>
            <p className="text-subtle mt-2">Upload PDF or image files and get instantly annotated results. Multiple files supported!</p>
            <div className="mt-6">
              <UploadSection onAnalyzed={setResults} />
            </div>
            {results.length > 0 && (
              <div className="mt-8">
                <MultiFileResultsViewer results={results} />
              </div>
            )}
          </Reveal>
        </section>
        <SectionTeam />
        <SectionContact />
      </main>
      <Footer />
    </div>
  )
}
