import { useState, useRef, useCallback, useEffect } from "react";
import useEmbedResize from "../../useEmbedResize.js";
import "./IntroPirates.css";

// ════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════
function makeEmojis(cols, rows, pool) {
  const arr = [];
  for (let r = 0; r < rows; r++) {
    arr.push([]);
    for (let c = 0; c < cols; c++) {
      arr[r].push(pool[(r * cols + c) % pool.length]);
    }
  }
  return arr;
}

const SEA_POOL = [
  "🌴",
  "🐠",
  "⚓",
  "🦀",
  "🐚",
  "🦜",
  "🗿",
  "🌊",
  "🧭",
  "🪸",
  "🐡",
  "🦞",
  "🦑",
  "🐙",
  "🦈",
  "🐬",
  "🌺",
  "🦋",
  "🍄",
  "🪨",
  "🌿",
  "💎",
  "🔮",
  "🗝️",
  "🧿",
  "🏝️",
  "🐊",
  "🦩",
  "🌞",
  "🌙",
  "🦁",
  "🐯",
  "🦊",
  "🐺",
  "🦝",
  "🦌",
  "🏴‍☠️",
  "☠️",
  "🗡️",
  "⚔️",
  "🪃",
  "🏹",
];

// ════════════════════════════════════════════
//  QUEST DEFINITIONS
// ════════════════════════════════════════════
const QUESTS = [
  {
    chapter: "I",
    chapterLabel: "Kapitel I — Zellen orten",
    icon: "🗺️",
    quest: "Klicke auf die richtige Zelle!",
    type: "click-cell",
    narration: `Alte Karten benutzen Koordinaten wie <strong>B3</strong> — zuerst den Buchstaben der Spalte, dann die Nummer der Zeile. Das ist genau wie in Excel!`,
    taskText: `Das erste Kartenstück ist versteckt bei <strong>D4</strong>. Klicke auf die richtige Zelle — die Karte ist gross, navigiere sorgfältig!`,
    grid: {
      cols: ["A", "B", "C", "D", "E", "F"],
      rows: [1, 2, 3, 4, 5],
      emojis: makeEmojis(6, 5, SEA_POOL),
    },
    answer: { col: "D", row: 4 },
    successTitle: "🗺️ Kartenstück I gefunden!",
    successMsg:
      "Richtig! D4 = Spalte D, Zeile 4. In Excel ist das genau gleich — der Buchstabe zeigt die Spalte, die Zahl die Zeile. Merk dir: Erst der Buchstabe, dann die Zahl!",
    coins: 10,
  },
  {
    chapter: "I",
    chapterLabel: "Kapitel I — Zellen orten",
    icon: "🗺️",
    quest: "Klicke auf die richtige Zelle!",
    type: "click-cell",
    narration: `<strong>A1</strong> ist immer die Zelle ganz oben links — der Ausgangspunkt jeder Karte. Von dort zählst du nach rechts (Spalten) und nach unten (Zeilen).`,
    taskText: `Ein Seeräuber hat Gold bei <strong>E2</strong> vergraben. Die Karte ist gross — lies die Koordinaten genau!`,
    grid: {
      cols: ["A", "B", "C", "D", "E", "F"],
      rows: [1, 2, 3, 4, 5, 6],
      emojis: makeEmojis(6, 6, SEA_POOL),
    },
    answer: { col: "E", row: 2 },
    successTitle: "⚓ Zelle E2 gefunden!",
    successMsg:
      "Perfekt! E2 = Spalte E (fünfter Buchstabe), Zeile 2. Wie auf einer Karte: immer zuerst die Spalte (Buchstabe), dann die Zeile (Zahl).",
    coins: 10,
  },
  {
    chapter: "II",
    chapterLabel: "Kapitel II — Adressen lesen",
    icon: "📍",
    quest: "Wie heisst die markierte Zelle?",
    type: "type-address",
    narration: `Jetzt umgekehrt! Du siehst eine markierte Zelle und musst ihre Adresse nennen. Schau: Welcher <strong>Buchstabe</strong> steht oben (Spalte)? Welche <strong>Zahl</strong> links (Zeile)?`,
    taskText: `Die leuchtende Zelle — wie lautet ihre Adresse? Tippe sie ein (Buchstabe + Zahl, z.B. <strong>A1</strong>):`,
    grid: {
      cols: ["A", "B", "C", "D", "E"],
      rows: [1, 2, 3, 4, 5],
      emojis: makeEmojis(5, 5, SEA_POOL),
    },
    highlight: { col: "D", row: 3 },
    answer: "D3",
    successTitle: "📍 Adresse erkannt!",
    successMsg:
      "Genau — D3! Spalte D, Zeile 3. Häufiger Fehler: 3D statt D3 schreiben. In Excel steht der Buchstabe immer zuerst.",
    coins: 15,
  },
  {
    chapter: "II",
    chapterLabel: "Kapitel II — Adressen lesen",
    icon: "📍",
    quest: "Welche Adresse ist korrekt?",
    type: "mc",
    narration: `Vorsicht, Matrose! Piraten legen gerne falsche Fährten. Manche Adressen sehen richtig aus — sind es aber nicht.`,
    taskText: `Die markierte Zelle liegt in <strong>Spalte C, Zeile 5</strong>. Welche Schreibweise ist korrekt?`,
    options: [
      { label: "5C", value: "5c" },
      { label: "C5", value: "c5" },
      { label: "C-5", value: "c-5" },
      { label: "Zelle C/5", value: "zc5" },
    ],
    answer: "c5",
    successTitle: "📍 Falle erkannt!",
    successMsg:
      "C5 ist richtig! «5C» ist die häufigste Verwechslung — Buchstabe kommt immer zuerst. «C-5» und «C/5» sind keine Excel-Adressen. Merke: Buchstabe + Zahl, ohne Trennzeichen.",
    coins: 15,
  },
  {
    chapter: "II",
    chapterLabel: "Kapitel II — Adressen lesen",
    icon: "📍",
    quest: "Wie heisst die markierte Zelle?",
    type: "type-address",
    narration: `Die Karte wird grösser. Auf hoher See gibt es keine einfachen Koordinaten mehr — du musst präzise navigieren.`,
    taskText: `Die leuchtende Zelle auf dieser grossen Karte — was ist ihre Adresse?`,
    grid: {
      cols: ["A", "B", "C", "D", "E", "F"],
      rows: [1, 2, 3, 4, 5, 6],
      emojis: makeEmojis(6, 6, SEA_POOL),
    },
    highlight: { col: "F", row: 5 },
    answer: "F5",
    successTitle: "📍 Perfekte Navigation!",
    successMsg:
      "F5 — Spalte F (sechster Buchstabe!), Zeile 5. Auf grossen Rastern musst du sorgfältig zählen. In Excel siehst du die Adresse immer in der Namenbox links oben.",
    coins: 20,
  },
  {
    chapter: "III",
    chapterLabel: "Kapitel III — Zeile & Spalte",
    icon: "⚓",
    quest: "Zeile oder Spalte?",
    type: "row-or-col",
    narration: `Zwei Konzepte für immer: <strong>Zeilen</strong> gehen <em>horizontal</em> — wie Planken auf dem Schiffsdeck. <strong>Spalten</strong> gehen <em>vertikal</em> — wie Masten.`,
    taskText: `«Zeile 6» in Excel — ist das <strong>horizontal</strong> (→) oder <strong>vertikal</strong> (↓)?`,
    options: [
      { label: "→ Horizontal", value: "h", style: "zeile" },
      { label: "↓ Vertikal", value: "v", style: "spalte" },
    ],
    answer: "h",
    successTitle: "⚓ Gut gemerkt!",
    successMsg:
      "Zeilen sind horizontal — sie gehen von links nach rechts, nummeriert mit 1, 2, 3... Eselsbrücke: Zeile = liegt flach, wie ein Matrose der sich auf dem Deck hinlegt.",
    coins: 10,
  },
  {
    chapter: "III",
    chapterLabel: "Kapitel III — Zeile & Spalte",
    icon: "⚓",
    quest: "Was stimmt hier?",
    type: "mc",
    narration: `Piraten-Falle! Vier Aussagen, nur eine ist wahr. Lies jede sorgfältig — kleine Unterschiede entscheiden.`,
    taskText: `Welche Aussage über Spalten in Excel ist <strong>korrekt</strong>?`,
    options: [
      { label: "Spalten haben Zahlen (1, 2, 3…)", value: "a" },
      { label: "Spalten gehen horizontal (→)", value: "b" },
      { label: "Spalten haben Buchstaben (A, B, C…)", value: "c" },
      { label: "Spalte A ist ganz unten", value: "d" },
    ],
    answer: "c",
    successTitle: "🏴‍☠️ Falle umschifft!",
    successMsg:
      "Richtig! Spalten haben Buchstaben (A, B, C...) und gehen vertikal (↓). Zeilen haben Zahlen und gehen horizontal (→). Spalte A ist ganz links — nicht unten!",
    coins: 15,
  },
  {
    chapter: "III",
    chapterLabel: "Kapitel III — Zeile & Spalte",
    icon: "⚓",
    quest: "Was steckt in der Adresse?",
    type: "mc",
    narration: `In jeder Zelladresse stecken zwei Informationen gleichzeitig — eine für die Spalte, eine für die Zeile.`,
    taskText: `In der Adresse <strong>G7</strong> — was gibt der Buchstabe <strong>«G»</strong> an?`,
    options: [
      { label: "Die Zeile", value: "zeile" },
      { label: "Die Spalte", value: "spalte" },
      { label: "Die 7. Zeile", value: "z7" },
      { label: "Die Grösse der Zelle", value: "groesse" },
    ],
    answer: "spalte",
    successTitle: "🧭 Kurs stimmt!",
    successMsg:
      "G steht für Spalte G — die siebte Spalte von links. Die 7 gibt die Zeile an. Eselsbrücke für G7: «Geh zur 7. Zeile in Spalte G». Buchstabe = Spalte, Zahl = Zeile. Immer.",
    coins: 15,
  },
  {
    chapter: "IV",
    chapterLabel: "Kapitel IV — Die letzte Karte",
    icon: "🏴‍☠️",
    quest: "Klicke auf die richtige Zelle!",
    type: "click-cell",
    narration: `Das vorletzte Kartenstück! Die Insel ist riesig — das Raster hat 7 Spalten und 6 Zeilen. Navigiere präzise, jeder Fehler kostet ein Herz.`,
    taskText: `Das Kartenstück liegt bei <strong>F3</strong>. Auf einer so grossen Karte muss man die Spalten sorgfältig zählen — F ist die <em>sechste</em> Spalte!`,
    grid: {
      cols: ["A", "B", "C", "D", "E", "F", "G"],
      rows: [1, 2, 3, 4, 5, 6],
      emojis: makeEmojis(7, 6, SEA_POOL),
    },
    answer: { col: "F", row: 3 },
    successTitle: "🏴‍☠️ Fast am Ziel!",
    successMsg:
      "F3 — Spalte F (sechste!), Zeile 3. Auf grossen Rastern hilft es, die Spalten von A aus laut zu zählen: A-B-C-D-E-F. Noch eine letzte Koordinate zu finden!",
    coins: 20,
  },
  {
    chapter: "IV",
    chapterLabel: "Kapitel IV — Die letzte Karte",
    icon: "🏴‍☠️",
    quest: "Klicke auf die richtige Zelle!",
    type: "click-cell",
    narration: `Das allerletzte Stück der Schatzkarte. Der Schatz von Käpt'n Spreadus wartet. Beweise dass du die grösste Karte meistern kannst!`,
    taskText: `Der Schatz liegt bei <strong>C6</strong>. Letzte Chance — klicke präzise!`,
    grid: {
      cols: ["A", "B", "C", "D", "E", "F", "G"],
      rows: [1, 2, 3, 4, 5, 6],
      emojis: makeEmojis(7, 6, SEA_POOL),
    },
    answer: { col: "C", row: 6 },
    successTitle: "🏆 DER SCHATZ!",
    successMsg:
      "C6 — Spalte C, Zeile 6. Du hast alle Kartenstücke gesammelt und den Schatz von Käpt'n Spreadus gefunden! Du beherrschst jetzt Zellen, Adressen, Zeilen und Spalten in Excel.",
    coins: 30,
  },
];

