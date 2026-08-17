function Subjects({ setScreen }) {
  const subjects = [
    {
      code: "3150703",
      name: "Database Management System",
      units: 6,
      description:
        "Learn database concepts, SQL, normalization, transactions, and database design."
    },
    {
      code: "3150716",
      name: "Machine Learning",
      units: 6,
      description:
        "Explore supervised learning, unsupervised learning, classification, clustering, and model evaluation."
    },
    {
      code: "3150715",
      name: "Cyber Security",
      units: 6,
      description:
        "Study cybersecurity fundamentals, threats, attacks, cryptography, and security mechanisms."
    },
    {
      code: "3150714",
      name: "Data Mining & Warehousing",
      units: 6,
      description:
        "Learn data preprocessing, data warehousing, OLAP, classification, clustering, and association rules."
    },
    {
      code: "3150713",
      name: "Mobile Computing & Networks",
      units: 6,
      description:
        "Study mobile communication, wireless networks, protocols, and mobile computing concepts."
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
          📚 Subject & Syllabus
        </h2>

        <p className="mt-2 text-gray-600">
          Explore your subjects and syllabus topics.
        </p>

      </section>

      {/* Subject Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {subjects.map((subject) => (

          <div
            key={subject.code}
            className="bg-white p-6 rounded-2xl shadow-sm border"
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-blue-600 font-medium">
                  {subject.code}
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {subject.name}
                </h3>

              </div>

              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {subject.units} Units
              </span>

            </div>

            <p className="mt-4 text-gray-600">
              {subject.description}
            </p>

            <button
              className="mt-5 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View Syllabus
            </button>

          </div>

        ))}

      </section>

      {/* Development Notice */}
      <section className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5">

        <p className="font-medium text-yellow-800">
          🚧 Sample Data
        </p>

        <p className="mt-1 text-sm text-yellow-700">
          Subject information shown here is placeholder data for
          frontend development. Official syllabus integration will
          be added later.
        </p>

      </section>

    </main>
  )
}

export default Subjects