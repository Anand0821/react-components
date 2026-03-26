import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   BASE STYLES  (layout & structure only — no colors)
───────────────────────────────────────────── */
const baseStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sd-wrapper { position: relative; width: 100%; }

  .sd-floating-label {
    position: absolute;
    top: -9px; left: 14px;
    padding: 0 5px;
    font-size: 11.5px; font-weight: 500;
    letter-spacing: 0.04em;
    pointer-events: none;
    z-index: 2;
    transition: color 0.2s, background 0.2s;
    line-height: 1;
    white-space: nowrap;
  }

  .sd-trigger {
    width: 100%;
    border-width: 1px; border-style: solid; border-radius: 12px;
    padding: 13px 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    user-select: none;
    min-height: 48px;
  }
  .sd-trigger.open { border-radius: 12px 12px 0 0; }
  .sd-trigger.disabled { cursor: not-allowed; opacity: 0.45; pointer-events: none; }

  .sd-trigger-left {
    display: flex; align-items: center; gap: 6px;
    flex: 1; min-width: 0; flex-wrap: nowrap; overflow: hidden;
  }

  .sd-placeholder { font-size: 13px; font-weight: 400; }
  .sd-single-value { font-size: 13px; font-weight: 400; }

  /* text display mode */
  .sd-text-selection {
    font-size: 13px; font-weight: 400;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    min-width: 0; flex: 1;
  }
  .sd-text-overflow { font-size: 12px; font-weight: 500; }

  .sd-tag {
    font-size: 11px; font-weight: 600;
    padding: 2px 8px; border-radius: 20px;
    white-space: nowrap; flex-shrink: 0;
  }
  .sd-overflow-tag {
    font-size: 11px; font-weight: 500;
    padding: 2px 8px; border-radius: 20px;
    white-space: nowrap; flex-shrink: 0;
  }

  .sd-chevron {
    width: 18px; height: 18px; flex-shrink: 0;
    transition: transform 0.25s ease, color 0.2s;
  }
  .sd-trigger.open .sd-chevron { transform: rotate(180deg); }

  .sd-panel {
    position: absolute;
    top: calc(100% - 1px); left: 0; right: 0;
    border-width: 1px; border-style: solid;
    border-radius: 0 0 12px 12px;
    overflow: hidden; z-index: 100;
    animation: sd-slide 0.18s ease;
    box-shadow: 0 20px 40px rgba(0,0,0,0.35);
  }
  @keyframes sd-slide {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sd-search-wrap { padding: 10px 12px; }
  .sd-search-icon-wrap { position: relative; }
  .sd-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    width: 14px; height: 14px; pointer-events: none;
  }
  .sd-search-input {
    width: 100%; border-width: 1px; border-style: solid; border-radius: 8px;
    padding: 8px 12px 8px 34px;
    font-family: 'Sora', sans-serif; font-size: 12.5px;
    outline: none; transition: border-color 0.2s; background: transparent;
  }

  .sd-options { max-height: 220px; overflow-y: auto; padding: 6px 0; }
  .sd-options::-webkit-scrollbar { width: 4px; }
  .sd-options::-webkit-scrollbar-track { background: transparent; }

  .sd-option {
    display: flex; align-items: center; gap: 12px;
    padding: 9px 14px; cursor: pointer;
    transition: background 0.12s; user-select: none;
  }
  .sd-option.all-opt { margin-bottom: 4px; }
  .sd-option-label { font-size: 13px; font-weight: 400; flex: 1; }
  .sd-option.all-opt .sd-option-label { font-weight: 500; }

  .sd-checkbox {
    width: 17px; height: 17px; border-radius: 5px;
    border-width: 1.5px; border-style: solid;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .sd-check-icon { width: 10px; height: 10px; }
  .sd-dash { width: 10px; height: 2px; border-radius: 1px; }

  .sd-radio {
    width: 17px; height: 17px; border-radius: 50%;
    border-width: 1.5px; border-style: solid;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }
  .sd-radio-dot { width: 8px; height: 8px; border-radius: 50%; }

  .sd-no-results { padding: 18px 16px; font-size: 13px; text-align: center; }

  .sd-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
  }
  .sd-count { font-size: 11px; letter-spacing: 0.04em; }
  .sd-clear {
    font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500;
    background: none; border: none; cursor: pointer;
    letter-spacing: 0.06em; text-transform: uppercase; padding: 0;
    opacity: 0.85; transition: opacity 0.15s;
  }
  .sd-clear:hover { opacity: 1; }
