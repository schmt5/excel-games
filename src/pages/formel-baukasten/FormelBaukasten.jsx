import { useState, useRef, useCallback } from "react";
import "./FormelBaukasten.css";

/* ═══════════════════════════════════════════════════════════════
   DATEN & LEVELS
   ═══════════════════════════════════════════════════════════════ */

function pruefeFormel(slots, akzeptiert) {
  const formel = slots.join("");
  return akzeptiert.some((a) => a.join("") === formel);
}

function additionsPermutationen(operanden, operator) {
  const perms = permutiere(operanden);
  return perms.map((p) => {
    const result = ["="];
    p.forEach((op, i) => {
      if (i > 0) result.push(operator);
      result.push(op);
    });
    return result;
  });
}

function permutiere(arr) {
  if (arr.length <= 1) return [arr];
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutiere(rest)) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

const LEVELS = [
  {
    id: 1,
    stufe: "Einsteiger",
    stufeFarbe: "#4ade80",
    aufgabe:
      "Ihr habt 12 Brötchen und 8 Gipfeli gekauft. Wie viele Backwaren habt ihr insgesamt?",
    tabelle: null,
    akzeptiert: [
      ["=", "12", "+", "8"],
      ["=", "8", "+", "12"],
    ],
    bloecke: ["=", "12", "+", "8", "-", "3", "*", "20", "/", "5"],
    hinweis: "Jede Formel beginnt mit =",
    erklaerung:
      "Die Formel =12+8 addiert die beiden Zahlen direkt. Das Ergebnis ist 20 Backwaren. Übrigens: =8+12 wäre genauso richtig!",
  },
  {
    id: 2,
    stufe: "Einsteiger",
    stufeFarbe: "#4ade80",
    aufgabe:
      "Eine Flasche Wasser kostet 2.50 CHF. Ihr kauft 6 Flaschen. Was ist der Gesamtpreis?",
    tabelle: null,
    akzeptiert: [
      ["=", "6", "*", "2.50"],
      ["=", "2.50", "*", "6"],
    ],
    bloecke: ["=", "6", "*", "2.50", "+", "10", "-", "3", "/", "2", "15"],
    hinweis: "Für Multiplikation nutzt man * in Excel",
    erklaerung: "=6*2.50 multipliziert Anzahl mal Preis. Ergebnis: 15.00 CHF.",
  },
  {
    id: 3,
    stufe: "Einsteiger",
    stufeFarbe: "#4ade80",
    aufgabe:
      "Die Gesamtrechnung ist 84.60 CHF. Ihr teilt durch 3 Personen. Wie viel zahlt jeder?",
    tabelle: null,
    akzeptiert: [["=", "84.60", "/", "3"]],
    bloecke: [
      "=",
      "84.60",
      "/",
      "3",
      "*",
      "2",
      "+",
      "42.30",
      "-",
      "4",
      "28.20",
    ],
    hinweis: "Division schreibt man mit / in Excel",
    erklaerung:
      "=84.60/3 teilt die Gesamtrechnung auf 3 Personen auf. Ergebnis: 28.20 CHF. Achtung: =3/84.60 wäre falsch – bei Division ist die Reihenfolge wichtig!",
  },
  {
    id: 4,
    stufe: "Fortgeschritten",
    stufeFarbe: "#facc15",
    aufgabe:
      "Berechne die Gesamtkosten für die Äpfel (Menge × Preis pro Stück).",
    tabelle: {
      headers: ["", "A", "B", "C"],
      rows: [
        ["1", "Produkt", "Menge", "Preis (CHF)"],
        ["2", "Äpfel", "4", "0.80"],
        ["3", "Bananen", "6", "0.50"],
        ["4", "Brot", "2", "3.20"],
      ],
      highlight: { row: 2, col: null },
    },
    akzeptiert: [
      ["=", "B2", "*", "C2"],
      ["=", "C2", "*", "B2"],
    ],
    bloecke: [
      "=",
      "B2",
      "*",
      "C2",
      "B3",
      "C3",
      "+",
      "A2",
      "B4",
      "/",
      "B1",
      "C1",
    ],
    hinweis: "Verwende Zellbezüge statt fixer Zahlen",
    erklaerung:
      "=B2*C2 nimmt die Menge aus B2 (4) und multipliziert mit dem Preis aus C2 (0.80). Wenn sich der Preis ändert, aktualisiert Excel das Ergebnis automatisch.",
  },
  {
    id: 5,
    stufe: "Fortgeschritten",
    stufeFarbe: "#facc15",
    aufgabe:
      "Wie viele Lebensmittel hat die Gruppe insgesamt gekauft? Berechne die Gesamtmenge.",
    tabelle: {
      headers: ["", "A", "B", "C"],
      rows: [
        ["1", "Produkt", "Menge", "Preis (CHF)"],
        ["2", "Äpfel", "4", "0.80"],
        ["3", "Bananen", "6", "0.50"],
        ["4", "Brot", "2", "3.20"],
      ],
      highlight: null,
    },
    akzeptiert: additionsPermutationen(["B2", "B3", "B4"], "+"),
    bloecke: [
      "=",
      "B2",
      "+",
      "B3",
      "B4",
      "C2",
      "C3",
      "C4",
      "*",
      "B1",
      "/",
      "A1",
      "-",
    ],
    hinweis: "Addiere alle Mengenzellen aus Spalte B",
    erklaerung:
      "=B2+B3+B4 addiert die einzelnen Mengen (4+6+2 = 12). Die Reihenfolge spielt bei Addition keine Rolle. Bei vielen Zeilen wird das aber mühsam – dafür gibt es die SUMME-Funktion!",
  },
  {
    id: 6,
    stufe: "Profi",
    stufeFarbe: "#f97316",
    aufgabe: "Berechne die Gesamtkosten aller Einkäufe mit einer Funktion.",
    tabelle: {
      headers: ["", "A", "B", "C", "D"],
      rows: [
        ["1", "Produkt", "Menge", "Preis", "Kosten"],
        ["2", "Äpfel", "4", "0.80", "3.20"],
        ["3", "Bananen", "6", "0.50", "3.00"],
        ["4", "Brot", "2", "3.20", "6.40"],
        ["5", "Käse", "1", "5.90", "5.90"],
      ],
      highlight: null,
    },
    akzeptiert: [
      ["=", "SUMME", "(", "D2", ":", "D5", ")"],
      ["=", "SUMME", "(", "D5", ":", "D2", ")"],
    ],
    bloecke: [
      "=",
      "SUMME",
      "(",
      "D2",
      ":",
      "D5",
      ")",
      "D1",
      "+",
      "MITTELWERT",
      "MAX",
      "C2",
      "C5",
      "*",
      "B2",
      "B5",
    ],
    hinweis:
      "SUMME() addiert einen ganzen Bereich – nutze den Doppelpunkt für «von bis»",
    erklaerung:
      "=SUMME(D2:D5) addiert alle Kosten von D2 bis D5 (3.20+3.00+6.40+5.90 = 18.50 CHF). Der Doppelpunkt : bedeutet «von bis».",
  },
  {
    id: 7,
    stufe: "Profi",
    stufeFarbe: "#f97316",
    aufgabe: "Was hat ein Produkt im Durchschnitt gekostet?",
    tabelle: {
      headers: ["", "A", "B", "C", "D"],
      rows: [
        ["1", "Produkt", "Menge", "Preis", "Kosten"],
        ["2", "Äpfel", "4", "0.80", "3.20"],
        ["3", "Bananen", "6", "0.50", "3.00"],
        ["4", "Brot", "2", "3.20", "6.40"],
        ["5", "Käse", "1", "5.90", "5.90"],
      ],
      highlight: null,
    },
    akzeptiert: [
      ["=", "MITTELWERT", "(", "D2", ":", "D5", ")"],
      ["=", "MITTELWERT", "(", "D5", ":", "D2", ")"],
    ],
    bloecke: [
      "=",
      "MITTELWERT",
      "(",
      "D2",
      ":",
      "D5",
      ")",
      "SUMME",
      "C2",
      "MAX",
      "MIN",
      "ANZAHL",
      "+",
      "D1",
      "C5",
    ],
    hinweis: "MITTELWERT() berechnet den Durchschnitt eines Bereichs",
    erklaerung:
      "=MITTELWERT(D2:D5) berechnet den Durchschnitt aller Kosten: (3.20+3.00+6.40+5.90) / 4 = 4.625 CHF.",
  },
  {
    id: 8,
    stufe: "Profi",
    stufeFarbe: "#f97316",
    aufgabe: "Welches war das teuerste Produkt? Finde die höchsten Kosten.",
    tabelle: {
      headers: ["", "A", "B", "C", "D"],
      rows: [
        ["1", "Produkt", "Menge", "Preis", "Kosten"],
        ["2", "Äpfel", "4", "0.80", "3.20"],
        ["3", "Bananen", "6", "0.50", "3.00"],
        ["4", "Brot", "2", "3.20", "6.40"],
        ["5", "Käse", "1", "5.90", "5.90"],
      ],
      highlight: null,
    },
    akzeptiert: [
      ["=", "MAX", "(", "D2", ":", "D5", ")"],
      ["=", "MAX", "(", "D5", ":", "D2", ")"],
    ],
    bloecke: [
      "=",
      "MAX",
      "(",
      "D2",
      ":",
      "D5",
      ")",
      "MIN",
      "SUMME",
      "C5",
      "MITTELWERT",
      "ANZAHL",
      "+",
      "D1",
      "B2",
    ],
    hinweis: "MAX() gibt den grössten Wert in einem Bereich zurück",
    erklaerung:
      "=MAX(D2:D5) findet den höchsten Wert in der Spalte Kosten: 6.40 CHF (das Brot).",
  },
  {
    id: 9,
    stufe: "Experte",
    stufeFarbe: "#ef4444",
    aufgabe:
      "Anna hat nur Obst gegessen. Berechne, wie viel Anna total für Obst bezahlen muss (Äpfel + Bananen).",
    tabelle: {
      headers: ["", "A", "B", "C", "D"],
      rows: [
        ["1", "Produkt", "Kategorie", "Menge", "Kosten"],
        ["2", "Äpfel", "Obst", "4", "3.20"],
        ["3", "Bananen", "Obst", "6", "3.00"],
        ["4", "Brot", "Backware", "2", "6.40"],
        ["5", "Käse", "Milchprodukt", "1", "5.90"],
      ],
      highlight: null,
    },
    akzeptiert: [
      ["=", "D2", "+", "D3"],
      ["=", "D3", "+", "D2"],
    ],
    bloecke: [
      "=",
      "D2",
      "+",
      "D3",
      "D4",
      "D5",
      "SUMME",
      "(",
      ")",
      ":",
      "-",
      "*",
      "C2",
      "C3",
      "B2",
      "B3",
    ],
    hinweis: "Anna isst nur die Produkte der Kategorie «Obst»",
    erklaerung:
      "=D2+D3 addiert die Kosten der Äpfel (3.20) und Bananen (3.00) = 6.20 CHF. Da es nur zwei Obst-Zeilen sind, reicht eine einfache Addition.",
  },
  {
    id: 10,
    stufe: "Experte",
    stufeFarbe: "#ef4444",
    aufgabe:
      "Ben bezahlt alles ausser das Obst. Berechne Bens Anteil: Ziehe Annas Obst-Kosten vom Gesamttotal ab.",
    tabelle: {
      headers: ["", "A", "B", "C", "D"],
      rows: [
        ["1", "Produkt", "Kategorie", "Menge", "Kosten"],
        ["2", "Äpfel", "Obst", "4", "3.20"],
        ["3", "Bananen", "Obst", "6", "3.00"],
        ["4", "Brot", "Backware", "2", "6.40"],
        ["5", "Käse", "Milchprodukt", "1", "5.90"],
        ["6", "", "", "", ""],
        ["7", "Total", "", "", "18.50"],
        ["8", "Annas Obst", "", "", "6.20"],
      ],
      highlight: null,
    },
    akzeptiert: [["=", "D7", "-", "D8"]],
    bloecke: [
      "=",
      "D7",
      "-",
      "D8",
      "+",
      "D4",
      "D5",
      "D2",
      "D3",
      "SUMME",
      "(",
      ")",
      ":",
      "*",
      "/",
      "D6",
    ],
    hinweis: "Das Total und Annas Obst-Kosten stehen bereits in der Tabelle",
    erklaerung:
      "=D7-D8 nimmt das Gesamttotal (18.50) und zieht Annas Obst-Kosten (6.20) ab = 12.30 CHF. Achtung: =D8-D7 wäre falsch – bei Subtraktion ist die Reihenfolge wichtig!",
  },
];

