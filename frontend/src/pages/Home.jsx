function Home({ setScreen }) {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12">

      {/* Welcome Section */}
      <section className="text-center mb-12">

        <h2 className="text-4xl font-bold text-gray-900">
          Welcome to GTU Campus Geek 👋
        </h2>

        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          A simple academic assistant designed to help GTU Diploma
          students manage their studies, syllabus, and academic queries.
        </p>

      </section>

      {/* Quick Access */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* AI Assistant */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <div className="text-3xl mb-4">
            🤖
          </div>

          <h3 className="text-xl font-semibold">
            AI Academic Assistant
          </h3>

          <p className="mt-2 text-gray-600">
            Ask academic questions and get assistance with your studies.
          </p>

          <button
            onClick={() => setScreen("assistant")}
            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ask Assistant
          </button>

        </div>

        {/* Subject & Syllabus */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <div className="text-3xl mb-4">
            📚
          </div>

          <h3 className="text-xl font-semibold">
            Subject & Syllabus
          </h3>

          <p className="mt-2 text-gray-600">
            Explore subjects, units, topics, and syllabus information.
          </p>

          <button
            onClick={() => setScreen("subjects")}
            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View Subjects
          </button>

        </div>

        {/* Study Planner */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <div className="text-3xl mb-4">
            📅
          </div>

          <h3 className="text-xl font-semibold">
            Study Planner
          </h3>

          <p className="mt-2 text-gray-600">
            Organize your study tasks and keep track of your progress.
          </p>

          <button
            onClick={() => setScreen("planner")}
            className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Open Planner
          </button>

        </div>

      </section>

      {/* Development Notice */}
      <section className="mt-12 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">

        <p className="text-blue-800 font-medium">
          🚧 Development Mode
        </p>

        <p className="mt-1 text-sm text-blue-600">
          These features currently use placeholder data.
        </p>

      </section>

    </main>
  )
}

export default Home