`;

/* ─────────────────────────────────────────────
   DEFAULT COLOR TOKENS
───────────────────────────────────────────── */
export const DEFAULT_COLORS = {
  // Trigger — inactive / resting
  inactiveBg:          "#161616",
  inactiveBorder:      "#2a2a2a",
  inactiveText:        "#dddddd",
  inactivePlaceholder: "#555555",
  inactiveLabel:       "#888888",
  inactiveChevron:     "#555555",

  // Trigger — focused / open
  focusBg:             "#161616",
  focusBorder:         "#e8ff5a",
  focusText:           "#ffffff",
  focusLabel:          "#e8ff5a",
  focusChevron:        "#e8ff5a",

  // Dropdown panel
  dropdownBg:          "#161616",
  dropdownBorder:      "#2a2a2a",
  dropdownText:        "#cccccc",
  dropdownHoverBg:     "#1e1e1e",
  dropdownDivider:     "#1e1e1e",
  searchBg:            "#1e1e1e",
  searchBorder:        "#2a2a2a",
  searchText:          "#cccccc",
  noResultsText:       "#444444",

  // Accent — checkbox fill, radio dot, selected tag bg, clear btn, focused labels
  accentBg:            "#e8ff5a",
  accentText:          "#0d0d0d",
  accentBorder:        "#e8ff5a",

  // Overflow tag
  overflowTagBg:       "#252525",
  overflowTagText:     "#888888",
};

// Disabled palette always overrides to grey — not user-configurable
const DISABLED_OVERRIDES = {
  inactiveBg:      "#1a1a1a",
  inactiveBorder:  "#242424",
  inactiveText:    "#3a3a3a",
  inactiveLabel:   "#2e2e2e",
  inactiveChevron: "#2e2e2e",
  inactivePlaceholder: "#2e2e2e",
};

/* ─────────────────────────────────────────────
   ICON SUB-COMPONENTS
───────────────────────────────────────────── */
function CheckboxIcon({ checked, indeterminate, c }) {
  return (
    <div
      className="sd-checkbox"
      style={{
        borderColor: checked || indeterminate ? c.accentBorder : "#333",
        background:  checked ? c.accentBg : "transparent",
      }}
    >
      {checked && (
        <svg className="sd-check-icon" style={{ color: c.accentText }}
          viewBox="0 0 10 10" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1.5,5 4,8 8.5,2" />
        </svg>
      )}
      {indeterminate && !checked && (
        <div className="sd-dash" style={{ background: c.accentBg }} />
      )}
    </div>
  );
}

function RadioIcon({ checked, c }) {
  return (
    <div className="sd-radio"
      style={{ borderColor: checked ? c.accentBorder : "#333" }}>
      {checked && <div className="sd-radio-dot" style={{ background: c.accentBg }} />}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT

   Props
   ──────────────────────────────────────────────────────────────────────
   label        string            Floating border label
   options      {value,label}[]   Option list
   multiSelect  boolean           Multi (true) vs Single (false) — default false
   value        string|string[]   Controlled value
   onChange     fn                Fires with new value on change
   placeholder  string            Override placeholder text
   searchable   boolean           Show search input — default true
   maxTags          number            Visible tag count before +N — default 2
   disabled         boolean           Greyed out, non-interactive
   colors           object            Override any token from DEFAULT_COLORS
   selectionDisplay "chips" | "text"  How selected items appear in trigger (default "chips")
   ──────────────────────────────────────────────────────────────────────
───────────────────────────────────────────── */
export function SelectDropdown({
  label       = "Select",
  options     = [],
  multiSelect = false,
  value,
  onChange,
  placeholder,
  searchable  = true,
  maxTags          = 2,
  disabled         = false,
  colors           = {},
  selectionDisplay = "chips",   // "chips" | "text"
}) {
  const c = disabled
    ? { ...DEFAULT_COLORS, ...colors, ...DISABLED_OVERRIDES }
    : { ...DEFAULT_COLORS, ...colors };

  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(multiSelect ? [] : null);
  const selected = isControlled ? value : internal;

  const fire = (next) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef          = useRef(null);
  const searchRef           = useRef(null);

  const filtered     = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  const allSelected  = multiSelect && Array.isArray(selected) && selected.length === options.length;
  const someSelected = multiSelect && Array.isArray(selected) && selected.length > 0 && !allSelected;
  const isOpen       = open && !disabled;

  useEffect(() => {
    const h = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) searchRef.current.focus();
  }, [isOpen, searchable]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen(v => !v);
    if (open) setSearch("");
  };

  const toggleAll = () => fire(allSelected ? [] : options.map(o => o.value));

  const toggleOption = (val) => {
    if (multiSelect) {
      const prev = Array.isArray(selected) ? selected : [];
      fire(prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
    } else {
      fire(val); setOpen(false); setSearch("");
    }
  };

  const hasSelection = multiSelect
    ? Array.isArray(selected) && selected.length > 0
    : selected != null;

  /* ── Trigger inner content ── */
  const triggerContent = () => {
    if (multiSelect) {
      const sel = Array.isArray(selected) ? selected : [];
      if (!sel.length) return (
        <span className="sd-placeholder" style={{ color: c.inactivePlaceholder }}>
          {placeholder ?? `Select ${label.toLowerCase()}…`}
        </span>
      );

      // ── TEXT mode: "Design, Engineering, +3" ──
      if (selectionDisplay === "text") {
        const labels  = sel.map(v => options.find(o => o.value === v)?.label).filter(Boolean);
        const visible = labels.slice(0, maxTags);
        const ov      = labels.length - visible.length;
        return (
          <span className="sd-text-selection" style={{ color: isOpen ? c.focusText : c.inactiveText }}>
            {visible.join(", ")}
            {ov > 0 && (
              <span className="sd-text-overflow" style={{ color: c.overflowTagText }}>
                {" "}+{ov} more
              </span>
            )}
          </span>
        );
      }

      // ── CHIPS mode (default) ──
      const vis = sel.slice(0, maxTags);
      const ov  = sel.length - vis.length;
      return (
        <>
          {vis.map(v => (
            <span key={v} className="sd-tag" style={{ background: c.accentBg, color: c.accentText }}>
              {options.find(o => o.value === v)?.label}
            </span>
          ))}
          {ov > 0 && (
            <span className="sd-overflow-tag" style={{ background: c.overflowTagBg, color: c.overflowTagText }}>
              +{ov}
            </span>
          )}
        </>
      );
    }
    const found = options.find(o => o.value === selected);
    return found
      ? <span className="sd-single-value" style={{ color: isOpen ? c.focusText : c.inactiveText }}>{found.label}</span>
      : <span className="sd-placeholder" style={{ color: c.inactivePlaceholder }}>{placeholder ?? `Select ${label.toLowerCase()}…`}</span>;
  };

  return (
    <div className={`sd-wrapper ${isOpen ? "is-open" : ""}`} ref={wrapperRef}>

      {/* Floating label */}
      <span className="sd-floating-label" style={{
        color:      isOpen ? c.focusLabel   : c.inactiveLabel,
        background: isOpen ? c.focusBg      : c.inactiveBg,
      }}>
        {label}
      </span>

      {/* Trigger */}
      <div
        className={`sd-trigger ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""}`}
        style={{
          background:  isOpen ? c.focusBg     : c.inactiveBg,
          borderColor: isOpen ? c.focusBorder : c.inactiveBorder,
          boxShadow:   isOpen ? `0 0 0 3px ${c.focusBorder}22` : "none",
          ...(isOpen && { borderBottomColor: c.dropdownDivider }),
        }}
        onClick={toggleOpen}
      >
        <div className="sd-trigger-left">{triggerContent()}</div>
        <svg className="sd-chevron"
          style={{ color: isOpen ? c.focusChevron : c.inactiveChevron }}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Panel */}
      {isOpen && (
        <div className="sd-panel" style={{ background: c.dropdownBg, borderColor: c.dropdownBorder }}>

          {/* Search */}
          {searchable && (
            <div className="sd-search-wrap"
              style={{ borderBottom: `1px solid ${c.dropdownDivider}` }}>
              <div className="sd-search-icon-wrap">
                <svg className="sd-search-icon" style={{ color: c.dropdownText + "55" }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input ref={searchRef} className="sd-search-input"
                  placeholder="Search…"
                  style={{ background: c.searchBg, borderColor: c.searchBorder, color: c.searchText }}
                  value={search}
                  onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          )}

          <div className="sd-options">
            {/* All — multi only */}
            {multiSelect && !search && (
              <div className="sd-option all-opt"
                style={{ borderBottom: `1px solid ${c.dropdownDivider}` }}
                onMouseEnter={e => e.currentTarget.style.background = c.dropdownHoverBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={toggleAll}>
                <CheckboxIcon checked={allSelected} indeterminate={someSelected} c={c} />
                <span className="sd-option-label" style={{ color: c.dropdownText }}>All</span>
              </div>
            )}

            {filtered.length === 0
              ? <div className="sd-no-results" style={{ color: c.noResultsText }}>No results found</div>
              : filtered.map(opt => {
                  const isSel = multiSelect
                    ? Array.isArray(selected) && selected.includes(opt.value)
                    : selected === opt.value;
                  return (
                    <div key={opt.value} className="sd-option"
                      onMouseEnter={e => e.currentTarget.style.background = c.dropdownHoverBg}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => toggleOption(opt.value)}>
                      {multiSelect
                        ? <CheckboxIcon checked={isSel} c={c} />
                        : <RadioIcon checked={isSel} c={c} />}
                      <span className="sd-option-label"
                        style={{ color: !multiSelect && isSel ? c.accentBg : c.dropdownText }}>
                        {opt.label}
                      </span>
                    </div>
                  );
                })
            }
          </div>

          {/* Footer — multi only */}
          {multiSelect && (
            <div className="sd-footer" style={{ borderTop: `1px solid ${c.dropdownDivider}` }}>
              <span className="sd-count" style={{ color: c.noResultsText }}>
                {Array.isArray(selected) ? selected.length : 0} of {options.length} selected
              </span>
              {hasSelection && (
                <button className="sd-clear" style={{ color: c.accentBg }} onClick={clearAll}>
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  function clearAll() { fire(multiSelect ? [] : null); }
}

/* ─────────────────────────────────────────────
   DEMO
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
const ROLES  = [
  { value: "admin", label: "Admin" }, { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" }, { value: "developer", label: "Developer" },
  { value: "analyst", label: "Analyst" },
];
const STATUS = [
  { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];

// ── Preset themes ──────────────────────────────────────────────────────
const BLUE_THEME = {
  inactiveBg: "#0d1117", inactiveBorder: "#21262d", inactiveText: "#c9d1d9",
  inactivePlaceholder: "#484f58", inactiveLabel: "#484f58", inactiveChevron: "#484f58",
  focusBg: "#0d1117", focusBorder: "#388bfd", focusText: "#e6edf3",
  focusLabel: "#388bfd", focusChevron: "#388bfd",
  accentBg: "#388bfd", accentText: "#ffffff", accentBorder: "#388bfd",
  overflowTagBg: "#1f2937", overflowTagText: "#93c5fd",
  dropdownBg: "#161b22", dropdownBorder: "#21262d", dropdownText: "#c9d1d9",
  dropdownHoverBg: "#21262d", dropdownDivider: "#21262d",
  searchBg: "#0d1117", searchBorder: "#30363d", searchText: "#c9d1d9",
  noResultsText: "#484f58",
};

const ROSE_THEME = {
  inactiveBg: "#180d10", inactiveBorder: "#3d1a22", inactiveText: "#fca5a5",
  inactivePlaceholder: "#6b2535", inactiveLabel: "#6b2535", inactiveChevron: "#6b2535",
  focusBg: "#180d10", focusBorder: "#f43f5e", focusText: "#fecdd3",
  focusLabel: "#f43f5e", focusChevron: "#f43f5e",
  accentBg: "#f43f5e", accentText: "#fff", accentBorder: "#f43f5e",
  overflowTagBg: "#3d1a22", overflowTagText: "#fca5a5",
  dropdownBg: "#180d10", dropdownBorder: "#3d1a22", dropdownText: "#fecdd3",
  dropdownHoverBg: "#3d1a22", dropdownDivider: "#3d1a22",
  searchBg: "#3d1a22", searchBorder: "#5a2535", searchText: "#fecdd3",
  noResultsText: "#6b2535",
};

const LIGHT_THEME = {
  inactiveBg: "#ffffff", inactiveBorder: "#e5e7eb", inactiveText: "#111827",
  inactivePlaceholder: "#9ca3af", inactiveLabel: "#6b7280", inactiveChevron: "#9ca3af",
  focusBg: "#ffffff", focusBorder: "#7c3aed", focusText: "#111827",
  focusLabel: "#7c3aed", focusChevron: "#7c3aed",
  accentBg: "#7c3aed", accentText: "#ffffff", accentBorder: "#7c3aed",
  overflowTagBg: "#ede9fe", overflowTagText: "#5b21b6",
  dropdownBg: "#ffffff", dropdownBorder: "#e5e7eb", dropdownText: "#374151",
  dropdownHoverBg: "#f5f3ff", dropdownDivider: "#f3f4f6",
  searchBg: "#f9fafb", searchBorder: "#e5e7eb", searchText: "#374151",
  noResultsText: "#9ca3af",
};

const demoStyle = `
  body { background: #0d0d0d; }
  .page {
    font-family: 'Sora', sans-serif;
    background: #0d0d0d;
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; padding: 56px 24px 80px; gap: 52px;
  }
  .page-header { text-align: center; }
  .page-header h1 {
    font-size: 14px; font-weight: 600; letter-spacing: 0.16em;
    text-transform: uppercase; color: #bbb; margin-bottom: 6px;
  }
  .page-header p { font-size: 11px; color: #3a3a3a; letter-spacing: 0.08em; }

  .section { width: 100%; max-width: 740px; }
  .section-title {
    font-size: 9px; letter-spacing: 0.24em; text-transform: uppercase;
    color: #2e2e2e; font-weight: 600; margin-bottom: 24px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: #1a1a1a; }

  .grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 40px 28px;
  }
  @media (max-width: 520px) { .grid { grid-template-columns: 1fr; } }

  .cell { display: flex; flex-direction: column; gap: 18px; }
  .badge {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase;
    font-weight: 600; color: #444;
  }
  .badge .dot { width: 5px; height: 5px; border-radius: 50%; }
  .val { font-size: 10px; color: #2a2a2a; font-family: monospace; word-break: break-all; min-height: 14px; }
  .val.light { color: #aaa; }
`;

export default function Demo() {
  const [v1, sv1] = useState([]);
  const [v2, sv2] = useState(null);
  const [v3, sv3] = useState([]);
  const [v4, sv4] = useState(null);
  const [v5, sv5] = useState([]);
  const [v6, sv6] = useState(null);
  const [v7, sv7] = useState([]);
  const [v8, sv8] = useState([]);   // chips demo
  const [v9, sv9] = useState([]);   // text demo

  return (
    <>
      <style>{baseStyle}</style>
      <style>{demoStyle}</style>
      <div className="page">
        <div className="page-header">
          <h1>SelectDropdown</h1>
          <p>reusable · style-able · single &amp; multi</p>
        </div>

        {/* ── selectionDisplay showcase ── */}
        <div className="section">
          <div className="section-title">selectionDisplay — chips vs text</div>
          <div className="grid">
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#e8ff5a"}}/>selectionDisplay="chips"</span>
              <SelectDropdown
                label="Departments"
                options={DEPARTMENTS}
                multiSelect
                selectionDisplay="chips"
                value={v8}
                onChange={sv8}
              />
              <span className="val">{v8.length ? `${v8.length} selected` : "—"}</span>
            </div>
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#e8ff5a"}}/>selectionDisplay="text"</span>
              <SelectDropdown
                label="Departments"
                options={DEPARTMENTS}
                multiSelect
                selectionDisplay="text"
                value={v9}
                onChange={sv9}
              />
              <span className="val">{v9.length ? `${v9.length} selected` : "—"}</span>
            </div>
          </div>
        </div>

        {/* DEFAULT */}
        <div className="section">
          <div className="section-title">Default dark theme</div>
          <div className="grid">
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#e8ff5a"}}/>Multi-select</span>
              <SelectDropdown label="Departments" options={DEPARTMENTS} multiSelect value={v1} onChange={sv1} />
              <span className="val">{v1.length ? JSON.stringify(v1) : "—"}</span>
            </div>
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#e8ff5a"}}/>Single-select</span>
              <SelectDropdown label="Role" options={ROLES} value={v2} onChange={sv2} />
              <span className="val">{v2 ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* BLUE */}
        <div className="section">
          <div className="section-title">Blue / GitHub-dark theme</div>
          <div className="grid">
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#388bfd"}}/>Multi-select</span>
              <SelectDropdown label="Tags" options={ROLES} multiSelect colors={BLUE_THEME} value={v3} onChange={sv3} />
              <span className="val">{v3.length ? JSON.stringify(v3) : "—"}</span>
            </div>
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#388bfd"}}/>Disabled</span>
              <SelectDropdown label="Status" options={STATUS} colors={BLUE_THEME} value="active" disabled />
              <span className="val">disabled (always grey)</span>
            </div>
          </div>
        </div>

        {/* ROSE */}
        <div className="section">
          <div className="section-title">Rose theme</div>
          <div className="grid">
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#f43f5e"}}/>Multi · no search</span>
              <SelectDropdown label="Priority" options={STATUS} multiSelect searchable={false} colors={ROSE_THEME} value={v5} onChange={sv5} />
              <span className="val">{v5.length ? JSON.stringify(v5) : "—"}</span>
            </div>
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#f43f5e"}}/>Single-select</span>
              <SelectDropdown label="Region" options={DEPARTMENTS} colors={ROSE_THEME} value={v4} onChange={sv4} />
              <span className="val">{v4 ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* LIGHT */}
        <div className="section">
          <div className="section-title">Light / Violet theme</div>
          <div className="grid">
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#7c3aed"}}/>Multi-select</span>
              <SelectDropdown label="Departments" options={DEPARTMENTS} multiSelect colors={LIGHT_THEME} value={v7} onChange={sv7} />
              <span className="val light">{v7.length ? JSON.stringify(v7) : "—"}</span>
            </div>
            <div className="cell">
              <span className="badge"><span className="dot" style={{background:"#7c3aed"}}/>Single · disabled</span>
              <SelectDropdown label="Role" options={ROLES} colors={LIGHT_THEME} value={v6} onChange={sv6} disabled />
              <span className="val light">disabled (always grey)</span>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
