import { useState } from "react"

function AIAssistant({ setScreen }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([
    {
      type: "assistant",
      text: "Hello! I'm GTU Campus Geek. Ask me an academic question."
    }
  ])

  const askQuestion = async () => {
    if (!question.trim()) return

    const userQuestion = question

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: userQuestion
      }
    ])

    setQuestion("")

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            question: userQuestion
          })
        }
      )

      const data = await response.json()

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "assistant",
          text: data.answer
        }
      ])
    } catch (error) {
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "assistant",
          text: "Unable to connect to the backend."
        }
      ])
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">

      {/* Back Button */}
      <button
        onClick={() => setScreen("home")}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Back to Home
      </button>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

        {/* Assistant Header */}
        <div className="p-6 border-b">

          <h2 className="text-2xl font-bold text-gray-900">
            🤖 AI Academic Assistant
          </h2>

          <p className="text-gray-500 mt-1">
            Ask questions about your GTU studies.
          </p>

        </div>

        {/* Chat Area */}
        <div className="p-6 space-y-4 min-h-[350px]">

          {messages.map((message, index) => (

            <div
              key={index}
              className={`flex ${
                message.type === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.text}
              </div>

            </div>

          ))}

        </div>

        {/* Suggested Questions */}
        <div className="px-6 pb-4">

          <p className="text-sm text-gray-500 mb-2">
            Try asking:
          </p>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() => setQuestion("What is machine learning?")}
              className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              What is Machine Learning?
            </button>

            <button
              onClick={() => setQuestion("Explain DBMS.")}
              className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Explain DBMS
            </button>

            <button
              onClick={() => setQuestion("What is cybersecurity?")}
              className="px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              What is Cybersecurity?
            </button>

          </div>

        </div>

        {/* Input */}
        <div className="p-6 border-t bg-gray-50">

          <div className="flex gap-3">

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askQuestion()
                }
              }}
              placeholder="Ask an academic question..."
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={askQuestion}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Ask
            </button>

          </div>

        </div>

      </div>

    </main>
  )
}

export default AIAssistant