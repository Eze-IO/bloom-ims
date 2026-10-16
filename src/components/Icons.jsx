const PATHS = {
  dashboard: <path d="M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z" fill="currentColor" />,
  records: <path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z" fill="none" stroke="currentColor" strokeWidth="2" />,
  workflow: <path d="M5 3v6m0 6v6M5 9a3 3 0 100 6 3 3 0 000-6zm14-6v18M8 12h11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  reports: <path d="M4 20V10m6 10V4m6 16v-7m4 7H2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  users: <path d="M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zm13 9v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  about: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 11v6m0-10v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

export function Icon({ name }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{PATHS[name]}</svg>;
}

export function Logo() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#22b8cf" />
      <g fill="#04161c" transform="translate(16 16)">
        {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-6.5" rx="3.6" ry="5.6" transform={`rotate(${a})`} opacity=".85" />)}
        <circle r="3" fill="#22b8cf" stroke="#04161c" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

export function Brand() {
  return (
    <div className="brand">
      <Logo />
      <div>Bloom IMS<small>POLYMER TRADING</small></div>
    </div>
  );
}
