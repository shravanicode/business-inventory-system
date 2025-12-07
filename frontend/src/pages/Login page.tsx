// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("admin123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend-only demo: accept any non-empty email + password
    if (!email || !password) return;

    setIsSubmitting(true);

    // Small delay for smooth UX animation
    setTimeout(() => {
      // In a real app you would call an auth API here
      navigate("/dashboard");
    }, 650);
  };

  const handleDemoClick = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      navigate("/dashboard");
    }, 450);
  };

  return (
    <div className="login-page">
      <div className="login-shell">
        {/* Left visual panel */}
        <div className="login-panel login-panel-left">
          <div className="login-brand">
            <div className="login-logo-mark">BI</div>
            <div className="login-brand-text">
              <span className="login-brand-title">Business Inventory</span>
              <span className="login-brand-tagline">Web dashboard</span>
            </div>
          </div>

          <div className="login-panel-content">
            <h2 className="login-panel-heading">
              Control products, stock and sales from a single dashboard.
            </h2>
            <p className="login-panel-body">
              A lightweight SaaS-style inventory dashboard focused on clean UI,
              instant insights and a smooth daily workflow.
            </p>

            <ul className="login-bullets">
              <li>• Inventory, sales and customers in one place</li>
              <li>• Clear KPIs and low stock notifications</li>
              <li>• Designed as a portfolio-ready admin interface</li>
            </ul>

            <div className="login-mini-card">
              <div>
                <div className="login-mini-label">Today&apos;s activity</div>
                <div className="login-mini-value">
                  +18 orders · 6 low stock alerts
                </div>
              </div>
              <div className="login-mini-pills">
                <span className="login-mini-pill login-mini-pill-green">
                  ↑ 12% vs yesterday
                </span>
                <span className="login-mini-pill">Demo environment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-panel login-panel-right">
          <div className="login-card-pro">
            <div className="login-card-header">
              <div className="login-logo-circle-pro">BI</div>
              <div>
                <h1 className="login-title-pro">Sign in to dashboard</h1>
                <p className="login-subtitle-pro">
                  Use demo credentials or continue as a viewer to explore the
                  system.
                </p>
              </div>
            </div>

            <form className="login-form-pro" onSubmit={handleSubmit}>
              <div className="login-field-pro">
                <label className="login-label-pro">Email</label>
                <input
                  className="login-input-pro"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="login-field-pro">
                <label className="login-label-pro">Password</label>
                <input
                  className="login-input-pro"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="login-footer-row-pro">
                <label className="login-remember-pro">
                  <input type="checkbox" />
                  <span>Remember for 7 days</span>
                </label>

                <button
                  type="button"
                  className="login-link-button-pro"
                  onClick={() => {
                    // No real reset flow in demo
                    alert("Password reset is not connected in this demo.");
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="login-submit-pro"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>

              <button
                type="button"
                className="login-secondary-pro"
                onClick={handleDemoClick}
                disabled={isSubmitting}
              >
                Continue as demo viewer
              </button>
            </form>

            <div className="login-meta-pro">
              <span>Frontend-only prototype · Authentication is not wired.</span>
            </div>
          </div>

          <div className="login-footer-meta">
            <span>
              © {new Date().getFullYear()} Business Inventory Dashboard ·
              Portfolio demo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
              }
