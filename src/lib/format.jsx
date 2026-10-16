export const money = (n) =>
  n == null || n === ""
    ? "—"
    : (n < 0 ? "−$" : "$") + Math.abs(+n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const qty = (n) => (n == null || n === "" ? "—" : (+n).toLocaleString("en-US", { maximumFractionDigits: 2 }));

export function date(s) {
  if (!s) return "—";
  const d = new Date(s.length <= 10 ? s + "T00:00" : s);
  return isNaN(d) ? s : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function Signed({ value }) {
  return <span className={value > 0 ? "pos" : value < 0 ? "neg" : ""}>{money(value)}</span>;
}
