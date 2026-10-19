
import { useState } from "react";
import { GraduationCap, Mail, Lock, UserPlus } from "lucide-react";
import { supabase } from "../lib/supabase";

function Register({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Registration successful. Please check your email to verify your account."
    );
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
            Create account
          </h2>

          <p className="text-slate mt-3">
            Join GTU Campus Geek
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-paper border border-line rounded-2xl p-7 shadow-sm">

          <form onSubmit={handleRegister} className="space-y-5">

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
                  placeholder="Create a password"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-line rounded-lg bg-white outline-none focus:border-ink transition"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
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

            {/* Success */}
            {message && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}

              {!loading && <UserPlus className="w-4 h-4" />}
            </button>
          </form>

          {/* Login */}
          <div className="text-center mt-6 pt-6 border-t border-line">
            <p className="text-sm text-slate">
              Already have an account?{" "}
              <button
                onClick={() => setScreen("login")}
                className="font-medium text-ink underline underline-offset-4 hover:text-teal transition"
              >
                Login
              </button>
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Register;

