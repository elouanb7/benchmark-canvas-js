import { useState, useEffect, useRef } from "react";
import { libraries, featureMatrix, recommendations } from "./data";

/* ───────────── Styles ───────────── */
const s = {
  page: {
    background: "var(--bg-page)",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
  },
  grain: {
    position: "fixed",
    inset: 0,
    opacity: "var(--grain-opacity)",
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    pointerEvents: "none",
    zIndex: 0,
  },
  wrap: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  mono: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

/* ───────────── Theme toggle button ───────────── */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 10,
        border: "1px solid var(--border-card)",
        background: "var(--bg-card)",
        color: "var(--text-secondary)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        transition: "all 0.2s",
        zIndex: 10,
      }}
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: "none" }}>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

/* ───────────── Animated bar ───────────── */
function FpsBar({ fps, maxFps, color, label, icon, delay = 0 }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setWidth((fps / maxFps) * 100), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fps, maxFps, delay]);

  const fpsColor = fps >= 30 ? "#4ade80" : fps >= 15 ? "#fbbf24" : "#f87171";

  return (
    <div ref={ref} className="fps-bar-row">
      <span className="fps-bar-label">
        {icon} {label}
      </span>
      <div className="fps-bar-track">
        <div
          className="fps-bar-fill"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          }}
        />
      </div>
      <span className="fps-bar-value" style={{ ...s.mono, color: fpsColor }}>
        {fps} <small style={{ fontSize: 10, opacity: 0.6 }}>fps</small>
      </span>
    </div>
  );
}

/* ───────────── Feature check ───────────── */
function Check({ val }) {
  return val ? (
    <span style={{ color: "#4ade80", fontSize: 18 }}>✓</span>
  ) : (
    <span style={{ color: "var(--check-fail)", fontSize: 18 }}>✗</span>
  );
}

