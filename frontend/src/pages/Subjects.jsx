import { useState, useEffect } from "react"
import { courses } from "../lib/courses"

function Subjects({ setScreen, selectedCourse, setSelectedCourse }) {
  const course = courses[selectedCourse]

  const [subjects, setSubjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState(course.departments[0])
  const [selectedSemester, setSelectedSemester] = useState(1)
  const [availablePdfs, setAvailablePdfs] = useState({})

  // When the course changes here, reset department and semester
  function handleCourseChange(newCourse) {
    setSelectedCourse(newCourse)
    setSelectedBranch(courses[newCourse].departments[0])
    setSelectedSemester(1)
  }

  // Load the list of PDFs that really exist (written by sync_syllabus_pdfs.py)
  useEffect(() => {
    fetch("/syllabus/manifest.json")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => setAvailablePdfs(data))
      .catch(() => setAvailablePdfs({}))
  }, [])

  // Load subjects whenever the course, department or semester changes
  useEffect(() => {
    // Courses without data yet: don't call the API
    if (!courses[selectedCourse].hasData) {
      setSubjects([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const params = new URLSearchParams({
      branch: selectedBranch,
      semester: selectedSemester
    })

    fetch(`${import.meta.env.VITE_API_URL}/api/subjects?${params}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load subjects")
        return response.json()
      })
      .then((data) => {
        setSubjects(data.subjects || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading subjects:", error)
        setSubjects([])
        setIsLoading(false)
      })
  }, [selectedCourse, selectedBranch, selectedSemester])

  const selectClass =
    "min-w-[12rem] rounded-md border border-line bg-white px-4 py-2 text-sm text-ink focus:border-ink focus:outline-none"

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
          Subject &amp; Syllabus
        </h2>
        <p className="mt-2 text-slate">
          Browse subjects by course, department and semester.
        </p>
      </section>

      <section className="mb-10 flex flex-wrap gap-5">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="course-select"
            className="text-xs font-medium text-slate"
          >
            Course
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className={`${selectClass} min-w-[16rem]`}
          >
            {Object.entries(courses).map(([key, c]) => (
              <option key={key} value={key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="branch-select"
            className="text-xs font-medium text-slate"
          >
            Department
          </label>
          <select
            id="branch-select"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className={`${selectClass} min-w-[16rem]`}
          >
            {course.departments.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="semester-select"
            className="text-xs font-medium text-slate"
          >
            Semester
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
            className={selectClass}
          >
            {Array.from({ length: course.semesters }, (_, i) => i + 1).map(
              (sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              )
            )}
          </select>
        </div>
      </section>

      {!course.hasData && (
        <div className="rounded-lg border border-line bg-white p-8 text-center">
          <p className="font-display text-xl text-ink">
            {course.label} syllabus is coming soon
          </p>
          <p className="mt-2 text-slate">
            We are adding subjects and syllabus PDFs for this course. For now,
            syllabus is available for Diploma Engineering.
          </p>
        </div>
      )}

      {course.hasData && isLoading && (
        <p className="text-slate">Loading subjects…</p>
      )}

      {course.hasData && !isLoading && subjects.length === 0 && (
        selectedSemester === 6 ? (
          <div className="rounded-lg border border-line bg-white p-8 text-center">
            <p className="font-display text-xl text-ink">
              Semester 6 syllabus not published yet
            </p>
            <p className="mt-2 text-slate">
              GTU has not officially released the Semester 6 syllabus. It will
              be added here as soon as it is available.
            </p>
          </div>
        ) : (
          <p className="text-slate">No subjects found for this selection.</p>
        )
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

              <span
                className={
                  subject.student_category === "Common"
                    ? "shrink-0 text-xs px-2 py-1 rounded-full bg-teal/10 text-teal font-medium"
                    : "shrink-0 text-xs px-2 py-1 rounded-full bg-amber/20 text-ink font-medium"
                }
              >
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

            <div className="mt-5 border-t border-line pt-4">
              {(() => {
                const pdfFile =
                  subject.syllabus_pdf &&
                  availablePdfs[subject.syllabus_pdf.toLowerCase()]
                return pdfFile ? (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`/syllabus/${encodeURIComponent(pdfFile)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      📄 View PDF ↗
                    </a>
                    <a
                      href={`/syllabus/${encodeURIComponent(pdfFile)}`}
                      download={pdfFile}
                      className="inline-flex items-center gap-2 rounded-md border border-teal px-4 py-2 text-sm font-medium text-teal hover:bg-teal/10"
                    >
                      ⬇ Download
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-slate">📄 PDF coming soon</p>
                )
              })()}
            </div>
          </div>
        ))}
      </section>
    </main>
  )
}

export default Subjects