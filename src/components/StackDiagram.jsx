// Diagram of how Bloom IMS runs today. Colors come from CSS variables so it follows light and dark mode.

function Box({ x, y, w = 180, h = 62, title, sub, accent }) {
  return (
    <g>
      <rect className={`box ${accent ? "accent" : ""}`} x={x} y={y} width={w} height={h} rx="10" />
      <text className="title" x={x + w / 2} y={y + (sub ? 26 : h / 2 + 5)} textAnchor="middle">{title}</text>
      {sub && <text className="sub" x={x + w / 2} y={y + 45} textAnchor="middle">{sub}</text>}
    </g>
  );
}

function Edge({ d, label, lx, ly, both }) {
  return (
    <g>
      <path className="edge" d={d} markerEnd="url(#arch-arrow)" markerStart={both ? "url(#arch-arrow)" : undefined} />
      {label && <text className="sub" x={lx} y={ly} textAnchor="middle">{label}</text>}
    </g>
  );
}

export default function StackDiagram() {
  return (
    <>
      <p className="scroll-hint">Scroll sideways to see the whole diagram →</p>
      <div className="arch-wrap">
        <svg className="arch" viewBox="0 0 760 360" role="img"
          aria-labelledby="arch-title arch-desc">
          <title id="arch-title">How Bloom IMS runs today</title>
          <desc id="arch-desc">
            Pushing to the GitHub repo runs GitHub Actions, which builds the site with Vite and publishes it to GitHub Pages.
            The browser downloads the React app and the bloom.sqlite file. sql.js opens the file as a SQLite database in WebAssembly.
            React pages read and write it through the store with SQL, and edits are saved to IndexedDB.
          </desc>
          <defs>
            <marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" />
            </marker>
          </defs>

          {/* Build and deploy */}
          <text className="zone-label" x="20" y="24">Build and deploy</text>
          <Box x={20} y={40} title="GitHub Pages" sub="static hosting" accent />
          <Box x={20} y={160} title="GitHub Actions" sub="npm ci · vite build" />
          <Box x={20} y={280} title="GitHub repo" sub="push to main" />
          <Edge d="M110,280 L110,224" />
          <Edge d="M110,160 L110,104" />

          {/* Browser */}
          <rect className="zone" x="270" y="12" width="476" height="336" rx="14" />
          <text className="zone-label" x="288" y="34">Your browser</text>
          <Box x={290} y={52} title="bloom.sqlite" sub="the database file" accent />
          <Box x={290} y={160} title="SQLite engine" sub="sql.js · WebAssembly" accent />
          <Box x={290} y={272} title="IndexedDB" sub="your saved edits" />
          <Box x={540} y={52} w={190} title="React 18 UI" sub="Dashboard · Records · Reports" />
          <Box x={540} y={160} w={190} title="App store" sub="parameterized SQL" />

          <Edge d="M200,72 L288,80" label="app + data" lx="233" ly="60" />
          <Edge d="M380,114 L380,158" label="opens" lx="404" ly="140" />
          <Edge d="M380,222 L380,270" both label="saves / reloads" lx="430" ly="250" />
          <Edge d="M472,191 L538,191" both label="SQL" lx="505" ly="183" />
          <Edge d="M635,158 L635,116" both label="rows" lx="656" ly="140" />
        </svg>
      </div>
    </>
  );
}
