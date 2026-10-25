import {
  Sparkles,
  MessageCircle,
  BookOpen,
  ArrowUpRight,
  GraduationCap,
  ChevronDown,
  Layers,
  CalendarDays
} from "lucide-react"
import { courses } from "../lib/courses"

function Home({ setScreen, selectedCourse, setSelectedCourse }) {
  const course = courses[selectedCourse]

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      <div className="flex flex-col lg:flex-row lg:min-h-[75vh]">

        {/* Course road: a full-height strip reserved for the course selector */}
        <aside className="lg:w-72 shrink-0 pb-8 lg:pb-0 lg:pr-8 border-b-2 lg:border-b-0 lg:border-r-2 border-dashed border-line">
          <div className="lg:sticky lg:top-28">

            <label
              htmlFor="home-course"
              className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate mb-3"
            >
              <GraduationCap className="w-4 h-4 text-teal" />
              Select your course
            </label>

            <div className="relative">
              <select
                id="home-course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full appearance-none rounded-lg border border-line bg-white px-4 py-3 pr-10 font-display text-base text-ink hover:border-ink focus:border-ink focus:outline-none transition-colors cursor-pointer"
              >
                {Object.entries(courses).map(([key, c]) => (
                  <option key={key} value={key}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
            </div>

            {/* Vertical details along the road */}
            <ul className="mt-8 space-y-6 lg:space-y-8">
              <li className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-teal" />
                </span>
                <div>
                  <p className="font-mono text-xl text-ink leading-none">
                    {course.departments.length}
                  </p>
                  <p className="text-xs text-slate mt-1">
                    {course.departments.length === 1 ? "department" : "departments"}
                  </p>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-amber/15 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-amber" />
                </span>
                <div>
                  <p className="font-mono text-xl text-ink leading-none">
                    {course.semesters}
                  </p>
                  <p className="text-xs text-slate mt-1">semesters</p>
                </div>
              </li>

              <li>
                <span
                  className={
                    course.hasData
                      ? "inline-block text-xs px-3 py-1.5 rounded-full bg-teal/10 text-teal font-medium"
                      : "inline-block text-xs px-3 py-1.5 rounded-full bg-amber/20 text-ink font-medium"
                  }
                >
                  {course.hasData ? "Syllabus available" : "Coming soon"}
                </span>
              </li>
            </ul>

            {!course.hasData && (
              <p className="mt-6 text-xs text-slate leading-relaxed">
                {course.label} syllabus is being added. The AI assistant
                currently answers Diploma Engineering questions.
              </p>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 pt-8 lg:pt-0 lg:pl-12">

          {/* Hero */}
          <section className="relative mb-16 rounded-2xl py-6">

            <div className="absolute inset-0 -z-10 bg-dot-grid opacity-40 rounded-2xl"></div>

            <div className="max-w-2xl">
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
                Ask about any topic in your prescribed curriculum and get
                answers grounded in the actual GTU syllabus, not generic AI
                guesswork.
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
                of your selected course, department and semester.
              </p>
              <span className="inline-flex items-center gap-1 mt-6 text-ink font-medium group-hover:text-amber">
                Browse subjects
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </button>

          </section>

        </div>
      </div>

    </main>
  )
}

export default Home