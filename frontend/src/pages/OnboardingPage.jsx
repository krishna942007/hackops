import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const { register, signInWithGoogle, loading, showToast } = useApp();
  const navigate = useNavigate();
  const googleBtnRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    password: "",
    studyGoal: ""
  });

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
          showToast(err.message, "error");
        }
      }
    });

    window.google.accounts.id.renderButton(googleBtnRef.current, {
      theme: "outline",
      size: "large",
      width: 280
    });
  }, []);

  const handleFinish = async () => {
    try {
      await register({
        name: profile.name.trim(),
        email: profile.email.trim(),
        password: profile.password
      });

      navigate("/dashboard");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen mesh-bg bg-aura flex items-center justify-center relative overflow-hidden p-6">

      <div className="w-full max-w-xl">
        <div className="glass-card p-10 page">

          <h2 className="text-3xl text-center gold-text mb-8 tracking-wide">
            CREATE YOUR ACCOUNT
          </h2>

          <div className="space-y-4">

            <input
              className="input"
              placeholder="Full Name"
              value={profile.name}
              onChange={(e) =>
                setProfile((p) => ({ ...p, name: e.target.value }))
              }
            />

            <input
              className="input"
              type="email"
              placeholder="Email"
              value={profile.email}
              onChange={(e) =>
                setProfile((p) => ({ ...p, email: e.target.value }))
              }
            />

            <input
              className="input"
              type="password"
              placeholder="Password (min 6 characters)"
              value={profile.password}
              onChange={(e) =>
                setProfile((p) => ({ ...p, password: e.target.value }))
              }
            />

          </div>

          <div className="mt-8 space-y-5">

            <button
              onClick={handleFinish}
              disabled={loading}
              className="btn-gold w-full"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "CONTINUE"
              )}
            </button>

            <div className="gold-divider"></div>

            <div className="flex justify-center">
              <div ref={googleBtnRef}></div>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full btn-outline-gold"
            >
              Already have an account? LOG IN
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}