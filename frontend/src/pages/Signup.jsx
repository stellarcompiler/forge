import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [revealCard, setRevealCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealCard(true);
    }, 1);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8000/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Signup failed"
        );
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#D97706] p-4 font-sans selection:bg-[#0B0B0B] selection:text-[#F5F5F5] overflow-hidden">

      <div
        className={`w-full max-w-md bg-[#0B0B0B] border border-[#232323] p-8 rounded-lg shadow-2xl z-10 transform transition-all duration-700 ease-out ${
          revealCard
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-[0.98]"
        }`}
      >
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#232323] px-3 py-2 text-sm text-[#A1A1AA] hover:border-[#D97706] hover:text-[#F5F5F5] transition-all"
        >
          ← Back to Forge
        </button>

        <div className="mb-8">
          <h2 className="text-[#F5F5F5] text-3xl font-bold tracking-tight mb-2">
            Create Account
          </h2>

          <p className="text-[#A1A1AA] text-sm">
            Create your Forge workspace and start building projects.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#A1A1AA] uppercase mb-2">
              Full Name
            </label>

            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111111] border border-[#232323] text-[#F5F5F5] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#D97706] transition-colors"
              placeholder="Aswanth Madhav"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#A1A1AA] uppercase mb-2">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111111] border border-[#232323] text-[#F5F5F5] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#D97706] transition-colors"
              placeholder="name@university.edu"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wider text-[#A1A1AA] uppercase mb-2">
              Password
            </label>

            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111111] border border-[#232323] text-[#F5F5F5] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#D97706] transition-colors"
              placeholder="Minimum 8 characters"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D97706] text-[#F5F5F5] py-3 rounded hover:bg-[#b46205] transition-colors text-sm font-semibold tracking-wide disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-[#D97706] hover:underline"
            >
              Already have an account? Sign In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}