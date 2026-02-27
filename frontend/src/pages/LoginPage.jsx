import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Mail, Lock, Loader2, UserPlus } from "lucide-react";

export default function LoginPage() {
  const { login, loading, signInWithGoogle } = useApp();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          await signInWithGoogle(response.credential);
          navigate("/dashboard");
        } catch (err) {
          setError(err.message);
        }
      }
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 280
    });
  }, []);

  return (
    <div className="min-h-screen mesh-bg bg-aura flex items-center justify-center relative overflow-hidden p-6">

      <div className="w-full max-w-md">
        <div className="glass-card p-10 page">

          <h1 className="text-4xl text-center gold-text mb-3 tracking-widest">
            AANUSHASAN
          </h1>

          <p className="text-center text-muted-gold mb-8">
            Sign in to continue your journey
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            <div className="relative">
              <Mail className="absolute left-4 top-4 text-muted-gold" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-12"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-4 text-muted-gold" size={18} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-12"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                "SIGN IN"
              )}
            </button>
          </form>

          <div className="my-6 gold-divider"></div>

          <div className="flex justify-center mb-6">
            <div ref={googleBtnRef}></div>
          </div>

          <button
            onClick={() => navigate("/onboarding")}
            className="w-full btn-outline-gold flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            REGISTER
          </button>

        </div>
      </div>
    </div>
  );
}