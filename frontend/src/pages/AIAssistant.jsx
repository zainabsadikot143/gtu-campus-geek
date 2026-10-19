import { useEffect, useRef, useState } from "react"
import { Plus, MessageSquare, History } from "lucide-react"
import { supabase } from "../lib/supabase"

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
const ACTIVE_CHAT_KEY = "gtu_active_conversation"

const WELCOME_MESSAGE = {
  type: "assistant",
  text: "Hi! I'm GTU Campus Geek. Ask me anything from your GTU syllabus."
}

async function getAccessToken() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return session?.access_token || null
}

function AIAssistant({ setScreen }) {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [listLoading, setListLoading] = useState(true)
  // If a chat was open before we left this screen, start in "loading" state
  // so the welcome message doesn't flash before the chat comes back
  const [chatLoading, setChatLoading] = useState(
    () => !!sessionStorage.getItem(ACTIVE_CHAT_KEY)
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const chatContainerRef = useRef(null)

  // Keeps the open chat's ID both in state and in the browser session
  const rememberActiveConversation = (conversationId) => {
    setActiveConversationId(conversationId)
    if (conversationId) {
      sessionStorage.setItem(ACTIVE_CHAT_KEY, conversationId)
    } else {
      sessionStorage.removeItem(ACTIVE_CHAT_KEY)
    }
  }

  // Fetch the list of this user's past chats (for the history panel)
  const loadConversations = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      console.log("LOGGED-IN USER ID:", sessionData.session?.user?.id)
      
      const token = await getAccessToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      console.log("CONVERSATIONS API:", data)

      if (data.success) {
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error("Could not load conversations:", error)
    } finally {
      setListLoading(false)
    }
  }

  // Loads every message of one chat onto the screen
  const openConversation = async (conversationId) => {
    if (isLoading) return
    setSidebarOpen(false)
    if (conversationId === activeConversationId) return

    setChatLoading(true)
    try {
      const token = await getAccessToken()
      if (!token) throw new Error("You are not logged in.")

      const response = await fetch(
        `${API_URL}/api/conversations/${conversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = await response.json()

      if (!data.success) throw new Error(data.message || "Could not load chat.")

      // Chat not found (for example it belonged to another account): start fresh
      if (data.messages.length === 0) {
        setMessages([WELCOME_MESSAGE])
        rememberActiveConversation(null)
        return
      }

      const loadedMessages = []
      data.messages.forEach((message) => {
        loadedMessages.push({ type: "user", text: message.question })
        loadedMessages.push({
          type: "assistant",
          text: message.answer,
          sources: message.sources ? message.sources.split(", ") : []
        })
      })

      setMessages(loadedMessages)
      rememberActiveConversation(conversationId)
    } catch (error) {
      console.error("Could not open conversation:", error)
      rememberActiveConversation(null)
    } finally {
      setChatLoading(false)
    }
  }

  // On arriving at this screen: load the chat list, and reopen the chat
  // that was open before we went to Home (if any)
  useEffect(() => {
    loadConversations()

    const savedConversationId = sessionStorage.getItem(ACTIVE_CHAT_KEY)
    if (savedConversationId) {
      openConversation(savedConversationId)
    }
  }, [])

  // Keep the chat scrolled to the newest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isLoading, chatLoading])

  // "+ New chat": clear the screen and forget the current conversation
  const startNewChat = () => {
    if (isLoading) return
    rememberActiveConversation(null)
    setMessages([WELCOME_MESSAGE])
    setQuestion("")
    setSidebarOpen(false)
  }

  const askQuestion = async () => {
    if (!question.trim() || isLoading || chatLoading) return

    const userQuestion = question.trim()

    setMessages((previousMessages) => [
      ...previousMessages,
      { type: "user", text: userQuestion }
    ])
    setQuestion("")
    setIsLoading(true)

    try {
      const token = await getAccessToken()
      if (!token) throw new Error("You are not logged in.")

      const response = await fetch(`${API_URL}/api/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          question: userQuestion,
          // null on a brand-new chat; the backend creates the ID and sends it back
          conversation_id: activeConversationId
        })
      })

     const data = await response.json().catch(() => ({}))

