import { useEffect, useRef, useState } from "react";
import { useStore } from "../store.jsx";
import { ENTITY, KEYS, LABELS, dependents } from "../lib/schema.js";

const toInput = (v) => (v == null ? "" : String(v));

function parse(col, raw) {
  if (raw === "") return null;
  if (col.t === "ref") return isNaN(+raw) ? raw : +raw;
  if (col.t === "money" || col.t === "qty") return +raw;
  return raw.trim();
}

/** Modal for adding, editing, viewing (read-only role) and deleting one record. */
export default function RecordForm({ ent, row, onClose }) {
  const { db, canEdit, saveRecord, deleteRecord, toast } = useStore();
  const ro = !canEdit;
  const isNew = !row;
  const cols = ent.cols.filter((c) => c.t !== "id");
  const idCol = ent.cols.find((c) => c.t === "id");
  const title = isNew
    ? `New ${ent.title.toLowerCase().replace(/s$/, "")}`
    : `${ent.title.replace(/s$/, "")}${idCol ? " " + row[idCol.k] : ""}`;

  const [values, setValues] = useState(() => Object.fromEntries(cols.map((c) => [c.k, toInput(row?.[c.k])])));
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const firstField = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    firstField.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeRef.current();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const readValues = (vals) => {
    const data = Object.fromEntries(cols.map((c) => [c.k, parse(c, vals[c.k])]));
    return ent.compute ? ent.compute(data) : data;
  };

  const change = (k, v) => {
    const next = { ...values, [k]: v };
    if (ent.compute) {
      const calc = readValues(next);
      cols.filter((c) => c.calc).forEach((c) => { next[c.k] = toInput(calc[c.k]); });
    }
    setValues(next);
  };

  const submit = (e) => {
    e.preventDefault();
    setFormError(null);
    const data = readValues(values);
    const errs = {};
    cols.forEach((c) => { if (c.req && data[c.k] == null) errs[c.k] = "Required."; });
    Object.assign(errs, ent.validate ? ent.validate(data) : {});
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const dbError = saveRecord(ent.id, row, data);
    if (dbError) return setFormError(`The database rejected this: ${dbError}`);
    onClose();
    toast(isNew ? "Record added" : "Changes saved");
  };

  const remove = () => {
    const deps = dependents(db, ent.id, row);
    const blocking = deps.filter((d) => !d.cascade);
    if (blocking.length) {
      alert(`This can't be deleted yet: ${blocking.map((d) => `${d.n} ${ENTITY[d.table].title.toLowerCase()}`).join(", ")} still point to it.\n\nThe database's foreign keys block this delete.`);
      return;
    }
    const casc = deps.find((d) => d.cascade);
    const msg = casc
      ? `Delete this record and its ${casc.n} linked contract${casc.n > 1 ? "s" : ""}?\n\n(The database cascades this delete with ON DELETE CASCADE.)`
      : "Delete this record?";
    if (!confirm(msg)) return;
    const res = deleteRecord(ent.id, row);
    if (res.error) return setFormError(`The database refused: ${res.error}`);
    onClose();
    toast(res.cascaded ? `Deleted, plus ${res.cascaded} contract${res.cascaded > 1 ? "s" : ""}` : "Deleted");
  };

  const input = (c, i) => {
    const common = {
      id: `f-${c.k}`, name: c.k, value: values[c.k], disabled: ro || c.calc,
      onChange: (e) => change(c.k, e.target.value), ref: i === 0 ? firstField : undefined,
      "aria-invalid": errors[c.k] ? true : undefined,
    };
    if (c.t === "ref") {
      return (
        <select {...common}>
          <option value="">—</option>
          {db[c.ref].map((r) => <option key={r._rid} value={r[KEYS[c.ref]]}>{LABELS[c.ref](r)}</option>)}
        </select>
      );
    }
    const type = { money: "number", qty: "number", date: "date", datetime: "datetime-local" }[c.t] || "text";
    return <input type={type} step={type === "number" ? "any" : undefined} {...common} />;
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="card modal" role="dialog" aria-modal="true" aria-label={title} noValidate onSubmit={submit}>
        <header>
          <h2>{title}</h2>
          <button type="button" className="ghost" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="form-grid">
          {cols.map((c, i) => (
            <label className="field" key={c.k} htmlFor={`f-${c.k}`}>
              <span>{c.l}{c.req && !ro ? " *" : ""}{c.calc && <span className="hint"> (calculated)</span>}</span>
              {input(c, i)}
              {c.hint && !ro && <span className="hint">{c.hint}</span>}
              {errors[c.k] && <span className="err">{errors[c.k]}</span>}
            </label>
          ))}
        </div>
        {formError && <p className="err" role="alert" style={{ margin: "0 20px 14px", fontSize: 13 }}>{formError}</p>}
        <footer>
          {!isNew && !ro && <button type="button" className="danger left" onClick={remove}>Delete</button>}
          <button type="button" onClick={onClose}>{ro ? "Close" : "Cancel"}</button>
          {!ro && <button type="submit" className="primary">{isNew ? "Add record" : "Save changes"}</button>}
        </footer>
      </form>
    </div>
  );
}