/* ═══════════════════════════════════════════════════════════════
   HILFSFUNKTIONEN
   ═══════════════════════════════════════════════════════════════ */

function blockTyp(text) {
  if (text === "=") return "operator equals";
  if (["+", "-", "*", "/"].includes(text)) return "operator";
  if (["(", ")", ":"].includes(text)) return "syntax";
  if (["SUMME", "MITTELWERT", "MAX", "MIN", "ANZAHL"].includes(text))
    return "function";
  if (/^[A-Z]\d+$/.test(text)) return "cell";
  return "number";
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══════════════════════════════════════════════════════════════
   KOMPONENTEN
   ═══════════════════════════════════════════════════════════════ */

function MiniTabelle({ tabelle }) {
  if (!tabelle) return null;
  return (
    <div className="fb-mini-tabelle-wrapper">
      <table className="fb-mini-tabelle">
        <thead>
          <tr>
            {tabelle.headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tabelle.rows.map((row, ri) => (
            <tr
              key={ri}
              className={
                tabelle.highlight?.row === ri + 1 ? "highlight-row" : ""
              }
            >
              {row.map((cell, ci) => (
                <td key={ci} className={ci === 0 ? "row-num" : ""}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormelBlock({ text, onDragStart, onClick, isDragging, isDisabled }) {
  const typ = blockTyp(text);
  return (
    <div
      className={`fb-block fb-block-${typ} ${isDragging ? "dragging" : ""} ${isDisabled ? "disabled" : ""}`}
      draggable={!isDisabled}
      onDragStart={isDisabled ? undefined : onDragStart}
      onClick={isDisabled ? undefined : onClick}
      data-text={text}
    >
      {text}
    </div>
  );
}

function FormelLeiste({
  slots,
  onDrop,
  onDragOver,
  onDragLeave,
  onRemoveSlot,
  maxSlots,
  isDragOver,
}) {
  return (
    <div
      className={`fb-formel-drop-zone ${isDragOver ? "drag-over" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="fb-formel-drop-header">
        <div className="fb-fx-badge">fx</div>
        <div className="fb-formel-drop-header-text">
          <span className="fb-formel-drop-title">Deine Formel</span>
          <span className="fb-formel-drop-subtitle">
            Ziehe die richtigen Bausteine in die Formelleiste
          </span>
        </div>
        <span className="fb-formel-drop-count">
          {slots.length} / {maxSlots}
        </span>
      </div>
      <div className="fb-formel-slots-area">
        {slots.length === 0 && (
          <div className="fb-formel-empty-state">
            <div className="fb-formel-empty-arrows">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M19 12l-7 7-7-7" />
              </svg>
            </div>
            <span className="fb-formel-empty-text">
              Blöcke hierher ziehen oder anklicken
            </span>
          </div>
        )}
        {slots.length > 0 && (
          <div className="fb-formel-slots-row">
            {slots.map((s, i) => (
              <div
                key={i}
                className="fb-slot fb-slot-filled"
                onClick={() => onRemoveSlot(i)}
              >
                <div className={`fb-block fb-block-${blockTyp(s)} fb-in-slot`}>
                  {s}
                </div>
                <span className="fb-remove-x">×</span>
              </div>
            ))}
            {slots.length < maxSlots && (
              <div className="fb-slot-next-indicator">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.35"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      {slots.length > 0 && (
        <div className="fb-formel-preview">
          <span className="fb-formel-preview-label">Vorschau:</span>
          <code className="fb-formel-preview-code">{slots.join("")}</code>
        </div>
      )}
    </div>
  );
}

function Fortschritt({ aktuell, total, punkte }) {
  const pct = (aktuell / total) * 100;
  return (
    <div className="fb-fortschritt-bar-wrapper">
      <div className="fb-fortschritt-info">
        <span>
          Aufgabe {aktuell + 1} / {total}
        </span>
        <span className="fb-punkte-display">{punkte} Punkte</span>
      </div>
      <div className="fb-fortschritt-bar">
        <div className="fb-fortschritt-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HAUPTKOMPONENTE
   ═══════════════════════════════════════════════════════════════ */

export default function FormelBaukasten() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [slots, setSlots] = useState([]);
  const [usedIndices, setUsedIndices] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [punkte, setPunkte] = useState(0);
  const [zeigeHinweis, setZeigeHinweis] = useState(false);
  const [zeigeErklaerung, setZeigeErklaerung] = useState(false);
  const [fertig, setFertig] = useState(false);
  const [shuffledBloecke, setShuffledBloecke] = useState(() =>
    shuffleArray(LEVELS[0].bloecke),
  );
  const [shakeTrigger, setShakeTrigger] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragIdx = useRef(null);

  const level = LEVELS[levelIdx];

  const handleDragStart = useCallback(
    (idx) => (e) => {
      dragIdx.current = idx;
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const idx = dragIdx.current;
      if (idx === null || usedIndices.has(idx)) return;
      setSlots((prev) => [...prev, shuffledBloecke[idx]]);
      setUsedIndices((prev) => new Set([...prev, idx]));
      dragIdx.current = null;
    },
    [shuffledBloecke, usedIndices],
  );

  const handleBlockClick = useCallback(
    (idx) => () => {
      if (usedIndices.has(idx)) return;
      setSlots((prev) => [...prev, shuffledBloecke[idx]]);
      setUsedIndices((prev) => new Set([...prev, idx]));
    },
    [shuffledBloecke, usedIndices],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleRemoveSlot = useCallback(
    (slotIdx) => {
      if (feedback) return;
      const removedText = slots[slotIdx];
      const allMatchingIndices = [];
      shuffledBloecke.forEach((b, i) => {
        if (b === removedText && usedIndices.has(i)) allMatchingIndices.push(i);
      });
      const idxToRemove = allMatchingIndices[allMatchingIndices.length - 1];

      setSlots((prev) => prev.filter((_, i) => i !== slotIdx));
      if (idxToRemove !== undefined) {
        setUsedIndices((prev) => {
          const next = new Set(prev);
          next.delete(idxToRemove);
          return next;
        });
      }
    },
    [slots, shuffledBloecke, usedIndices, feedback],
  );

  const pruefen = () => {
    const isCorrect = pruefeFormel(slots, level.akzeptiert);
    if (isCorrect) {
      setFeedback("richtig");
      const bonus = zeigeHinweis ? 5 : 10;
      setPunkte((p) => p + bonus);
      setZeigeErklaerung(true);
    } else {
      setFeedback("falsch");
      setShakeTrigger((s) => s + 1);
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  const naechsteAufgabe = () => {
    if (levelIdx + 1 >= LEVELS.length) {
      setFertig(true);
    } else {
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setShuffledBloecke(shuffleArray(LEVELS[nextIdx].bloecke));
      setSlots([]);
      setUsedIndices(new Set());
      setFeedback(null);
      setZeigeHinweis(false);
      setZeigeErklaerung(false);
    }
  };

  const zuruecksetzen = () => {
    setSlots([]);
    setUsedIndices(new Set());
    setFeedback(null);
    setZeigeHinweis(false);
    setZeigeErklaerung(false);
  };

  const neustart = () => {
    setLevelIdx(0);
    setShuffledBloecke(shuffleArray(LEVELS[0].bloecke));
    setSlots([]);
    setUsedIndices(new Set());
    setFeedback(null);
    setPunkte(0);
    setZeigeHinweis(false);
    setZeigeErklaerung(false);
    setFertig(false);
  };

  // ── ENDSCREEN ──
  if (fertig) {
    const maxPunkte = LEVELS.length * 10;
    const pct = Math.round((punkte / maxPunkte) * 100);
    let bewertung = "Nicht schlecht!";
    let emoji = "👍";
    if (pct >= 90) {
      bewertung = "Hervorragend!";
      emoji = "🏆";
    } else if (pct >= 70) {
      bewertung = "Sehr gut!";
      emoji = "⭐";
    } else if (pct >= 50) {
      bewertung = "Gut gemacht!";
      emoji = "👏";
    }

    return (
      <div className="fb-app">
        <div className="fb-end-screen">
          <div className="fb-end-emoji">{emoji}</div>
          <h1 className="fb-end-title">{bewertung}</h1>
          <p className="fb-end-subtitle">
            Du hast alle {LEVELS.length} Aufgaben gelöst!
          </p>
          <div className="fb-end-score">
            <span className="fb-end-score-num">{punkte}</span>
            <span className="fb-end-score-label">von {maxPunkte} Punkten</span>
          </div>
          <div className="fb-end-bar-wrapper">
            <div className="fb-end-bar">
              <div className="fb-end-bar-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button
            className="fb-btn fb-btn-primary fb-btn-large"
            onClick={neustart}
          >
            Nochmal spielen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fb-app">
      <header className="fb-header">
        <div className="fb-header-left">
          <div className="fb-logo">
            <span className="fb-logo-icon">fx</span>
            <span className="fb-logo-text">Formel-Baukasten</span>
          </div>
        </div>
        <div className="fb-header-right">
          <span
            className="fb-stufe-badge"
            style={{ background: level.stufeFarbe }}
          >
            {level.stufe}
          </span>
        </div>
      </header>

      <Fortschritt aktuell={levelIdx} total={LEVELS.length} punkte={punkte} />

      <main className="fb-main">
        {/* Aufgabe */}
        <div className="fb-aufgabe-card">
          <div className="fb-aufgabe-header">
            <span className="fb-aufgabe-nummer">Aufgabe {level.id}</span>
          </div>
          <p className="fb-aufgabe-text">{level.aufgabe}</p>
          {level.tabelle && <MiniTabelle tabelle={level.tabelle} />}
        </div>

        {/* Formelleiste */}
        <div
          className={`fb-formel-area ${feedback === "falsch" ? "fb-shake" : ""}`}
          key={`shake-${shakeTrigger}`}
        >
          <FormelLeiste
            slots={slots}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onRemoveSlot={handleRemoveSlot}
            maxSlots={Math.max(...level.akzeptiert.map((a) => a.length))}
            isDragOver={isDragOver}
          />
        </div>

        {/* Feedback */}
        {feedback === "richtig" && (
          <div className="fb-feedback fb-feedback-richtig">
            <span className="fb-feedback-icon">✓</span> Richtig!
          </div>
        )}
        {feedback === "falsch" && (
          <div className="fb-feedback fb-feedback-falsch">
            <span className="fb-feedback-icon">✗</span> Noch nicht ganz –
            versuch&apos;s nochmal!
          </div>
        )}

        {/* Erklärung */}
        {zeigeErklaerung && (
          <div className="fb-erklaerung-card">
            <div className="fb-erklaerung-label">💡 Erklärung</div>
            <p>{level.erklaerung}</p>
          </div>
        )}

        {/* Blöcke */}
        {!zeigeErklaerung && (
          <div className="fb-bloecke-area">
            <div className="fb-bloecke-label">
              Verfügbare Bausteine – wähle die richtigen!
            </div>
            <div className="fb-bloecke-grid">
              {shuffledBloecke.map((b, i) => (
                <FormelBlock
                  key={`${levelIdx}-${i}`}
                  text={b}
                  onDragStart={handleDragStart(i)}
                  onClick={handleBlockClick(i)}
                  isDragging={false}
                  isDisabled={usedIndices.has(i)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hinweis */}
        {zeigeHinweis && !zeigeErklaerung && (
          <div className="fb-hinweis-card">
            <span className="fb-hinweis-icon">💡</span> {level.hinweis}
          </div>
        )}

        {/* Buttons */}
        <div className="fb-button-row">
          {!feedback && !zeigeErklaerung && (
            <>
              {!zeigeHinweis && (
                <button
                  className="fb-btn fb-btn-ghost"
                  onClick={() => setZeigeHinweis(true)}
                >
                  Hinweis anzeigen
                </button>
              )}
              <button
                className="fb-btn fb-btn-secondary"
                onClick={zuruecksetzen}
              >
                Zurücksetzen
              </button>
              <button
                className="fb-btn fb-btn-primary"
                onClick={pruefen}
                disabled={slots.length === 0}
              >
                Prüfen
              </button>
            </>
          )}
          {zeigeErklaerung && (
            <button
              className="fb-btn fb-btn-primary fb-btn-large"
              onClick={naechsteAufgabe}
            >
              {levelIdx + 1 >= LEVELS.length
                ? "Ergebnis anzeigen"
                : "Nächste Aufgabe →"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
