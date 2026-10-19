import { Sparkles, Layers, CalendarDays, BookMarked, MessageCircle, BookOpen, ArrowUpRight } from "lucide-react"

function Home({ setScreen }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">

      {/* Hero */}
      <section className="relative grid grid-cols-1 lg:grid-cols-5 gap-12 items-center mb-24 rounded-2xl">

        <div className="absolute inset-0 -z-10 bg-dot-grid opacity-40 rounded-2xl"></div>

        <div className="lg:col-span-3">
          <span className="inline-flex items-center gap-2 bg-amber/15 text-ink px-3 py-1.5 rounded-full text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4 text-amber" />
            AI-powered syllabus assistant
          </span>

          <h2 className="font-display text-4xl md:text-5xl font-medium text-ink leading-[1.1]">
            Learn your GTU syllabus,
            <br className="hidden md:block" />
            one question at a time.
          </h2>

          <p className="mt-5 text-lg text-slate max-w-md leading-relaxed">
            Ask about any topic in your prescribed curriculum and get answers
            grounded in the actual GTU syllabus, not generic AI guesswork.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setScreen("assistant")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper rounded-lg font-medium hover:bg-ink/90 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Ask a question
            </button>
            <button
              onClick={() => setScreen("subjects")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink rounded-lg font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Browse syllabus
            </button>
          </div>
        </div>

        {/* Featured subject card */}
        <div className="lg:col-span-2 relative">

          <div className="absolute -top-6 -right-6 w-32 h-32 bg-teal/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-8 -left-6 w-28 h-28 bg-amber/15 rounded-full blur-2xl"></div>

          <div className="relative bg-white border border-line rounded-2xl shadow-lg shadow-ink/5 overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-teal via-amber to-ink"></div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate">
                  <BookMarked className="w-3.5 h-3.5 text-teal" />
                  Featured subject
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal font-medium">
                  Common
                </span>
              </div>

              <p className="font-mono text-xs text-teal">DI01016011</p>
              <p className="font-display text-xl text-ink mt-1">Python Programming</p>
              <p className="text-xs text-slate mt-1">Information Technology, Semester 1</p>

              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-line">
                <div className="text-center">
                  <Layers className="w-4 h-4 text-teal mx-auto mb-1.5" />
                  <p className="font-mono text-xl text-ink">7</p>
                  <p className="text-xs text-slate">branches</p>
                </div>
                <div className="text-center">
                  <CalendarDays className="w-4 h-4 text-amber mx-auto mb-1.5" />
                  <p className="font-mono text-xl text-ink">5</p>
                  <p className="text-xs text-slate">semesters</p>
                </div>
                <div className="text-center">
                  <BookMarked className="w-4 h-4 text-ink mx-auto mb-1.5" />
                  <p className="font-mono text-xl text-ink">312</p>
                  <p className="text-xs text-slate">subjects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Feature tiles */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <button
          onClick={() => setScreen("assistant")}
          className="group text-left w-full relative bg-white border border-line rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-amber/15 flex items-center justify-center mb-5">
            <MessageCircle className="w-6 h-6 text-amber" />
          </div>
          <h3 className="font-display text-2xl text-ink">
            AI Academic Assistant
          </h3>
          <p className="mt-3 text-slate leading-relaxed">
            Ask natural-language questions about any topic in your syllabus
            and get clear, syllabus-grounded explanations.
          </p>
          <span className="inline-flex items-center gap-1 mt-6 text-ink font-medium group-hover:text-teal">
            Start a conversation
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>

        <button
          onClick={() => setScreen("subjects")}
          className="group text-left w-full relative bg-white border border-line rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5 transition-all"
        >
          <div className="w-12 h-12 rounded-xl bg-teal/15 flex items-center justify-center mb-5">
            <BookOpen className="w-6 h-6 text-teal" />
          </div>
          <h3 className="font-display text-2xl text-ink">
            Subject & Syllabus
          </h3>
          <p className="mt-3 text-slate leading-relaxed">
            Browse units, credits, and teaching hours for every subject
            across all seven GTU diploma branches.
          </p>
          <span className="inline-flex items-center gap-1 mt-6 text-ink font-medium group-hover:text-amber">
            Browse subjects
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </button>

      </section>

    </main>
  )
}

export default Home