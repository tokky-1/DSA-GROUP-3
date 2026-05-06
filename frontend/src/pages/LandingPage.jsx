import { Link } from 'react-router-dom'
import {
  ArrowRight, UploadCloud, Settings, FileDown, Eye,
  Zap, Layers, ShieldCheck, Clock, Star, ChevronRight,
  FileText, Globe, BookOpen,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'AI-Powered Recognition',
    desc: 'Advanced deep learning models detect and transcribe handwriting with industry-leading accuracy, even for difficult scripts.',
  },
  {
    icon: Layers,
    title: 'Batch Processing',
    desc: 'Upload multiple pages at once and convert an entire notebook into a single organized document in one go.',
  },
  {
    icon: FileText,
    title: 'Multiple Output Formats',
    desc: 'Export as PDF for sharing, DOC for editing in Word, or TXT for raw text — your choice, every time.',
  },
  {
    icon: Clock,
    title: 'Instant History',
    desc: 'Every conversion is saved to your browser. Revisit, re-download, or delete past documents at any time.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Your documents never leave your device for storage. History is kept locally in your browser\'s IndexedDB.',
  },
  {
    icon: Globe,
    title: 'Works Everywhere',
    desc: 'Runs entirely in the browser — no installation, no sign-up required. Just open and convert.',
  },
]

const STEPS = [
  {
    num: '01',
    icon: UploadCloud,
    title: 'Upload Your Images',
    desc: 'Drag and drop, browse your files, or snap a photo directly with your camera. Add as many pages as you need.',
  },
  {
    num: '02',
    icon: Settings,
    title: 'Choose Document Structure',
    desc: 'Combine all pages into one multi-page document, or get each image as its own separate file.',
  },
  {
    num: '03',
    icon: FileDown,
    title: 'Select Output Format',
    desc: 'Pick PDF, DOC, or TXT. Your handwriting will be neatly packaged in the format that suits your workflow.',
  },
  {
    num: '04',
    icon: Eye,
    title: 'Preview & Download',
    desc: 'Instantly preview your converted document and download it — or find it again anytime in your History.',
  },
]

const TESTIMONIALS = [
  {
    name: 'Amina Okonkwo',
    role: 'Medical Student',
    text: 'I use ScriptSense to digitize my lecture notes every day. It handles my messy handwriting better than I expected — saves me hours of typing.',
    rating: 5,
  },
  {
    name: 'David Hernandez',
    role: 'Architect',
    text: 'Converting hand-drawn annotations on blueprints to editable text was always a pain. ScriptSense made it effortless.',
    rating: 5,
  },
  {
    name: 'Yuki Tanaka',
    role: 'Journalist',
    text: 'I transcribe interview notes on the go. The camera capture feature is a game changer — directly scan and convert in seconds.',
    rating: 5,
  },
]

const STATS = [
  { value: '98%', label: 'Recognition Accuracy' },
  { value: '9',   label: 'Processing Steps' },
  { value: '3',   label: 'Output Formats' },
  { value: '∞',   label: 'Pages per Batch' },
]

export default function LandingPage() {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 dark:from-brand-900 dark:via-brand-950 dark:to-black min-h-[92vh] flex items-center">
        {/* Decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left */}
          <div className="text-white space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/30 border border-brand-400/30 text-brand-200 text-sm font-medium">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Handwriting Recognition
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Transform Handwriting Into
              <span className="text-brand-300"> Digital Documents</span>
            </h1>
            <p className="text-brand-200 text-lg leading-relaxed max-w-lg">
              Upload photos of handwritten notes, letters, or entire notebooks.
              Our AI detects lines, recognises text, and exports clean, editable documents in seconds.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/app" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 dark:bg-white dark:hover:bg-brand-50 text-base px-6 py-3">
                Try It Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-secondary bg-transparent border-brand-400/40 text-brand-100 hover:bg-brand-600/40 dark:bg-transparent dark:border-brand-600 dark:text-brand-200 text-base px-6 py-3">
                See How It Works
              </a>
            </div>
          </div>

          {/* Right — mock UI illustration */}
          <div className="hidden lg:flex justify-center animate-slide-up">
            <div className="relative w-80">
              {/* Fake app card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-auto text-brand-200 text-xs">ScriptSense</span>
                </div>
                {/* Fake image area */}
                <div className="bg-brand-600/30 rounded-xl h-40 flex items-center justify-center border-2 border-dashed border-brand-400/40">
                  <div className="text-center">
                    <UploadCloud className="w-8 h-8 text-brand-300 mx-auto mb-1" />
                    <p className="text-brand-300 text-xs">3 images loaded</p>
                  </div>
                </div>
                {/* Fake progress */}
                <div className="space-y-2">
                  {['Correcting orientation', 'Segmenting lines', 'Extracting text'].map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${i < 2 ? 'bg-green-400' : 'bg-brand-300 animate-pulse'}`} />
                      <span className="text-brand-200 text-xs">{s}</span>
                    </div>
                  ))}
                </div>
                {/* Fake output */}
                <div className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-300" />
                  <span className="text-brand-200 text-xs flex-1">handwriting_converted.pdf</span>
                  <span className="text-green-400 text-xs font-medium">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-600 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-brand-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-brand-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-heading">Everything You Need</h2>
          <p className="section-sub">
            From a single sticky note to a full journal — ScriptSense handles it all with precision.
          </p>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div key={f.title} className="card p-6 hover:shadow-md hover:border-brand-200 dark:hover:border-gray-700 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="font-semibold text-brand-800 dark:text-brand-100 mb-2">{f.title}</h3>
                  <p className="text-brand-500 dark:text-brand-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-sub">Four simple steps from photo to polished document.</p>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-brand-200 dark:bg-brand-700 z-0" />

            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-brand-200 dark:shadow-brand-900">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-brand-400 dark:text-brand-500 tracking-widest mb-1">STEP {step.num}</span>
                  <h3 className="font-semibold text-brand-800 dark:text-brand-100 mb-2">{step.title}</h3>
                  <p className="text-brand-500 dark:text-brand-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <BookOpen className="w-12 h-12 text-brand-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Digitize Your Handwriting?
          </h2>
          <p className="text-brand-200 text-lg mb-8">
            No sign-up. No installation. Just upload and convert — completely free.
          </p>
          <Link to="/app" className="btn-primary bg-white text-brand-700 hover:bg-brand-50 text-base px-8 py-3">
            Start Converting
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-900 dark:bg-black py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-brand-100 font-semibold">ScriptSense</span>
          </div>
          <nav className="flex gap-5 text-sm text-brand-400">
            <Link to="/" className="hover:text-brand-200 transition-colors">Home</Link>
            <Link to="/app" className="hover:text-brand-200 transition-colors">Convert</Link>
            <Link to="/history" className="hover:text-brand-200 transition-colors">History</Link>
          </nav>
          <p className="text-brand-500 text-xs">© {new Date().getFullYear()} ScriptSense. DSA Group 3.</p>
        </div>
      </footer>
    </div>
  )
}
