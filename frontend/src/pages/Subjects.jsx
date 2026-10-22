import { useState, useEffect } from "react"

function Subjects({ setScreen }) {
  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState("Information Technology")
  const [selectedSemester, setSelectedSemester] = useState(1)

  const branches = [
    "Information Technology",
    "Computer Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Chemical Engineering",
    "Plastic Engineering"
  ]

  useEffect(() => {
    setIsLoading(true)
    const params = new URLSearchParams({
      branch: selectedBranch,
      semester: selectedSemester
    })
    fetch(`${import.meta.env.VITE_API_URL}/api/subjects?${params}`)
      .then((response) => response.json())
      .then((data) => {
        setSubjects(data.subjects || [])
        setIsLoading(false)
      })
      .catch(() => {
        setSubjects([])
        setIsLoading(false)
      })
  }, [selectedBranch, selectedSemester])

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">

      <button
        onClick={() => setScreen("home")}
        className="mb-8 text-sm text-slate hover:text-ink"
      >
        ← Back to Home
      </button>

      <section className="mb-8">
        <h2 className="font-display text-4xl text-ink">
          Subject & Syllabus
        </h2>
        <p className="mt-2 text-slate">
          Browse subjects by branch and semester.
        </p>
      </section>

      {/* Branch pills */}
      <section className="mb-4 flex flex-wrap gap-2">
        {branches.map((branch) => (
          <button
            key={branch}
            onClick={() => setSelectedBranch(branch)}
            className={
              selectedBranch === branch
                ? "px-4 py-2 rounded-full text-sm font-medium bg-ink text-paper"
                : "px-4 py-2 rounded-full text-sm font-medium bg-white border border-line text-slate hover:border-ink hover:text-ink"
            }
          >
            {branch}
          </button>
        ))}
      </section>

      {/* Semester pills */}
      <section className="mb-10 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={
              selectedSemester === sem
                ? "w-10 h-10 rounded-full text-sm font-mono bg-teal text-white"
                : "w-10 h-10 rounded-full text-sm font-mono bg-white border border-line text-slate hover:border-teal hover:text-teal"
            }
          >
            {sem}
          </button>
        ))}
      </section>

      {isLoading && <p className="text-slate">Loading subjects…</p>}

      {!isLoading && subjects.length === 0 && (
        <p className="text-slate">No subjects found for this selection.</p>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white border border-line rounded-lg p-6 hover:border-ink transition-colors"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <p className="font-mono text-xs text-teal">
                  {subject.subject_code}
                </p>
                <h3 className="font-display text-lg text-ink mt-1">
                  {subject.subject_name}
                </h3>
              </div>
              <span className={
                subject.student_category === "Common"
                  ? "shrink-0 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal font-medium"
                  : "shrink-0 text-xs px-2 py-1 rounded-full bg-amber/20 text-ink font-medium"
              }>
                {subject.student_category}
              </span>
            </div>

            <div className="mt-4 flex gap-5 text-sm text-slate font-mono">
              <span>{subject.credits ?? "—"} credits</span>
              <span>{subject.teaching_hours ?? "—"} hrs/week</span>
            </div>

            {subject.course_category && (
              <p className="mt-3 text-xs text-slate border-t border-line pt-3">
                {subject.course_category}
              </p>
            )}
          </div>
        ))}
      </section>

    </main>
  )
}

export default Subjects