const CHAPTERS = ["I", "II", "III", "IV"];

// ════════════════════════════════════════════
//  COIN BURST HOOK
// ════════════════════════════════════════════
function useCoinBurst() {
  const spawnAt = useCallback((cx, cy) => {
    for (let i = 0; i < 8; i++) {
      const el = document.createElement("div");
      el.className = "ip-coin-burst";
      el.textContent = "🪙";
      const angle = (i / 8) * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      el.style.left = cx + "px";
      el.style.top = cy + "px";
      el.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      el.style.setProperty("--ty", Math.sin(angle) * dist + "px");
      el.style.animation = `ip-coin-fly ${0.6 + Math.random() * 0.4}s ease forwards`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }, []);

  const spawnAtElement = useCallback(
    (el) => {
      const rect = el.getBoundingClientRect();
      spawnAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    },
    [spawnAt],
  );

  const spawnCenter = useCallback(() => {
    spawnAt(window.innerWidth / 2, window.innerHeight / 2);
  }, [spawnAt]);

  return { spawnAtElement, spawnCenter };
}

// ════════════════════════════════════════════
//  GRID COMPONENT
// ════════════════════════════════════════════
function MapGrid({
  gridDef,
  clickAnswer,
  highlight,
  flashCell,
  foundCell,
  onCellClick,
  cellIdPrefix = "ip-cell-",
}) {
  return (
    <div className="ip-grid-section">
      <table className="ip-map-grid">
        <thead>
          <tr>
            <th className="ip-grid-col-header"></th>
            {gridDef.cols.map((col) => (
              <th key={col} className="ip-grid-col-header">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {gridDef.rows.map((rowNum, ri) => (
            <tr key={rowNum}>
              <td className="ip-grid-row-header">{rowNum}</td>
              {gridDef.cols.map((colLetter, ci) => {
                const cellId = `${colLetter}${rowNum}`;
                const isHighlight =
                  highlight &&
                  highlight.col === colLetter &&
                  highlight.row === rowNum;
                const isFound = foundCell === cellId;
                const isFlashCell = flashCell && flashCell.id === cellId;
                const isClickable = !!clickAnswer;

                let cls = "ip-grid-cell";
                if (isHighlight) cls += " highlighted";
                if (isFound) cls += " found";
                if (isFlashCell && flashCell.kind === "correct")
                  cls += " correct-flash";
                if (isFlashCell && flashCell.kind === "wrong")
                  cls += " wrong-flash";
                if (!isClickable) cls += " no-click";

                const emoji = isFound ? "⭐" : gridDef.emojis[ri][ci];

                return (
                  <td
                    key={colLetter}
                    id={`${cellIdPrefix}${cellId}`}
                    className={cls}
                    onClick={
                      isClickable && !isFound
                        ? () => onCellClick(colLetter, rowNum)
                        : undefined
                    }
                  >
                    {emoji}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════════
//  PROGRESS MAP
// ════════════════════════════════════════════
function ProgressMap({ currentQuestIdx }) {
  const chapterQuests = {};
  QUESTS.forEach((q, i) => {
    if (!chapterQuests[q.chapter]) chapterQuests[q.chapter] = [];
    chapterQuests[q.chapter].push(i);
  });

  return (
    <div className="ip-progress-map">
      {CHAPTERS.map((ch, ci) => {
        const idxs = chapterQuests[ch] || [];
        const allDone = idxs.every((i) => i < currentQuestIdx);
        const isCurrent = idxs.some((i) => i === currentQuestIdx);
        const cls = allDone
          ? "ip-map-dot done"
          : isCurrent
            ? "ip-map-dot current"
            : "ip-map-dot";
        const lineDone = ci < CHAPTERS.length - 1 && allDone;
        return (
          <span
            key={ch}
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <div className={cls}>{ch}</div>
            {ci < CHAPTERS.length - 1 && (
              <div className={`ip-map-line${lineDone ? " done" : ""}`} />
            )}
          </span>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════
//  MEDALLION SVG
// ════════════════════════════════════════════
function Medallion() {
  return (
    <div className="ip-medallion-wrap">
      <svg
        className="ip-medallion-svg"
        width="220"
        height="220"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="ip-goldMain" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff0a0" />
            <stop offset="30%" stopColor="#f0b429" />
            <stop offset="65%" stopColor="#c8960a" />
            <stop offset="100%" stopColor="#7a5500" />
          </radialGradient>
          <radialGradient id="ip-goldFace" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff5b0" />
            <stop offset="40%" stopColor="#e8a820" />
            <stop offset="100%" stopColor="#9a6800" />
          </radialGradient>
          <filter id="ip-inset" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow
              dx="1"
              dy="2"
              stdDeviation="2"
              floodColor="#5a3a00"
              floodOpacity="0.6"
            />
          </filter>
        </defs>

        {/* Outer rim */}
        <circle cx="110" cy="110" r="108" fill="#5a3a00" />
        {/* Notched teeth */}
        <g fill="#c8960a">
          {Array.from({ length: 24 }, (_, i) => (
            <rect
              key={i}
              x="107"
              y="3"
              width="6"
              height="14"
              rx="2"
              transform={`rotate(${i * 15} 110 110)`}
            />
          ))}
        </g>

        {/* Main disc */}
        <circle
          cx="110"
          cy="110"
          r="96"
          fill="url(#ip-goldMain)"
          filter="url(#ip-inset)"
        />
        <circle
          cx="110"
          cy="110"
          r="96"
          fill="none"
          stroke="#fff0a0"
          strokeWidth="3"
          opacity="0.6"
        />
        <circle
          cx="110"
          cy="110"
          r="90"
          fill="none"
          stroke="#7a5500"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Text ring */}
        <path id="ip-topArc" d="M 30,110 A 80,80 0 0,1 190,110" fill="none" />
        <path id="ip-botArc" d="M 35,118 A 78,78 0 0,0 185,118" fill="none" />
        <text
          fontFamily="Cinzel, serif"
          fontSize="11"
          fontWeight="700"
          fill="#5a3a00"
          letterSpacing="2"
        >
          <textPath href="#ip-topArc" startOffset="8%">
            SCHATZ DES KÄPT&apos;N SPREADUS
          </textPath>
        </text>
        <text
          fontFamily="Cinzel, serif"
          fontSize="9"
          fontWeight="400"
          fill="#7a5500"
          letterSpacing="3"
        >
          <textPath href="#ip-botArc" startOffset="15%">
            ✦ ANNO DOMINI 1686 ✦
          </textPath>
        </text>

        {/* Inner face */}
        <circle cx="110" cy="110" r="64" fill="url(#ip-goldFace)" />
        <circle
          cx="110"
          cy="110"
          r="64"
          fill="none"
          stroke="#c8960a"
          strokeWidth="1.5"
        />

        {/* Skull */}
        <ellipse
          cx="110"
          cy="97"
          rx="18"
          ry="16"
          fill="#7a5500"
          opacity="0.7"
        />
        <rect
          x="96"
          y="109"
          width="28"
          height="9"
          rx="4"
          fill="#7a5500"
          opacity="0.7"
        />
        <rect
          x="100"
          y="113"
          width="5"
          height="6"
          rx="1"
          fill="#c8960a"
          opacity="0.5"
        />
        <rect
          x="107"
          y="113"
          width="5"
          height="6"
          rx="1"
          fill="#c8960a"
          opacity="0.5"
        />
        <rect
          x="114"
          y="113"
          width="5"
          height="6"
          rx="1"
          fill="#c8960a"
          opacity="0.5"
        />
        <ellipse cx="103" cy="97" rx="5" ry="5" fill="#c8960a" opacity="0.4" />
        <ellipse cx="117" cy="97" rx="5" ry="5" fill="#c8960a" opacity="0.4" />

        {/* Crossbones */}
        <line
          x1="86"
          y1="126"
          x2="134"
          y2="142"
          stroke="#7a5500"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <line
          x1="134"
          y1="126"
          x2="86"
          y2="142"
          stroke="#7a5500"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <circle cx="84" cy="125" r="4" fill="#7a5500" opacity="0.6" />
        <circle cx="136" cy="125" r="4" fill="#7a5500" opacity="0.6" />
        <circle cx="84" cy="143" r="4" fill="#7a5500" opacity="0.6" />
        <circle cx="136" cy="143" r="4" fill="#7a5500" opacity="0.6" />

        {/* Password banner */}
        <path
          d="M 58,154 Q 58,148 65,148 L 155,148 Q 162,148 162,154 L 162,168 Q 162,174 155,174 L 65,174 Q 58,174 58,168 Z"
          fill="#3a1a00"
          opacity="0.85"
        />
        <path d="M 58,154 L 50,161 L 58,168" fill="#5a2a00" opacity="0.7" />
        <path d="M 162,154 L 170,161 L 162,168" fill="#5a2a00" opacity="0.7" />
        <path
          d="M 65,149 L 155,149"
          stroke="#f0b429"
          strokeWidth="1"
          opacity="0.4"
        />
        <text
          x="110"
          y="165"
          textAnchor="middle"
          fontFamily="Courier New, monospace"
          fontSize="16"
          fontWeight="900"
          fill="#f0b429"
          letterSpacing="3"
        >
          X5K-GL7
        </text>

        {/* Shimmer */}
        <ellipse
          cx="90"
          cy="75"
          rx="28"
          ry="14"
          fill="white"
          opacity="0.12"
          transform="rotate(-20 90 75)"
        />

        {/* Stars */}
        <text x="74" y="87" fontSize="9" fill="#fff0a0" opacity="0.7">
          ✦
        </text>
        <text x="140" y="87" fontSize="9" fill="#fff0a0" opacity="0.7">
          ✦
        </text>
      </svg>
      <div className="ip-medallion-label">
        🔑 Das goldene Medaillon — bewahre es gut
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  SCREEN ENUM
// ════════════════════════════════════════════
const SCREEN = { INTRO: "intro", GAME: "game", FINALE: "finale" };

// ════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════
export default function IntroPirates() {
  // eslint-disable-next-line no-unused-vars
  const isEmbed = useEmbedResize();
  const [screen, setScreen] = useState(SCREEN.INTRO);
  const [questIdx, setQuestIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [answered, setAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // { ok, msg } | null
  const [successVisible, setSuccessVisible] = useState(false);

  // Per-quest interaction state
  const [typeValue, setTypeValue] = useState("");
  const [flashCell, setFlashCell] = useState(null); // { id, kind: "correct"|"wrong" }
  const [foundCell, setFoundCell] = useState(null);
  const [mcState, setMcState] = useState({}); // { value: "correct"|"wrong" }
  const [rcState, setRcState] = useState({});

  const inputRef = useRef(null);
  const { spawnAtElement, spawnCenter } = useCoinBurst();

  const quest = QUESTS[questIdx];
  const isLastQuest = questIdx === QUESTS.length - 1;

  // Focus text input when a type-address quest becomes active
  useEffect(() => {
    if (screen === SCREEN.GAME && quest.type === "type-address") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [questIdx, screen, quest.type]);

  // ── Reset per-quest state ──
  function resetQuestState() {
    setAnswered(false);
    setFeedback(null);
    setTypeValue("");
    setFlashCell(null);
    setFoundCell(null);
    setMcState({});
    setRcState({});
  }

  function startGame() {
    setScore(0);
    setLives(3);
    setQuestIdx(0);
    resetQuestState();
    setSuccessVisible(false);
    setScreen(SCREEN.GAME);
  }

  function restartGame() {
    setScore(0);
    setLives(3);
    setQuestIdx(0);
    resetQuestState();
    setSuccessVisible(false);
    setScreen(SCREEN.GAME);
  }

  function loseLife() {
    setLives((l) => Math.max(0, l - 1));
  }

  function triggerSuccess(q, extraCoins) {
    const earned = extraCoins ?? q.coins;
    setScore((s) => s + earned);
    setSuccessVisible(true);
  }

  function handleNextQuest() {
    setSuccessVisible(false);
    if (isLastQuest) {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => spawnCenter(), i * 200);
      }
      setScreen(SCREEN.FINALE);
    } else {
      setQuestIdx((idx) => idx + 1);
      resetQuestState();
    }
  }

  // ── CLICK-CELL ──
  function handleCellClick(col, row) {
    if (answered) return;
    const correct = quest.answer.col === col && quest.answer.row === row;
    const cellId = `${col}${row}`;

    if (correct) {
      setAnswered(true);
      setFoundCell(cellId);
      setFlashCell({ id: cellId, kind: "correct" });
      // spawn coins from the cell element
      const el = document.getElementById(`ip-cell-${cellId}`);
      if (el) spawnAtElement(el);
      setTimeout(() => triggerSuccess(quest), 700);
    } else {
      setFlashCell({ id: cellId, kind: "wrong" });
      loseLife();
      setFeedback({
        ok: false,
        msg: "✗ Nicht ganz! Erinnere dich: erst der Buchstabe (Spalte), dann die Zahl (Zeile).",
      });
      setTimeout(() => setFlashCell(null), 500);
    }
  }

  // ── TYPE-ADDRESS ──
  function handleTypeCheck() {
    if (answered) return;
    const val = typeValue.trim().toUpperCase();
    if (!val) {
      setFeedback({ ok: false, msg: "⚠ Gib eine Adresse ein, z.B. A1" });
      return;
    }
    if (val === quest.answer) {
      setAnswered(true);
      setFeedback({ ok: true, msg: "✓ Richtig!" });
      // flash the answer cell
      setFoundCell(quest.answer);
      spawnCenter();
      setTimeout(() => triggerSuccess(quest), 700);
    } else {
      loseLife();
      setFeedback({
        ok: false,
        msg: `✗ «${val}» stimmt nicht. Schau: Welcher Buchstabe steht oben? Welche Zahl links?`,
      });
    }
  }

  // ── MULTIPLE CHOICE ──
  function handleMC(value) {
    if (answered) return;
    const correct = value === quest.answer;
    setMcState((prev) => ({ ...prev, [value]: correct ? "correct" : "wrong" }));
    if (correct) {
      setAnswered(true);
      spawnCenter();
      setTimeout(() => triggerSuccess(quest), 600);
    } else {
      loseLife();
      setFeedback({ ok: false, msg: "✗ Nicht ganz — versuch nochmal!" });
    }
  }

  // ── ROW OR COL ──
  function handleRC(value) {
    if (answered) return;
    const correct = value === quest.answer;
    setRcState((prev) => ({ ...prev, [value]: correct ? "correct" : "wrong" }));
    if (correct) {
      setAnswered(true);
      spawnCenter();
      setTimeout(() => triggerSuccess(quest), 600);
    } else {
      loseLife();
      setFeedback({
        ok: false,
        msg: "✗ Denk nochmal nach: Zeilen = horizontal (→), Spalten = vertikal (↓).",
      });
    }
  }

  // ────────────────────────────────────────
  //  RENDER
  // ────────────────────────────────────────
  return (
    <div className="ip-root">
      {/* Waves */}
      <div className="ip-waves">
        <div className="ip-wave ip-wave1" />
        <div className="ip-wave ip-wave2" />
        <div className="ip-wave ip-wave3" />
      </div>

      {/* ══ INTRO ══ */}
      {screen === SCREEN.INTRO && (
        <div className="ip-intro">
          <div className="ip-ship-emoji">⚓</div>
          <div className="ip-intro-title">Käpt&apos;n Zelle</div>
          <div className="ip-intro-sub">Das grosse Piraten-Abenteuer</div>

          <div className="ip-scroll-box">
            <div className="ip-scroll-label">📜 Bordbuch – Eintrag 1</div>
            <div className="ip-scroll-text">
              <p>
                Ahoi, Matrose! Der legendäre Schatz des{" "}
                <span className="ip-gold">Käpt&apos;n Spreadus</span> liegt
                irgendwo auf der Insel — aber die Schatzkarte ist in Teile
                zerrissen.
              </p>
              <p>
                Jedes Stück ist in einem anderen Versteck auf der Insel. Um sie
                zu finden, musst du die Sprache der Seeräuber beherrschen:{" "}
                <span className="ip-gold">
                  Zellen, Adressen, Zeilen und Spalten.
                </span>
              </p>
              <p>Beweise dein Können und der Schatz gehört dir!</p>
            </div>
          </div>

          <div className="ip-chapters">
            <div className="ip-chapter-badge first">
              Kapitel I<span>Zellen orten</span>
            </div>
            <div className="ip-chapter-badge">
              Kapitel II<span>Adressen lesen</span>
            </div>
            <div className="ip-chapter-badge">
              Kapitel III<span>Zeile &amp; Spalte</span>
            </div>
            <div className="ip-chapter-badge">
              Kapitel IV<span>Grosse Karte</span>
            </div>
          </div>

          <button className="ip-btn-sail" onClick={startGame}>
            ⚔ Leinen Los!
          </button>
        </div>
      )}

      {/* ══ GAME ══ */}
      {screen === SCREEN.GAME && (
        <div className="ip-game">
          {/* Top bar */}
          <div className="ip-game-top">
            <div className="ip-chapter-title">{quest.chapterLabel}</div>
            <div className="ip-lives">
              {"❤️".repeat(lives)}
              {"🖤".repeat(3 - lives)}
            </div>
            <div className="ip-score-display">
              💰 <span>{score}</span> Goldmünzen
            </div>
          </div>

          <ProgressMap currentQuestIdx={questIdx} />

          {/* Card */}
          <div className="ip-game-card">
            <div className="ip-card-header">
              <div className="ip-card-icon">{quest.icon}</div>
              <div>
                <div className="ip-card-chapter-label">
                  {quest.chapterLabel}
                </div>
                <div className="ip-card-quest">{quest.quest}</div>
              </div>
            </div>

            <div className="ip-card-body">
              {/* Narration */}
              <div
                className="ip-narration"
                dangerouslySetInnerHTML={{ __html: quest.narration }}
              />

              {/* Task */}
              <div className="ip-task-box">
                <div className="ip-task-label">⚓ Deine Aufgabe</div>
                <div
                  className="ip-task-text"
                  dangerouslySetInnerHTML={{ __html: quest.taskText }}
                />
              </div>

              {/* ── click-cell ── */}
              {quest.type === "click-cell" && (
                <>
                  <MapGrid
                    gridDef={quest.grid}
                    clickAnswer={quest.answer}
                    highlight={null}
                    flashCell={flashCell}
                    foundCell={foundCell}
                    onCellClick={handleCellClick}
                    cellIdPrefix="ip-cell-"
                  />
                  {feedback && (
                    <div
                      className={`ip-feedback-bar ${feedback.ok ? "ok" : "err"}`}
                    >
                      {feedback.msg}
                    </div>
                  )}
                </>
              )}

              {/* ── type-address ── */}
              {quest.type === "type-address" && (
                <>
                  <MapGrid
                    gridDef={quest.grid}
                    clickAnswer={null}
                    highlight={quest.highlight}
                    flashCell={null}
                    foundCell={foundCell}
                    onCellClick={null}
                    cellIdPrefix="ip-cell-"
                  />
                  <div className="ip-answer-area">
                    <div className="ip-type-input-wrap">
                      <input
                        ref={inputRef}
                        className="ip-addr-input"
                        maxLength={3}
                        placeholder="??"
                        value={typeValue}
                        onChange={(e) =>
                          setTypeValue(e.target.value.toUpperCase())
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleTypeCheck();
                        }}
                      />
                      <button
                        className="ip-btn-check"
                        onClick={handleTypeCheck}
                      >
                        Prüfen
                      </button>
                    </div>
                    {feedback && (
                      <div
                        className={`ip-feedback-bar ${feedback.ok ? "ok" : "err"}`}
                      >
                        {feedback.msg}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* ── multiple choice ── */}
              {quest.type === "mc" && (
                <div className="ip-answer-area">
                  <div className="ip-mc-options">
                    {quest.options.map((opt) => {
                      const state = mcState[opt.value];
                      const cls = ["ip-mc-btn", state ?? ""]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <button
                          key={opt.value}
                          className={cls}
                          onClick={() => handleMC(opt.value)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <div
                      className={`ip-feedback-bar ${feedback.ok ? "ok" : "err"}`}
                    >
                      {feedback.msg}
                    </div>
                  )}
                </div>
              )}

              {/* ── row-or-col ── */}
              {quest.type === "row-or-col" && (
                <div className="ip-answer-area">
                  <div className="ip-rowcol-options">
                    {quest.options.map((opt) => {
                      const state = rcState[opt.value];
                      const cls = ["ip-rowcol-btn", opt.style, state ?? ""]
                        .filter(Boolean)
                        .join(" ");
                      return (
                        <button
                          key={opt.value}
                          className={cls}
                          onClick={() => handleRC(opt.value)}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                  {feedback && (
                    <div
                      className={`ip-feedback-bar ${feedback.ok ? "ok" : "err"}`}
                    >
                      {feedback.msg}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ SUCCESS OVERLAY ══ */}
      {screen === SCREEN.GAME && (
        <div
          className={`ip-success-overlay${successVisible ? " visible" : ""}`}
        >
          <div className="ip-success-scroll">
            <div className="ip-success-icon">{quest.icon}</div>
            <div className="ip-success-title">{quest.successTitle}</div>
            <div className="ip-success-msg">{quest.successMsg}</div>
            <button className="ip-btn-next" onClick={handleNextQuest}>
              {isLastQuest ? "🏴‍☠️ Schatz öffnen!" : "Weiter ⚓"}
            </button>
          </div>
        </div>
      )}

      {/* ══ FINALE ══ */}
      {screen === SCREEN.FINALE && (
        <div className="ip-finale">
          <div className="ip-treasure-chest">🪙</div>
          <div className="ip-finale-title">Schatz gefunden!</div>
          <div className="ip-finale-sub">
            Du hast alle Kartenstücke gesammelt
          </div>

          <Medallion />

          <div className="ip-finale-scroll">
            <div className="ip-finale-item">
              <span className="loot">🗺️</span>
              <span className="concept">
                Kapitel I — Zellen nach Adresse anklicken
              </span>
            </div>
            <div className="ip-finale-item">
              <span className="loot">📍</span>
              <span className="concept">
                Kapitel II — Adressen lesen &amp; benennen
              </span>
            </div>
            <div className="ip-finale-item">
              <span className="loot">⚓</span>
              <span className="concept">
                Kapitel III — Zeile vs. Spalte unterscheiden
              </span>
            </div>
            <div className="ip-finale-item">
              <span className="loot">🏴‍☠️</span>
              <span className="concept">
                Kapitel IV — Grosse Karte meistern
              </span>
            </div>
            <div className="ip-finale-score">
              💰 <span>{score}</span> Goldmünzen erbeutet!
            </div>
          </div>

          <button className="ip-btn-restart" onClick={restartGame}>
            ↩ Nochmals segeln
          </button>
        </div>
      )}
    </div>
  );
}
