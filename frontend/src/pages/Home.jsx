import { Sparkles, MessageCircle, BookOpen, ArrowUpRight } from "lucide-react"

function Home({ setScreen }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">

      {/* Hero */}
      <section className="relative mb-24 rounded-2xl py-6">

        <div className="absolute inset-0 -z-10 bg-dot-grid opacity-40 rounded-2xl"></div>

        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 bg-amber/15 text-ink px-3 py-1.5 rounded-full text-sm font-medium mb-5">
            <Sparkles className="w-4 h-4 text-amber" />
            AI-powered syllabus assistant
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-medium text-ink leading-[1.1]">
            Learn your GTU syllabus,
            <br className="hidden md:block" />
            one question at a time.
          </h2>

          <p className="mt-5 text-lg text-slate max-w-xl leading-relaxed">
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