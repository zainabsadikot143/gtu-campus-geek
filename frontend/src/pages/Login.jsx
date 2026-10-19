
import { useState } from "react";
import { GraduationCap, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

function Login({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setScreen("home");
  };

  return (
    <main className="min-h-[calc(100vh-90px)] flex items-center justify-center px-6 py-12 bg-dot-grid">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-xl bg-ink flex items-center justify-center mb-5">
            <GraduationCap className="w-7 h-7 text-paper" />
          </div>

          <h2 className="font-display text-4xl font-semibold text-ink">
            Welcome back
          </h2>

          <p className="text-slate mt-3">
            Login to continue with GTU Campus Geek
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-paper border border-line rounded-2xl p-7 shadow-sm">

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-line rounded-lg bg-white outline-none focus:border-ink transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-line rounded-lg bg-white outline-none focus:border-ink transition"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}

              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Register */}
          <div className="text-center mt-6 pt-6 border-t border-line">
            <p className="text-sm text-slate">
              Don't have an account?{" "}
              <button
                onClick={() => setScreen("register")}
                className="font-medium text-ink underline underline-offset-4 hover:text-teal transition"
              >
                Create account
              </button>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Login;

