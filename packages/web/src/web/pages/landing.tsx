const features = [
  {
    label: "Kanban Board",
    desc: "Drag sticky notes across columns. Todo, In Progress, Half Done, Review, Done — your flow, your rules.",
    color: "note-yellow",
  },
  {
    label: "Timeline View",
    desc: "See every task on a Gantt-style timeline. Spot blockers before they become problems.",
    color: "note-blue",
  },
  {
    label: "Dashboard",
    desc: "Live stats on total, completed, in-progress, and half-done tasks at a glance.",
    color: "note-green",
  },
  {
    label: "Priority Flags",
    desc: "High, medium, low. Color-coded sticky notes so urgency is always visible.",
    color: "note-pink",
  },
  {
    label: "Due Dates",
    desc: "Set deadlines on any card. Never lose track of what's shipping this week.",
    color: "note-orange",
  },
  {
    label: "Fast & Local",
    desc: "No cloud lag. Everything persists instantly. Reload and your work is exactly where you left it.",
    color: "note-purple",
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", color: "#0a0a0a", overflowX: "hidden" }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#e0ddd8] sticky top-0 bg-[#fafaf8] z-50">
        <div className="flex items-center gap-1">
          {["S","C","R","U","M"].map(l => (
            <img key={l} src={`/logo/${l}.png?v=9`} className="h-8 w-auto" alt={l} />
          ))}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <a href="#features" className="font-nav text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors text-sm hidden sm:inline">Features</a>
          <a href="#how" className="font-nav text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors text-sm hidden sm:inline">How it works</a>
          <a
            href="/app"
            className="font-nav motion-button bg-[#0a0a0a] text-[#fafaf8] px-3 py-2 text-sm hover:bg-[#333] transition-colors whitespace-nowrap"
          >
            Open App →
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative px-8 pt-24 pb-20 overflow-hidden"
        style={{
          backgroundImage: 'url("/bg/hero-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 lg:gap-10 items-center min-h-[calc(100vh-180px)]">
            <div className="hero-copy flex flex-col gap-6 max-w-xl pt-6 sm:pt-10">
              <span className="label-caps">Project management — reimagined</span>
              <h1
                className="font-note-heading text-[clamp(3.4rem,8vw,6.8rem)] leading-[0.9] tracking-[-0.05em] text-[#101010] drop-shadow-[0_1px_0_rgba(255,255,255,0.5)]"
                style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 600 }}
              >
                Ship faster.<br />
                Stay sane.<br />
                Use Scrum.
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <a
                  href="/app"
                  className="font-nav motion-button bg-[#0a0a0a] text-[#fafaf8] px-6 py-3 text-sm hover:bg-[#262626] transition-colors shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                >
                  Start for free →
                </a>
                <a href="#features" className="font-nav text-sm text-[#4f4f4f] hover:text-[#0a0a0a] transition-colors underline underline-offset-4">
                  See features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#e0ddd8]" />

      {/* Features */}
      <section id="features" className="px-8 py-24 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <h2
            className="font-note-heading text-[52px] leading-none tracking-[-1px]"
            style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 600 }}
          >
            Everything you need.<br />Nothing extra.
          </h2>
          <span className="label-caps text-[#6b6b6b]">v1.0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`sticky-note feature-note ${f.color} p-6 cursor-default`}
              style={{
                transform: `rotate(${(i % 2 === 0 ? -0.5 : 0.5)}deg)`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <span className="label-caps mb-3 block">{`0${i + 1}`}</span>
              <h3 className="font-note-heading text-[22px] mb-2">{f.label}</h3>
              <p className="font-note-body text-[#6b6b6b]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#e0ddd8]" />

      {/* How it works */}
      <section id="how" className="px-8 py-24 max-w-6xl mx-auto">
        <h2
          className="font-note-heading text-[52px] leading-none tracking-[-1px] mb-16"
          style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 600 }}
        >
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#e0ddd8]">
          {[
            { step: "01", title: "Create tasks", body: "Hit + New Task. Give it a title, color, priority, and due date. Takes 5 seconds." },
            { step: "02", title: "Drag & drop", body: "Move cards across columns as work progresses. The board saves instantly — no manual sync." },
            { step: "03", title: "Ship it", body: "Watch your Done column fill up. Dashboard tracks completion in real time." },
          ].map((s, i) => (
            <div
              key={i}
              className="p-8 border-r border-[#e0ddd8] last:border-r-0"
            >
              <span className="label-caps text-[#0a0a0a] mb-4 block">{s.step}</span>
              <h3 className="font-note-heading text-[28px] mb-3" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 600 }}>{s.title}</h3>
              <p className="font-note-body text-[#6b6b6b]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-full border-t border-[#e0ddd8]" />

      {/* CTA */}
      <section className="px-8 py-28 max-w-6xl mx-auto text-center">
        <h2
          className="font-note-heading text-[64px] leading-none tracking-[-2px] mb-6"
          style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 600 }}
        >
          Ready to get things done?
        </h2>
        <p className="font-note-body text-[16px] text-[#6b6b6b] mb-10">
          No signup. No credit card. Just open the app and start building.
        </p>
        <a
          href="/app"
          className="font-nav motion-button bg-[#0a0a0a] text-[#fafaf8] px-10 py-4 text-sm hover:bg-[#333] transition-colors inline-block"
        >
          Open Scrum → Free forever
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e0ddd8] px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-1">
            {["S","C","R","U","M"].map(l => (
              <img key={l} src={`/logo/${l}.png?v=9`} className="h-5 w-auto" alt={l} />
            ))}
          </div>
          <span className="label-caps text-[#6b6b6b] text-[10px]">© 2026 Scrum · Built with chaos</span>
          <a href="/app" className="font-nav text-xs text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">Open App →</a>
        </div>
      </footer>
    </div>
  );
}
