import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Sora', sans-serif;
    background: #0d0d0d;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Wrapper ── */
  .sd-wrapper {
    position: relative;
    width: 100%;
  }

  .sd-floating-label {
    position: absolute;
    top: -9px;
    left: 14px;
    background: #161616;
    padding: 0 5px;
    font-size: 11.5px;
    font-weight: 500;
    color: #888;
    letter-spacing: 0.04em;
    pointer-events: none;
    z-index: 2;
    transition: color 0.2s;
    line-height: 1;
    white-space: nowrap;
  }

  .sd-wrapper.is-open .sd-floating-label { color: #e8ff5a; }

  /* ── Trigger ── */
  .sd-trigger {
    width: 100%;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 13px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s;
    user-select: none;
    min-height: 48px;
  }

  .sd-trigger:hover { border-color: #444; }

  .sd-trigger.open {
    border-color: #e8ff5a;
    box-shadow: 0 0 0 3px rgba(232,255,90,0.08);
    border-radius: 12px 12px 0 0;
    border-bottom-color: #222;
  }

  .sd-trigger-left {
    display: flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    min-width: 0;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .sd-placeholder { font-size: 13px; color: #555; font-weight: 400; }

  .sd-single-value { font-size: 13px; color: #ddd; font-weight: 400; }

  .sd-tag {
    background: #e8ff5a;
    color: #0d0d0d;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .sd-overflow-tag {
    background: #252525;
    color: #888;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .sd-chevron {
    width: 18px;
    height: 18px;
    color: #555;
    flex-shrink: 0;
    transition: transform 0.25s ease, color 0.2s;
  }

  .sd-trigger.open .sd-chevron { transform: rotate(180deg); color: #e8ff5a; }

  /* ── Panel ── */
  .sd-panel {
    position: absolute;
    top: calc(100% - 1px);
    left: 0;
    right: 0;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-top: 1px solid #1e1e1e;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    z-index: 100;
    animation: sd-slide 0.18s ease;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  }

  @keyframes sd-slide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Search ── */
  .sd-search-wrap {
    padding: 10px 12px;
    border-bottom: 1px solid #1e1e1e;
  }

  .sd-search-icon-wrap { position: relative; }

  .sd-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #444;
    pointer-events: none;
  }

  .sd-search-input {
    width: 100%;
    background: #1e1e1e;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 8px 12px 8px 34px;
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    color: #ccc;
    outline: none;
    transition: border-color 0.2s;
  }

  .sd-search-input::placeholder { color: #444; }
  .sd-search-input:focus { border-color: #3a3a3a; }

  /* ── Options ── */
  .sd-options {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px 0;
  }

  .sd-options::-webkit-scrollbar { width: 4px; }
  .sd-options::-webkit-scrollbar-track { background: transparent; }
  .sd-options::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  .sd-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 14px;
    cursor: pointer;
    transition: background 0.12s;
    user-select: none;
  }

  .sd-option:hover { background: #1e1e1e; }

  .sd-option.all-opt {
    border-bottom: 1px solid #1e1e1e;
    margin-bottom: 4px;
  }

  .sd-option.selected-opt .sd-option-label { color: #e8ff5a; }

  .sd-option-label { font-size: 13px; color: #ccc; font-weight: 400; flex: 1; }
  .sd-option.all-opt .sd-option-label { font-weight: 500; color: #ddd; }

  /* ── Checkbox ── */
  .sd-checkbox {
    width: 17px;
    height: 17px;
    border-radius: 5px;
    border: 1.5px solid #333;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .sd-checkbox.checked { background: #e8ff5a; border-color: #e8ff5a; }
  .sd-checkbox.indeterminate { background: transparent; border-color: #e8ff5a; }

  .sd-check-icon { width: 10px; height: 10px; color: #0d0d0d; }
  .sd-dash { width: 10px; height: 2px; background: #e8ff5a; border-radius: 1px; }

  /* ── Radio dot (single select) ── */
  .sd-radio {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    border: 1.5px solid #333;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .sd-radio.checked { border-color: #e8ff5a; }
  .sd-radio-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e8ff5a;
  }

  /* ── No results ── */
  .sd-no-results {
    padding: 18px 16px;
    font-size: 13px;
    color: #444;
    text-align: center;
  }

  /* ── Footer (multi only) ── */
  .sd-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-top: 1px solid #1e1e1e;
  }

  .sd-count { font-size: 11px; color: #555; letter-spacing: 0.04em; }

  .sd-clear {
    font-family: 'Sora', sans-serif;
    font-size: 11px;
    font-weight: 500;
    color: #e8ff5a;
    background: none;
    border: none;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0;
    opacity: 0.85;
    transition: opacity 0.15s;
  }

  .sd-clear:hover { opacity: 1; }
`;

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function CheckboxIcon({ checked, indeterminate }) {
  return (
    <div className={`sd-checkbox ${checked ? "checked" : indeterminate ? "indeterminate" : ""}`}>
      {checked && (
        <svg className="sd-check-icon" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1.5,5 4,8 8.5,2" />
        </svg>
      )}
      {indeterminate && !checked && <div className="sd-dash" />}
    </div>
  );
}

function RadioIcon({ checked }) {
  return (
    <div className={`sd-radio ${checked ? "checked" : ""}`}>
      {checked && <div className="sd-radio-dot" />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN REUSABLE COMPONENT

   Props:
   ┌──────────────┬─────────────────────────────────────────────────────────────┐
   │ label        │ string   – floating label text                              │
   │ options      │ { value, label }[]  – list of selectable options            │
   │ multiSelect  │ boolean  – true → multi-select, false → single-select       │
   │ value        │ string | string[]  – controlled value                       │
   │ onChange     │ (value: string | string[]) => void  – change callback       │
   │ placeholder  │ string   – text shown when nothing is selected              │
   │ searchable   │ boolean  – show search box (default true)                   │
   │ maxTags      │ number   – max visible tags before "+N" overflow (default 2)│
   └──────────────┴─────────────────────────────────────────────────────────────┘
───────────────────────────────────────────── */
export function SelectDropdown({
  label = "Select",
  options = [],
  multiSelect = false,
  value,
  onChange,
  placeholder,
  searchable = true,
  maxTags = 2,
}) {
  const isControlled = value !== undefined;

  // Internal state used when uncontrolled
  const [internalValue, setInternalValue] = useState(multiSelect ? [] : null);

  const selected = isControlled ? value : internalValue;

  const handleChange = (next) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Multi helpers
  const allSelected = multiSelect && Array.isArray(selected) && selected.length === options.length;
  const someSelected = multiSelect && Array.isArray(selected) && selected.length > 0 && !allSelected;

  // Close on outside click
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search
  useEffect(() => {
    if (open && searchable && searchRef.current) searchRef.current.focus();
  }, [open, searchable]);

  /* ── Handlers ── */
  const toggleOpen = () => {
    setOpen(o => !o);
    if (open) setSearch("");
  };

  const toggleAll = () => {
    handleChange(allSelected ? [] : options.map(o => o.value));
  };

  const toggleOption = (val) => {
    if (multiSelect) {
      const prev = Array.isArray(selected) ? selected : [];
      handleChange(prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    } else {
      handleChange(val);
      setOpen(false);
      setSearch("");
    }
  };

  const clearAll = () => handleChange(multiSelect ? [] : null);

  /* ── Trigger display ── */
  const renderTriggerContent = () => {
    if (multiSelect) {
      const sel = Array.isArray(selected) ? selected : [];
      if (sel.length === 0) return <span className="sd-placeholder">{placeholder ?? `Select ${label.toLowerCase()}…`}</span>;
      const visible = sel.slice(0, maxTags);
      const overflow = sel.length - visible.length;
      return (
        <>
          {visible.map(v => (
            <span key={v} className="sd-tag">{options.find(o => o.value === v)?.label}</span>
          ))}
          {overflow > 0 && <span className="sd-overflow-tag">+{overflow}</span>}
        </>
      );
    } else {
      const found = options.find(o => o.value === selected);
      if (!found) return <span className="sd-placeholder">{placeholder ?? `Select ${label.toLowerCase()}…`}</span>;
      return <span className="sd-single-value">{found.label}</span>;
    }
  };

  const hasSelection = multiSelect
    ? Array.isArray(selected) && selected.length > 0
    : selected !== null && selected !== undefined;

  return (
    <div className={`sd-wrapper ${open ? "is-open" : ""}`} ref={wrapperRef}>
      <span className="sd-floating-label">{label}</span>

      {/* Trigger */}
      <div className={`sd-trigger ${open ? "open" : ""}`} onClick={toggleOpen}>
        <div className="sd-trigger-left">{renderTriggerContent()}</div>
        <svg className="sd-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Panel */}
      {open && (
        <div className="sd-panel">
          {/* Search */}
          {searchable && (
            <div className="sd-search-wrap">
              <div className="sd-search-icon-wrap">
                <svg className="sd-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchRef}
                  className="sd-search-input"
                  placeholder="Search…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="sd-options">
            {/* All option — multi only */}
            {multiSelect && !search && (
              <div className="sd-option all-opt" onClick={toggleAll}>
                <CheckboxIcon checked={allSelected} indeterminate={someSelected} />
                <span className="sd-option-label">All</span>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="sd-no-results">No results found</div>
            ) : (
              filtered.map(opt => {
                const isSelected = multiSelect
                  ? Array.isArray(selected) && selected.includes(opt.value)
                  : selected === opt.value;

                return (
                  <div
                    key={opt.value}
                    className={`sd-option ${!multiSelect && isSelected ? "selected-opt" : ""}`}
                    onClick={() => toggleOption(opt.value)}
                  >
                    {multiSelect
                      ? <CheckboxIcon checked={isSelected} />
                      : <RadioIcon checked={isSelected} />
                    }
                    <span className="sd-option-label">{opt.label}</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer — multi only */}
          {multiSelect && (
            <div className="sd-footer">
              <span className="sd-count">
                {Array.isArray(selected) ? selected.length : 0} of {options.length} selected
              </span>
              {hasSelection && (
                <button className="sd-clear" onClick={clearAll}>Clear all</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DEMO — shows both modes side by side
───────────────────────────────────────────── */
const DEPARTMENTS = [
  { value: "design",      label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product",     label: "Product" },
  { value: "marketing",   label: "Marketing" },
  { value: "sales",       label: "Sales" },
  { value: "operations",  label: "Operations" },
  { value: "finance",     label: "Finance" },
  { value: "hr",          label: "Human Resources" },
];

const ROLES = [
  { value: "admin",     label: "Admin" },
  { value: "editor",    label: "Editor" },
  { value: "viewer",    label: "Viewer" },
  { value: "developer", label: "Developer" },
  { value: "analyst",   label: "Analyst" },
];

const demoStyle = `
  .demo-page {
    font-family: 'Sora', sans-serif;
    background: #0d0d0d;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 48px;
  }

  .demo-heading {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #444;
    text-align: center;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px 32px;
    width: 100%;
    max-width: 720px;
  }

  @media (max-width: 560px) {
    .demo-grid { grid-template-columns: 1fr; }
  }

  .demo-cell {
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .demo-mode-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 600;
    color: #555;
    margin-bottom: -16px;
  }

  .demo-mode-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e8ff5a;
  }

  .demo-value-preview {
    font-size: 11px;
    color: #3a3a3a;
    font-family: monospace;
    word-break: break-all;
    min-height: 16px;
  }
`;

export default function Demo() {
  const [multiVal, setMultiVal]   = useState([]);
  const [singleVal, setSingleVal] = useState(null);
  const [multiVal2, setMultiVal2] = useState([]);
  const [singleVal2, setSingleVal2] = useState(null);

  return (
    <>
      <style>{style}</style>
      <style>{demoStyle}</style>
      <div className="demo-page">
        <p className="demo-heading">SelectDropdown — reusable component</p>

        <div className="demo-grid">
          {/* Multi select */}
          <div className="demo-cell">
            <span className="demo-mode-badge"><span className="dot" />Multi-select</span>
            <SelectDropdown
              label="Departments"
              options={DEPARTMENTS}
              multiSelect={true}
              value={multiVal}
              onChange={setMultiVal}
            />
            <span className="demo-value-preview">
              {multiVal.length ? JSON.stringify(multiVal) : "—"}
            </span>
          </div>

          {/* Single select */}
          <div className="demo-cell">
            <span className="demo-mode-badge"><span className="dot" />Single-select</span>
            <SelectDropdown
              label="Role"
              options={ROLES}
              multiSelect={false}
              value={singleVal}
              onChange={setSingleVal}
            />
            <span className="demo-value-preview">
              {singleVal ?? "—"}
            </span>
          </div>

          {/* Multi — no search */}
          <div className="demo-cell">
            <span className="demo-mode-badge"><span className="dot" />Multi · no search</span>
            <SelectDropdown
              label="Tags"
              options={ROLES}
              multiSelect={true}
              searchable={false}
              value={multiVal2}
              onChange={setMultiVal2}
            />
            <span className="demo-value-preview">
              {multiVal2.length ? JSON.stringify(multiVal2) : "—"}
            </span>
          </div>

          {/* Single — no search */}
          <div className="demo-cell">
            <span className="demo-mode-badge"><span className="dot" />Single · no search</span>
            <SelectDropdown
              label="Status"
              options={[
                { value: "active",   label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending",  label: "Pending" },
              ]}
              multiSelect={false}
              searchable={false}
              value={singleVal2}
              onChange={setSingleVal2}
            />
            <span className="demo-value-preview">
              {singleVal2 ?? "—"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
