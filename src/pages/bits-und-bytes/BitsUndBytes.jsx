import { useRef, useState } from "react";
import useEmbedResize from "../../useEmbedResize.js";
import "./BitsUndBytes.css";

/* ═══════════════════════════════════════════════════════════════
   MODEL
   8×8 booleans. true = an, false = aus.
   ═══════════════════════════════════════════════════════════════ */

const SIZE = 8;

const emptyGrid = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(false));

const rowToBinary = (row) => row.map((on) => (on ? "1" : "0")).join("");

const clamp = (n) => Math.max(0, Math.min(SIZE - 1, n));

const ARROWS = {
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function BitsUndBytes() {
  // eslint-disable-next-line no-unused-vars
  const isEmbed = useEmbedResize();

  const [grid, setGrid] = useState(emptyGrid);
  const [focus, setFocus] = useState([0, 0]);
  const cellRefs = useRef([]);

  function toggleCell(r, c) {
    setGrid((prev) =>
      prev.map((row, ri) =>
        ri !== r ? row : row.map((cell, ci) => (ci === c ? !cell : cell)),
      ),
    );
  }

  const clearGrid = () => setGrid(emptyGrid());

  const invertGrid = () =>
    setGrid((prev) => prev.map((row) => row.map((cell) => !cell)));

  /* Arrow keys move focus within the grid. Without this every one of the 64
     cells would be its own tab stop. Space and Enter toggle for free
     because each cell is a real <button>. */
  function handleKeyDown(e, r, c) {
    const delta = ARROWS[e.key];
    if (!delta) return;
    e.preventDefault();
    const nr = clamp(r + delta[0]);
    const nc = clamp(c + delta[1]);
    setFocus([nr, nc]);
    cellRefs.current[nr * SIZE + nc]?.focus();
  }

  const bitsSet = grid.reduce(
    (total, row) => total + row.filter(Boolean).length,
    0,
  );

  return (
    <div className="bb-root">
      {/* ── TOPBAR ── */}
      <header className="bb-topbar">
        <div className="bb-brand">
          <span className="bb-brand-dot" />
          <div>
            <div className="bb-brand-title">Bits &amp; Bytes</div>
            <div className="bb-brand-sub">
              64 Schalter – und was daraus entsteht
            </div>
          </div>
        </div>

        <div className="bb-controls">
          <button type="button" className="bb-btn" onClick={clearGrid}>
            Löschen
          </button>
          <button type="button" className="bb-btn" onClick={invertGrid}>
            Invertieren
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="bb-main">
        <p className="bb-lead">
          Ein einzelnes Bit kennt nur zwei Zustände: <strong>an</strong> oder{" "}
          <strong>aus</strong>. Nicht sehr spannend. Aber 64 Bits zusammen?
          Damit kannst du <strong>zeichnen</strong> – klick die Kästchen an.
        </p>

        <div className="bb-board" role="group" aria-label="Gitter, 8 mal 8 Bits">
          {grid.map((row, r) => (
            <div className="bb-byterow" key={r}>
              {row.map((on, c) => (
                <button
                  key={c}
                  type="button"
                  ref={(el) => {
                    cellRefs.current[r * SIZE + c] = el;
                  }}
                  className={`bb-cell${on ? " on" : ""}`}
                  role="switch"
                  aria-checked={on}
                  aria-label={`Zeile ${r + 1}, Spalte ${c + 1}`}
                  tabIndex={focus[0] === r && focus[1] === c ? 0 : -1}
                  onFocus={() => setFocus([r, c])}
                  onClick={() => toggleCell(r, c)}
                  onKeyDown={(e) => handleKeyDown(e, r, c)}
                />
              ))}

              <div className="bb-readout" aria-hidden="true">
                {rowToBinary(row)}
              </div>
            </div>
          ))}
        </div>

        <p className="bb-hint">
          Probier einen Buchstaben, ein Herz oder ein Smiley. Rechts siehst du,
          was der Computer davon sieht: nur <strong>Nullen und Einsen</strong>.
        </p>

        <div className="bb-facts">
          <div className="bb-fact">
            <span className="bb-fact-num">2</span>
            <span className="bb-fact-lbl">Möglichkeiten mit 1 Bit</span>
          </div>
          <div className="bb-fact">
            <span className="bb-fact-num">256</span>
            <span className="bb-fact-lbl">mit 8 Bits</span>
          </div>
          <div className="bb-fact">
            <span className="bb-fact-num bb-fact-big">
              18’446’744’073’709’551’616
            </span>
            <span className="bb-fact-lbl">mit diesen 64 Bits</span>
          </div>
        </div>
      </main>

      {/* ── BOTTOMBAR ── */}
      <div className="bb-bottombar">
        <div className="bb-key-hint">
          <kbd className="bb-kbd">←</kbd>
          <kbd className="bb-kbd">↑</kbd>
          <kbd className="bb-kbd">↓</kbd>
          <kbd className="bb-kbd">→</kbd>
          navigieren &nbsp;·&nbsp;
          <kbd className="bb-kbd">Space</kbd> umschalten
        </div>
        <div className="bb-counter">{bitsSet} von 64 Bits an</div>
      </div>
    </div>
  );
}
