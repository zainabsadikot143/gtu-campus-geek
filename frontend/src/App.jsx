import { useState } from "react"
import Home from "./pages/Home"
import AIAssistant from "./pages/AIAssistant"
import Subjects from "./pages/Subjects"
import StudyPlanner from "./pages/StudyPlanner"

function App() {
  const [screen, setScreen] = useState("home")

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <button
            onClick={() => setScreen("home")}
            className="text-left"
          >
            <h1 className="text-2xl font-bold text-blue-700">
              GTU Campus Geek
            </h1>

            <p className="text-sm text-gray-500">
              Your AI-powered academic assistant
            </p>
          </button>

          <div className="text-sm text-gray-600">
            GTU Diploma
          </div>

        </div>
      </header>

      {/* HOME SCREEN */}
      {screen === "home" && (
        <Home setScreen={setScreen} />
      )}

      {/* AI ASSISTANT SCREEN */}
      {screen === "assistant" && (
        <AIAssistant setScreen={setScreen} />
      )}

      {/* SUBJECT & SYLLABUS SCREEN */}
      {screen === "subjects" && (
        <Subjects setScreen={setScreen} />
      )}

      {/* STUDY PLANNER SCREEN */}
      {screen === "planner" && (
        <StudyPlanner setScreen={setScreen} />
      )}

      {/* Footer */}
      <footer className="border-t bg-white mt-12">

        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
          GTU Campus Geek • Week 1 Development
        </div>

      </footer>

    </div>
  )
}

export default App