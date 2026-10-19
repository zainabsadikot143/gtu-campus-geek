
import { useEffect, useState } from "react";
import { GraduationCap, LogOut } from "lucide-react";

import Home from "./pages/Home";
import AIAssistant from "./pages/AIAssistant";
import Subjects from "./pages/Subjects";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { supabase } from "./lib/supabase";

function App() {
  const [screen, setScreen] = useState("home");
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check existing login session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    };

    getSession();

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session) {
        setScreen("login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setScreen("login");
  };

  // Prevent the app from flashing before Supabase checks the session
  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-ink flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-paper" />
          </div>

          <p className="text-slate">Loading GTU Campus Geek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">

      {/* Header */}
      <header className="bg-paper border-b border-line sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <button
            onClick={() => session && setScreen("home")}
            className="text-left flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-ink flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-paper" />
            </div>

            <div>
              <h1 className="font-display italic text-2xl font-semibold text-ink leading-none">
                GTU Campus Geek
              </h1>

              <p className="text-xs text-slate mt-1">
                Syllabus-grounded AI for GTU Diploma students
              </p>
            </div>
          </button>

          {session ? (
            <div className="flex items-center gap-4">

              <div className="text-sm text-slate font-mono hidden sm:block">
                GTU Diploma
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-ink border border-line rounded-lg px-3 py-2 hover:bg-ink hover:text-paper transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

            </div>
          ) : (
            <div className="text-sm text-slate font-mono hidden sm:block">
              GTU Diploma
            </div>
          )}

        </div>
      </header>

      {/* Authentication screens */}
      {!session && screen === "login" && (
        <Login setScreen={setScreen} />
      )}

      {!session && screen === "register" && (
        <Register setScreen={setScreen} />
      )}

      {/* Main application */}
      {session && screen === "home" && (
        <Home setScreen={setScreen} />
      )}

      {session && screen === "assistant" && (
        <AIAssistant setScreen={setScreen} />
      )}

      {session && screen === "subjects" && (
        <Subjects setScreen={setScreen} />
      )}

      {/* Footer */}
      <footer className="border-t border-line bg-paper mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">

          <p className="text-sm text-slate">
            A study companion for GTU Diploma students.
          </p>

          <p className="text-xs text-slate font-mono">
            7 branches, 5 semesters, 312 subjects indexed
          </p>

        </div>
      </footer>

    </div>
  );
}

export default App;