if (!response.ok) {
  if (response.status === 429) {
    throw new Error(
      "AI request limit reached. Please wait and try again later."
    )
  }

  if (response.status >= 500) {
    throw new Error(
      "The AI server is temporarily unavailable. Please try again later."
    )
  }

  throw new Error(
    data.detail || data.message || `Server error (${response.status})`
  )
}

      if (!data.success) {
        throw new Error(data.message || "Something went wrong.")
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "assistant",
          text: data.answer,
          sources: data.sources || []
        }
      ])

      // First answer of a new chat: remember its ID so follow-ups stay in this chat
      if (data.conversation_id) {
        rememberActiveConversation(data.conversation_id)
      }

      // Refresh the history panel so the new/updated chat shows up
      loadConversations()
    } catch (error) {
      console.error("Chat error:", error)

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          type: "assistant",
          text:
  error.message === "You are not logged in."
    ? "Please login before using the AI Academic Assistant."
    : error.message || "Something went wrong. Please try again.",
          sources: []
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const activeConversation = conversations.find(
    (c) => c.conversation_id === activeConversationId
  )

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setScreen("home")}
          className="text-sm text-slate hover:text-ink"
        >
          ← Back to Home
        </button>

        {/* History toggle, only visible on small screens */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden inline-flex items-center gap-2 text-sm text-ink border border-line rounded-lg px-3 py-2 bg-white"
        >
          <History className="w-4 h-4" />
          History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">

        {/* History panel */}
        <aside
          className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col bg-white border border-line rounded-lg overflow-hidden md:h-[640px]`}
        >
          <div className="p-4 border-b border-line">
            <button
              onClick={startNewChat}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-md font-medium hover:bg-ink/90 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              New chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 max-h-[320px] md:max-h-none">
            <p className="px-3 pt-2 pb-1 text-xs font-mono text-slate uppercase tracking-wide">
              Your chats
            </p>

            {listLoading && (
              <p className="px-3 py-2 text-sm text-slate">Loading…</p>
            )}

            {!listLoading && conversations.length === 0 && (
              <p className="px-3 py-2 text-sm text-slate">
                No chats yet. Ask your first question to start one.
              </p>
            )}

            {conversations.map((conversation) => {
              const isActive =
                conversation.conversation_id === activeConversationId

              return (
                <button
                  key={conversation.conversation_id}
                  onClick={() => openConversation(conversation.conversation_id)}
                  disabled={isLoading}
                  className={
                    isActive
                      ? "w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-md bg-paper border-l-2 border-teal text-ink text-sm"
                      : "w-full flex items-center gap-2 text-left px-3 py-2.5 rounded-md text-slate text-sm hover:bg-paper hover:text-ink disabled:opacity-50"
                  }
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span className="truncate">{conversation.title}</span>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Chat window */}
        <section className="bg-white border border-line rounded-lg overflow-hidden flex flex-col h-[640px]">

          <div className="px-6 py-5 border-b border-line">
            <h2 className="font-display text-2xl text-ink">
              AI Academic Assistant
            </h2>
            <p className="text-xs text-slate mt-1 truncate">
              {activeConversation ? activeConversation.title : "New chat"}
            </p>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 px-6 py-6 space-y-5 overflow-y-auto"
          >
            {chatLoading && (
              <p className="text-sm text-slate">Loading chat…</p>
            )}

            {!chatLoading &&
              messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.type === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={
                      message.type === "user"
                        ? "max-w-[80%] bg-ink text-paper px-4 py-3 rounded-lg rounded-br-sm"
                        : "max-w-[80%] bg-paper border-l-2 border-teal px-4 py-3 rounded-r-lg whitespace-pre-wrap"
                    }
                  >
                    <p
                      className={
                        message.type === "user" ? "text-paper" : "text-ink"
                      }
                    >
                      {message.text}
                    </p>

                    {message.sources && message.sources.length > 0 && (
                      <p className="mt-2 text-xs font-mono text-teal">
                        {message.sources.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-paper border-l-2 border-line px-4 py-3 rounded-r-lg">
                  <p className="text-slate text-sm">Thinking…</p>
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions: only on an empty new chat */}
          {messages.length <= 1 && !chatLoading && (
            <div className="px-6 flex flex-wrap gap-2 pb-4">
              {[
                "What can you do?",
                "Explain loops in Python Programming.",
                "Explain Design Thinking in AI Product Design."
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(suggestion)}
                  className="text-sm bg-paper border border-line text-slate px-3 py-1.5 rounded-full hover:border-teal hover:text-teal"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-6 pb-6 flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  askQuestion()
                }
              }}
              placeholder="Ask an academic question…"
              className="flex-1 border border-line rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
            />

            <button
              onClick={askQuestion}
              disabled={isLoading || chatLoading}
              className="bg-ink text-paper px-6 py-2.5 rounded-md font-medium hover:bg-ink/90 disabled:opacity-50"
            >
              {isLoading ? "..." : "Ask"}
            </button>
          </div>

        </section>
      </div>

    </main>
  )
}

export default AIAssistant