/* ───────────── Main App ───────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCard, setExpandedCard] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: "📊" },
    { id: "performance", label: "Performance FPS", icon: "🚀" },
    { id: "features", label: "Matrice features", icon: "🔧" },
    { id: "recommendation", label: "Recommandations", icon: "💡" },
  ];

  return (
    <div style={s.page}>
      <div style={s.grain} />

      <style>{`
        /* ─── Responsive Grid ─── */
        .lib-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
        }
        @media (max-width: 720px) {
          .lib-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 24px !important; }
          .hero-sub { font-size: 13px !important; }
          .tab-bar { overflow-x: auto; flex-wrap: nowrap !important; padding-bottom: 4px; }
          .tab-btn { white-space: nowrap; font-size: 12px !important; padding: 8px 14px !important; }
          .feat-table { font-size: 11px !important; }
          .feat-table th, .feat-table td { padding: 8px 6px !important; }
          .section-pad { padding: 0 4px; }
          .fps-bar-label { width: 70px !important; font-size: 11px !important; }
          .fps-bar-value { width: 48px !important; font-size: 12px !important; }
          .cta-box { flex-direction: column !important; text-align: center; }
          .cta-box > div:last-child { margin-top: 16px; }
          .reco-card { flex-direction: column !important; }
          .reco-icon { font-size: 24px !important; }
        }

        /* ─── Animations ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-in { animation: fadeUp 0.5s ease-out forwards; }
        .anim-d1 { animation-delay: 0.05s; opacity: 0; }
        .anim-d2 { animation-delay: 0.1s; opacity: 0; }
        .anim-d3 { animation-delay: 0.15s; opacity: 0; }
        .anim-d4 { animation-delay: 0.2s; opacity: 0; }
        .anim-d5 { animation-delay: 0.25s; opacity: 0; }

        /* ─── FPS Bars ─── */
        .fps-bar-row {
          display: flex; align-items: center; gap: 12px;
          padding: 7px 12px; border-radius: 8px;
          transition: background 0.15s;
        }
        .fps-bar-row:hover { background: var(--bg-overlay-hover); }
        .fps-bar-label {
          width: 100px; font-size: 13px; font-weight: 500;
          color: var(--text-secondary); flex-shrink: 0;
        }
        .fps-bar-track {
          flex: 1; height: 26px; border-radius: 6px;
          background: var(--bg-overlay-medium);
          overflow: hidden;
        }
        .fps-bar-fill {
          height: 100%; border-radius: 6px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .fps-bar-value {
          width: 56px; text-align: right; font-size: 14px; font-weight: 600;
        }

        /* ─── Cards ─── */
        .lib-card {
          padding: 24px; border-radius: 14px;
          border: 1px solid var(--border-card);
          background: var(--bg-card);
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .lib-card:hover {
          border-color: var(--border-card-hover);
          background: var(--bg-card-hover);
          transform: translateY(-2px);
        }

        /* ─── Table ─── */
        .feat-table {
          width: 100%; border-collapse: separate; border-spacing: 0;
          font-size: 13px;
        }
        .feat-table th {
          padding: 12px 14px; text-align: center;
          border-bottom: 1px solid var(--border-table-header);
          font-weight: 600; font-size: 12px;
          position: sticky; top: 0; z-index: 2;
          background: var(--bg-table-header);
        }
        .feat-table th:first-child {
          text-align: left; color: var(--text-muted);
          font-size: 11px; text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .feat-table td {
          padding: 10px 14px; text-align: center;
          border-bottom: 1px solid var(--border-table-row);
        }
        .feat-table td:first-child {
          text-align: left; color: var(--text-secondary); font-weight: 500;
          position: sticky; left: 0; z-index: 1;
        }
        .feat-table tr:nth-child(even) td {
          background: var(--bg-table-row-even);
        }
        .feat-table tr:nth-child(even) td:first-child {
          background: var(--bg-table-row-even-sticky);
        }
        .feat-table tr:nth-child(odd) td:first-child {
          background: var(--bg-table-row-odd-sticky);
        }

        /* ─── Tab buttons ─── */
        .tab-btn {
          padding: 10px 20px; border-radius: 10px;
          border: 1px solid var(--border-tab);
          background: var(--bg-tab);
          color: var(--text-tab); cursor: pointer;
          font-size: 13px; font-weight: 500;
          font-family: inherit;
          transition: all 0.2s;
          display: flex; align-items: center; gap: 8px;
        }
        .tab-btn:hover { background: var(--bg-tab-hover); color: var(--text-tab-hover); }
        .tab-btn.active {
          border-color: var(--border-tab-active);
          background: var(--bg-tab-active);
          color: var(--text-primary);
        }

        /* ─── Links ─── */
        a { color: inherit; text-decoration: none; }
        a:hover { text-decoration: underline; }

        /* ─── CTA ─── */
        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: #fff; font-weight: 600; font-size: 14px;
          border: none; cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
        }
        .cta-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(231, 76, 60, 0.25);
          text-decoration: none;
        }
        .cta-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 28px; border-radius: 10px;
          background: transparent;
          border: 1px solid var(--border-ghost);
          color: var(--text-ghost); font-weight: 500; font-size: 14px;
          cursor: pointer; font-family: inherit;
          transition: all 0.2s;
          text-decoration: none;
        }
        .cta-btn-ghost:hover {
          border-color: var(--border-ghost-hover);
          background: var(--bg-ghost-hover);
          text-decoration: none;
        }
      `}</style>

      {/* ════════════ HERO ════════════ */}
      <header style={{ ...s.wrap, paddingTop: 56, paddingBottom: 24, position: "relative" }}>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
        <div className="anim-in" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: "linear-gradient(135deg, #e74c3c, #f39c12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, flexShrink: 0,
          }}>⚡</div>
          <div>
            <h1 className="hero-title" style={{
              fontSize: 30, fontWeight: 700, margin: 0, lineHeight: 1.2,
              background: "var(--hero-title-gradient)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Benchmark Canvas JS
            </h1>
            <p className="hero-sub" style={{ color: "var(--text-tertiary)", fontSize: 14, margin: "4px 0 0" }}>
              Fabric.js vs Konva.js vs PixiJS vs Paper.js vs p5.js — Comparatif complet
            </p>
          </div>
        </div>

        <div className="anim-in anim-d2" style={{
          display: "flex", gap: 20, flexWrap: "wrap",
          marginTop: 20, paddingTop: 16, paddingBottom: 8,
          borderTop: "1px solid var(--border-subtle)",
        }}>
          {[
            { label: "Librairies comparées", value: "5" },
            { label: "Critères analysés", value: "15+" },
            { label: "Navigateurs testés", value: "3" },
            { label: "Dernière MàJ", value: "Mars 2025" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ ...s.mono, fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{stat.value}</span>
              <span style={{ fontSize: 12, color: "var(--text-tertiary)" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ════════════ TABS ════════════ */}
      <nav style={s.wrap}>
        <div className="tab-bar anim-in anim-d3" style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            >
              <span style={{ fontSize: 15 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ════════════ CONTENT ════════════ */}
      <main style={s.wrap} className="section-pad">

        {/* ─── Overview ─── */}
        {activeTab === "overview" && (
          <div className="anim-in">
            <div className="lib-grid">
              {libraries.map((lib, i) => {
                const isOpen = expandedCard === lib.id;
                return (
                  <div
                    key={lib.id}
                    className={`lib-card anim-in anim-d${i + 1}`}
                    onClick={() => setExpandedCard(isOpen ? null : lib.id)}
                    style={{
                      borderColor: isOpen ? lib.color + "50" : undefined,
                      background: isOpen ? `linear-gradient(160deg, ${lib.color}${theme === "dark" ? "08" : "12"}, transparent)` : undefined,
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: 30 }}>{lib.icon}</span>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{lib.name}</h2>
                        <span style={{ ...s.mono, fontSize: 11, color: lib.color }}>{lib.version}</span>
                      </div>
                      <div style={{
                        ...s.mono, padding: "4px 10px", borderRadius: 6,
                        background: "var(--bg-input)",
                        fontSize: 11, color: "var(--text-stat)",
                      }}>{lib.bundleSize}</div>
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "flex", gap: 16, marginBottom: 14, fontSize: 12, color: "var(--text-meta)" }}>
                      <span>⭐ {lib.stars}</span>
                      <span>📦 {lib.downloads}/sem</span>
                      <span>📄 {lib.license}</span>
                    </div>

                    {/* Best for */}
                    <p style={{ fontSize: 12, color: "var(--text-stat)", marginBottom: 14, lineHeight: 1.5 }}>
                      <strong style={{ color: "var(--text-heading-alt)" }}>Idéal pour :</strong> {lib.bestFor}
                    </p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {lib.tags.map((tag) => (
                        <span key={tag} style={{
                          padding: "3px 10px", borderRadius: 20,
                          background: lib.color + "15",
                          color: lib.color, fontSize: 11, fontWeight: 500,
                        }}>{tag}</span>
                      ))}
                    </div>

                    {/* Tech badges */}
                    <div style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 11 }}>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4,
                        background: "var(--bg-overlay-medium)", color: "var(--text-meta)",
                      }}>{lib.rendering}</span>
                      {lib.typescript && <span style={{
                        padding: "2px 8px", borderRadius: 4,
                        background: "#3178c612", color: "#3178c6",
                      }}>TS</span>}
                      {lib.nodeSupport && <span style={{
                        padding: "2px 8px", borderRadius: 4,
                        background: "#68a06312", color: "#68a063",
                      }}>Node</span>}
                    </div>

                    {/* Expanded pros/cons */}
                    {isOpen && (
                      <div style={{
                        marginTop: 20, paddingTop: 18,
                        borderTop: "1px solid var(--border-card)",
                      }}>
                        <div style={{ marginBottom: 16 }}>
                          <h4 style={{ fontSize: 12, color: "#4ade80", margin: "0 0 8px", fontWeight: 600 }}>
                            ✅ Avantages
                          </h4>
                          {lib.pros.map((p, j) => (
                            <p key={j} style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 4px", paddingLeft: 14 }}>
                              • {p}
                            </p>
                          ))}
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <h4 style={{ fontSize: 12, color: "#f87171", margin: "0 0 8px", fontWeight: 600 }}>
                            ⚠️ Inconvénients
                          </h4>
                          {lib.cons.map((c, j) => (
                            <p key={j} style={{ fontSize: 12, color: "var(--text-secondary)", margin: "0 0 4px", paddingLeft: 14 }}>
                              • {c}
                            </p>
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          <a href={lib.url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: lib.color, fontWeight: 500 }}>
                            🌐 Site officiel →
                          </a>
                          <a href={lib.github} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "var(--text-stat)", fontWeight: 500 }}>
                            GitHub →
                          </a>
                          <a href={lib.npm} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "var(--text-stat)", fontWeight: 500 }}>
                            npm →
                          </a>
                        </div>
                      </div>
                    )}

                    <p style={{
                      fontSize: 11, color: "var(--text-card-action)", textAlign: "center",
                      marginTop: 14, marginBottom: 0,
                    }}>
                      {isOpen ? "Cliquer pour réduire" : "Cliquer pour voir les détails"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── Performance ─── */}
        {activeTab === "performance" && (
          <div className="anim-in">
            <div style={{
              padding: 18, borderRadius: 12, marginBottom: 24,
              background: "var(--bg-overlay-subtle)",
              border: "1px solid var(--border-card)",
            }}>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                📋 <strong style={{ color: "var(--text-secondary)" }}>Méthodologie :</strong> Rendu de 8 000 rectangles animés — mesure en FPS (images/seconde).
                Source : <a href="https://github.com/slaylines/canvas-engines-comparison" target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--text-link-method)" }}>canvas-engines-comparison</a> sur GitHub.
                Machine : MacBook Pro 2019. Plus le FPS est élevé, mieux c'est. 60 FPS = fluidité parfaite.
              </p>
            </div>

            {["Chrome", "Firefox", "Safari"].map((browser) => {
              const key = `fps${browser}`;
              const sorted = [...libraries].sort((a, b) => b[key] - a[key]);
              const browserIcon = browser === "Chrome" ? "🌐" : browser === "Firefox" ? "🦊" : "🧭";

              return (
                <section key={browser} style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14, color: "var(--text-heading-alt)" }}>
                    {browserIcon} {browser}
                  </h3>
                  {sorted.map((lib, i) => (
                    <FpsBar
                      key={lib.id}
                      fps={lib[key]}
                      maxFps={60}
                      color={lib.color}
                      label={lib.name.replace(".js", "")}
                      icon={lib.icon}
                      delay={i * 100}
                    />
                  ))}
                </section>
              );
            })}

            {/* Insight box */}
            <div style={{
              padding: 20, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(74,222,128,0.05), rgba(59,130,246,0.05))",
              border: "1px solid rgba(74,222,128,0.1)",
              lineHeight: 1.7, fontSize: 13, color: "var(--text-secondary)",
            }}>
              <strong style={{ color: theme === "dark" ? "#4ade80" : "#1a1a2e" }}>💡 Analyse :</strong>
              <br /><br />
              <strong style={{ color: "#e91e63" }}>PixiJS</strong> domine largement grâce au rendu WebGL qui décharge les calculs sur le GPU.
              C'est la seule lib à tenir 60 FPS sur Chrome avec 8k objets.
              <br /><br />
              <strong style={{ color: "#3b82f6" }}>Konva.js</strong> est ~2.5× plus rapide que Fabric.js sur Chrome
              grâce à son système de layers et sa détection de zones modifiées (dirty regions).
              <br /><br />
              <strong style={{ color: "#e74c3c" }}>Fabric.js</strong> est la plus lente en rendu pur, mais compense
              par sa richesse fonctionnelle. Si votre app n'anime pas des milliers d'objets simultanément,
              ses performances sont largement suffisantes.
              <br /><br />
              <strong style={{ color: "#8b5cf6" }}>p5.js</strong> est étonnamment performant sur Safari (44 FPS),
              probablement grâce à des optimisations spécifiques du moteur WebKit pour son approche frame-based.
            </div>
          </div>
        )}

        {/* ─── Features ─── */}
        {activeTab === "features" && (
          <div className="anim-in" style={{ overflowX: "auto", borderRadius: 14, border: "1px solid var(--border-card)" }}>
            <table className="feat-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 150 }}>Feature</th>
                  {libraries.map((lib) => (
                    <th key={lib.id} style={{ color: lib.color, whiteSpace: "nowrap", minWidth: 90 }}>
                      {lib.icon} {lib.name.replace(".js", "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((feat) => (
                  <tr key={feat.key}>
                    <td>{feat.label}</td>
                    {libraries.map((lib) => (
                      <td key={lib.id}>
                        {feat.bool ? (
                          <Check val={lib[feat.key]} />
                        ) : (
                          <span style={{ ...s.mono, fontSize: 11, color: "var(--text-mono)" }}>
                            {lib[feat.key]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Extra rows */}
                <tr>
                  <td>Bundle Size (gzip)</td>
                  {libraries.map((lib) => (
                    <td key={lib.id} style={{ ...s.mono, fontSize: 11, color: "var(--text-mono)" }}>
                      {lib.bundleSize}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Stars GitHub</td>
                  {libraries.map((lib) => (
                    <td key={lib.id} style={{ ...s.mono, fontSize: 11, color: "#fbbf24" }}>
                      ⭐ {lib.stars}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Downloads / semaine</td>
                  {libraries.map((lib) => (
                    <td key={lib.id} style={{ ...s.mono, fontSize: 11, color: "var(--text-mono)" }}>
                      {lib.downloads}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>FPS Chrome (8k obj)</td>
                  {libraries.map((lib) => {
                    const c = lib.fpsChrome >= 30 ? "#4ade80" : lib.fpsChrome >= 15 ? "#fbbf24" : "#f87171";
                    return (
                      <td key={lib.id} style={{ ...s.mono, fontSize: 13, fontWeight: 600, color: c }}>
                        {lib.fpsChrome}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ─── Recommendations ─── */}
        {activeTab === "recommendation" && (
          <div className="anim-in">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-heading)", marginBottom: 6 }}>
              Quelle lib choisir selon votre projet ?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
              Le bon choix dépend entièrement de votre use case. Voici nos recommandations :
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {recommendations.map((rec, i) => {
                const lib = libraries.find((l) => l.name === rec.winner);
                return (
                  <div key={rec.useCase}
                    className={`reco-card anim-in anim-d${i + 1}`}
                    style={{
                      padding: 22, borderRadius: 14,
                      background: "var(--bg-card)",
                      border: `1px solid ${lib?.color || "#333"}20`,
                      display: "flex", gap: 18, alignItems: "flex-start",
                    }}
                  >
                    <span className="reco-icon" style={{ fontSize: 34, lineHeight: 1, flexShrink: 0 }}>{rec.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600, color: "var(--text-heading)" }}>
                        {rec.useCase}
                      </h3>
                      <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--text-stat)", lineHeight: 1.6 }}>
                        {rec.why}
                      </p>
                      <a href={lib?.url} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 14px", borderRadius: 8,
                        background: `${lib?.color}15`,
                        color: lib?.color,
                        fontSize: 13, fontWeight: 600,
                      }}>
                        {lib?.icon} {rec.winner} →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Decision tree */}
            <div style={{
              marginTop: 28, padding: 24, borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "var(--text-heading)" }}>
                🌳 Arbre de décision rapide
              </h3>
              <div style={{ ...s.mono, fontSize: 12, color: "var(--text-secondary)", lineHeight: 2.2 }}>
                <div>Besoin de 60 FPS / jeux / WebGL ?</div>
                <div style={{ paddingLeft: 20, color: "#e91e63" }}>→ <strong>PixiJS</strong></div>
                <div style={{ marginTop: 8 }}>Besoin d'interactions objet (drag, resize, rotate) ?</div>
                <div style={{ paddingLeft: 20 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Avec React/Vue ?</span>
                  <span style={{ color: "#3b82f6" }}> → <strong>Konva.js</strong></span>
                </div>
                <div style={{ paddingLeft: 20 }}>
                  <span style={{ color: "var(--text-tertiary)" }}>Éditeur complet (texte, filtres, SVG) ?</span>
                  <span style={{ color: "#e74c3c" }}> → <strong>Fabric.js</strong></span>
                </div>
                <div style={{ marginTop: 8 }}>Dessin vectoriel / géométrie avancée ?</div>
                <div style={{ paddingLeft: 20, color: "#f59e0b" }}>→ <strong>Paper.js</strong></div>
                <div style={{ marginTop: 8 }}>Prototypage / apprentissage / art ?</div>
                <div style={{ paddingLeft: 20, color: "#8b5cf6" }}>→ <strong>p5.js</strong></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ════════════ CTA CONSULTING ════════════ */}
      <section style={{ ...s.wrap, marginTop: 56 }}>
        <div className="cta-box" style={{
          padding: 32, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(231,76,60,0.08), rgba(59,130,246,0.08))",
          border: "1px solid rgba(231,76,60,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24,
        }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>
              Besoin d'aide pour votre projet Canvas ?
            </h3>
            <p style={{ margin: 0, fontSize: 14, color: "var(--text-stat)", lineHeight: 1.6 }}>
              Je développe des applications web avec des interfaces canvas complexes
              (éditeurs visuels, dashboards interactifs, outils de design).
              Disponible en freelance pour du conseil et du développement.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0, flexWrap: "wrap" }}>
            <a href="https://elouanb7.com" target="_blank" rel="noopener noreferrer" className="cta-btn">
              🚀 Voir mon portfolio
            </a>
            <a href="https://github.com/elouanb7" target="_blank" rel="noopener noreferrer" className="cta-btn-ghost">
              GitHub →
            </a>
          </div>
        </div>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{
        ...s.wrap,
        paddingTop: 32,
        paddingBottom: 32,
        marginTop: 40,
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-subtle)" }}>
              Données : <a href="https://github.com/slaylines/canvas-engines-comparison" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link-footer)" }}>canvas-engines-comparison</a>,{" "}
              <a href="https://npmtrends.com/fabric-vs-konva-vs-pixi.js" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link-footer)" }}>npm trends</a>,{" "}
              <a href="https://bestofjs.org" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link-footer)" }}>Best of JS</a>
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-very-subtle)" }}>
              Les données de performance peuvent varier selon le hardware.
            </p>
          </div>
          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
            <a href="https://elouanb7.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link-footer)" }}>Portfolio</a>
            <a href="https://github.com/elouanb7" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-link-footer)" }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
