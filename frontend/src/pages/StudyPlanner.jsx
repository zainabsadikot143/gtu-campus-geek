function StudyPlanner({ setScreen }) {
  const studyTasks = [
    {
      subject: "Database Management System",
      task: "Revise SQL and Normalization",
      duration: "2 hours",
      status: "Pending"
    },
    {
      subject: "Machine Learning",
      task: "Study Classification Algorithms",
      duration: "2 hours",
      status: "In Progress"
    },
    {
      subject: "Cyber Security",
      task: "Revise Cybersecurity Fundamentals",
      duration: "1 hour",
      status: "Pending"
    },
    {
      subject: "Data Mining & Warehousing",
      task: "Practice K-Means Clustering",
      duration: "1.5 hours",
      status: "Completed"
    }
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">

      {/* Back Button */}
      <button
        onClick={() => setScreen("home")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Home
      </button>

      {/* Page Header */}
      <section className="mb-8">

        <h2 className="text-3xl font-bold text-gray-900">
          📅 Study Planner
        </h2>

        <p className="mt-2 text-gray-600">
          Organize your study tasks and keep track of your progress.
        </p>

      </section>

      {/* Study Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <p className="text-sm text-gray-500">
            Total Tasks
          </p>

          <p className="mt-2 text-3xl font-bold text-blue-600">
            4
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <p className="mt-2 text-3xl font-bold text-yellow-600">
            1
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-3xl font-bold text-green-600">
            1
          </p>
        </div>

      </section>

      {/* Study Tasks */}
      <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h3 className="text-xl font-semibold">
            Today's Study Tasks
          </h3>

        </div>

        <div className="divide-y">

          {studyTasks.map((task, index) => (

            <div
              key={index}
              className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              <div>

                <p className="text-sm text-blue-600 font-medium">
                  {task.subject}
                </p>

                <h4 className="mt-1 text-lg font-semibold text-gray-900">
                  {task.task}
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  Estimated duration: {task.duration}
                </p>

              </div>

              <div>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {task.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* Development Notice */}
      <section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">

        <p className="font-medium text-yellow-800">
          🚧 Sample Study Plan
        </p>

        <p className="mt-1 text-sm text-yellow-700">
          This planner currently uses placeholder data.
          Personalized study planning will be added in a later stage.
        </p>

      </section>

    </main>
  )
}

export default StudyPlanner