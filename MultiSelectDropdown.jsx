import { useState, useRef, useEffect } from "react";

const OPTIONS = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
];

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

  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 40px 20px;
  }

  .label-text {
    font-size: 11px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #666;
    align-self: flex-start;
    max-width: 340px;
    width: 100%;
  }

  .dropdown-wrapper {
    position: relative;
    width: 340px;
  }

  .trigger {
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
  }

  .trigger:hover {
    border-color: #444;
  }

  .trigger.open {
    border-color: #e8ff5a;
    box-shadow: 0 0 0 3px rgba(232, 255, 90, 0.08);
    border-radius: 12px 12px 0 0;
    border-bottom-color: #222;
  }

  .trigger-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
  }

  .tags-row {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .tag {
    background: #e8ff5a;
    color: #0d0d0d;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    letter-spacing: 0.02em;
    flex-shrink: 0;
  }

  .overflow-tag {
    background: #252525;
    color: #888;
    font-size: 11px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 20px;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .placeholder {
    font-size: 13px;
    color: #555;
    font-weight: 400;
  }

  .chevron {
    width: 18px;
    height: 18px;
    color: #555;
    flex-shrink: 0;
    transition: transform 0.25s ease, color 0.2s;
  }

  .trigger.open .chevron {
    transform: rotate(180deg);
    color: #e8ff5a;
  }

  .dropdown-panel {
    position: absolute;
    top: calc(100% - 1px);
    left: 0;
    right: 0;
    background: #161616;
    border: 1px solid #2a2a2a;
    border-top: none;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    z-index: 100;
    animation: slideDown 0.18s ease;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    border-top: 1px solid #1e1e1e;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .search-wrap {
    padding: 10px 12px;
    border-bottom: 1px solid #1e1e1e;
  }

  .search-input {
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

  .search-input::placeholder { color: #444; }
  .search-input:focus { border-color: #3a3a3a; }

  .search-icon-wrap {
    position: relative;
  }

  .search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    color: #444;
    pointer-events: none;
  }

  .options-list {
    max-height: 220px;
    overflow-y: auto;
    padding: 6px 0;
  }

  .options-list::-webkit-scrollbar { width: 4px; }
  .options-list::-webkit-scrollbar-track { background: transparent; }
  .options-list::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  .option-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 14px;
    cursor: pointer;
    transition: background 0.12s;
    user-select: none;
  }

  .option-item:hover { background: #1e1e1e; }

  .option-item.all-option {
    border-bottom: 1px solid #1e1e1e;
    margin-bottom: 4px;
  }

  .checkbox {
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

  .checkbox.checked {
    background: #e8ff5a;
    border-color: #e8ff5a;
  }

  .checkbox.indeterminate {
    background: transparent;
    border-color: #e8ff5a;
  }

  .check-svg {
    width: 10px;
    height: 10px;
    color: #0d0d0d;
  }

  .dash-svg {
    width: 10px;
    height: 2px;
    background: #e8ff5a;
    border-radius: 1px;
  }

  .option-label {
    font-size: 13px;
    color: #ccc;
    font-weight: 400;
    flex: 1;
  }

  .option-item.all-option .option-label {
    font-weight: 500;
    color: #ddd;
  }

  .no-results {
    padding: 18px 16px;
    font-size: 13px;
    color: #444;
    text-align: center;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-top: 1px solid #1e1e1e;
  }

  .count-text {
    font-size: 11px;
    color: #555;
    letter-spacing: 0.04em;
  }

  .clear-btn {
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

  .clear-btn:hover { opacity: 1; }
`;

function Checkbox({ checked, indeterminate }) {
  return (
    <div className={`checkbox ${checked ? "checked" : indeterminate ? "indeterminate" : ""}`}>
      {checked && (
        <svg className="check-svg" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1.5,5 4,8 8.5,2" />
        </svg>
      )}
      {indeterminate && !checked && <div className="dash-svg" />}
    </div>
  );
}

export default function MultiSelectDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchRef = useRef(null);

  const filtered = OPTIONS.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = selected.length === OPTIONS.length;
  const someSelected = selected.length > 0 && !allSelected;

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

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const toggleAll = () => {
    setSelected(allSelected ? [] : OPTIONS.map(o => o.value));
  };

  const toggleOption = value => {
    setSelected(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const visibleTags = selected.slice(0, 2);
  const overflow = selected.length - visibleTags.length;

  return (
    <>
      <style>{style}</style>
      <div className="page">
        <span className="label-text">Department</span>
        <div className="dropdown-wrapper" ref={wrapperRef}>
          {/* Trigger */}
          <div
            className={`trigger ${open ? "open" : ""}`}
            onClick={() => { setOpen(o => !o); if (open) setSearch(""); }}
          >
            <div className="trigger-left">
              {selected.length === 0 ? (
                <span className="placeholder">Select departments…</span>
              ) : (
                <div className="tags-row">
                  {visibleTags.map(v => (
                    <span key={v} className="tag">
                      {OPTIONS.find(o => o.value === v)?.label}
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span className="overflow-tag">+{overflow}</span>
                  )}
                </div>
              )}
            </div>
            <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Panel */}
          {open && (
            <div className="dropdown-panel">
              {/* Search */}
              <div className="search-wrap">
                <div className="search-icon-wrap">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    ref={searchRef}
                    className="search-input"
                    placeholder="Search…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="options-list">
                {/* All option */}
                {!search && (
                  <div className="option-item all-option" onClick={toggleAll}>
                    <Checkbox checked={allSelected} indeterminate={someSelected} />
                    <span className="option-label">All</span>
                  </div>
                )}

                {filtered.length === 0 ? (
                  <div className="no-results">No results found</div>
                ) : (
                  filtered.map(opt => (
                    <div
                      key={opt.value}
                      className="option-item"
                      onClick={() => toggleOption(opt.value)}
                    >
                      <Checkbox checked={selected.includes(opt.value)} />
                      <span className="option-label">{opt.label}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="footer">
                <span className="count-text">
                  {selected.length} of {OPTIONS.length} selected
                </span>
                {selected.length > 0 && (
                  <button className="clear-btn" onClick={() => setSelected([])}>
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
