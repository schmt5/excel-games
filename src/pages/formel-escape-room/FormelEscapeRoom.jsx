import { useState, useEffect, useRef, useCallback } from "react";
import "./FormelEscapeRoom.css";

// ════════════════════════════════════════════
//  ROOM DEFINITIONS
// ════════════════════════════════════════════
const ROOMS = [
  {
    id: 1,
    title: "ZONE 1 // VORRATSLAGER",
    story: `Das Vorratslager ist verriegelt. Drinnen: Konserven, Wasser, Werkzeug. Draussen: Stöhnen. Das elektronische Schloss verlangt, dass du den <strong>Gesamtvorrat</strong> korrekt berechnest — erst dann öffnet es.`,
    taskText: `Im Regal stehen <strong>34 Dosen Bohnen</strong> und <strong>21 Dosen Thunfisch</strong>. Berechne den Gesamtbestand in Zelle <strong>B4</strong>. Schreibe eine echte Formel — keine einfache Zahl!`,
    inputCell: { ref: "B4" },
    hint: "💡 Addiere die Werte direkt: =34+21 — oder verwende die Zellnamen B2 und B3!",
    validate: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      return (
        v === "=34+21" ||
        v === "=21+34" ||
        v === "=b2+b3" ||
        v === "=b3+b2" ||
        v === "=55"
      );
    },
    checkFeedback: (val) => {
      const v = val.trim().toLowerCase();
      if (v === "=55" || v === "55")
        return {
          msg: "⚠ Fast! Aber das System will eine Formel mit =, nicht nur das Ergebnis. Probiere =34+21",
        };
      if (!v.startsWith("="))
        return { msg: "⚠ Formeln beginnen immer mit = !" };
      return { msg: "✗ Nicht ganz. Addiere: Bohnen 34 + Thunfisch 21." };
    },
    successTitle: "🔓 VORRATSLAGER OFFEN",
    successMsg:
      "Geschafft! =34+21 oder =B2+B3 — beides öffnet die Tür. Mit Zellbezügen ist die Formel flexibler: ändert sich ein Vorrat, rechnet Excel sofort neu. Weiter — die Zeit läuft.",
    sheet: [
      { type: "header", cols: ["", "A", "B"] },
      {
        type: "row",
        num: 1,
        cells: [
          { type: "label", val: "Vorrat", bold: true },
          { type: "label", val: "Anzahl Dosen", bold: true },
        ],
      },
      {
        type: "row",
        num: 2,
        cells: [
          { type: "label", val: "Bohnen" },
          { type: "number", val: "34" },
        ],
      },
      {
        type: "row",
        num: 3,
        cells: [
          { type: "label", val: "Thunfisch" },
          { type: "number", val: "21" },
        ],
      },
      {
        type: "row",
        num: 4,
        cells: [
          { type: "label", val: "GESAMT", bold: true },
          { type: "input", ref: "B4" },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "ZONE 2 // MEDIZINRAUM",
    story: `Der Medizinraum. Antibiotika, Verbandsmaterial, Schmerzmittel. Jemand aus deiner Gruppe ist verletzt. Die Tür ist zu. Das System zeigt eine halbfertige Tabelle — eine Formel fehlt. Sie wurde aus der Zeile darüber kopiert.`,
    taskText: `In <strong>E2</strong> steht <strong>=C2*D2</strong> (Stück × Gewicht in g). Diese Formel wurde eine Zeile nach unten kopiert. Was steht dann automatisch in <strong>E3</strong>? Tippe die Formel ein.`,
    inputCell: { ref: "E3" },
    hint: "💡 Excel passt Zeilennummern beim Kopieren automatisch an. Aus =C2*D2 wird in Zeile 3 → =C?*D?",
    validate: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      return v === "=c3*d3" || v === "=d3*c3";
    },
    checkFeedback: (val) => {
      const v = val.trim().toLowerCase();
      if (!v.startsWith("=")) return { msg: "⚠ Formeln starten mit = !" };
      if (v.includes("c2") || v.includes("d2"))
        return {
          msg: "⚠ Fast! Aber beim Kopieren eine Zeile nach unten ändert sich die Zahl: C2→C3, D2→D3.",
        };
      return {
        msg: "✗ Denk ans Kopieren: Spalten bleiben gleich (C, D), nur die Zeile wird zu 3.",
      };
    },
    successTitle: "🔓 MEDIZINRAUM OFFEN",
    successMsg:
      "Richtig! Das nennt sich relativer Bezug. Excel denkt in Relationen — eine Zeile tiefer, Zeilennummer +1. So schreibst du eine Formel einmal und kopierst sie für alle Zeilen. Hol die Verbände, dann weiter.",
    sheet: [
      { type: "header", cols: ["", "A", "B", "C", "D", "E"] },
      {
        type: "row",
        num: 1,
        cells: [
          { type: "label", val: "Medikament", bold: true },
          { type: "label", val: "Einheit", bold: true },
          { type: "label", val: "Stück", bold: true },
          { type: "label", val: "Gewicht (g)", bold: true },
          { type: "label", val: "Total (g)", bold: true },
        ],
      },
      {
        type: "row",
        num: 2,
        cells: [
          { type: "label", val: "Ibuprofen" },
          { type: "label", val: "Tablette" },
          { type: "number", val: "20" },
          { type: "number", val: "0.5" },
          { type: "label", val: "=C2*D2", highlighted: true },
        ],
      },
      {
        type: "row",
        num: 3,
        cells: [
          { type: "label", val: "Amoxicillin" },
          { type: "label", val: "Kapsel" },
          { type: "number", val: "14" },
          { type: "number", val: "0.3" },
          { type: "input", ref: "E3" },
        ],
      },
      {
        type: "row",
        num: 4,
        cells: [
          { type: "label", val: "Verband" },
          { type: "label", val: "Rolle" },
          { type: "number", val: "8" },
          { type: "number", val: "45" },
          { type: "label", val: "=C4*D4" },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "ZONE 3 // FUNKRAUM",
    story: `Der Funkraum. Von hier aus kannst du Rettungssignale senden — aber nur wenn die Batterie lange genug hält. Das System berechnet automatisch den Verbrauch über 5 Tage. Es fehlt die <strong>Gesamtsumme</strong>.`,
    taskText: `Der tägliche Stromverbrauch steht in <strong>B2:B6</strong>. Berechne in <strong>B7</strong> den <strong>Gesamtverbrauch</strong> aller 5 Tage mit der Funktion SUMME().`,
    inputCell: { ref: "B7" },
    hint: '💡 Der Bereich geht von B2 bis B6. Schreibe =SUMME(B2:B6) — der Doppelpunkt bedeutet "von bis".',
    validate: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      return v === "=summe(b2:b6)" || v === "=sum(b2:b6)";
    },
    checkFeedback: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      if (!v.startsWith("=")) return { msg: "⚠ Formeln starten mit = !" };
      if (v.includes("summe") && !v.includes("b2:b6"))
        return {
          msg: "⚠ Fast! Welcher Bereich? B2 bis B6 → schreibe B2:B6 (mit Doppelpunkt).",
        };
      if (v.includes("+"))
        return {
          msg: "⚠ Das würde gehen, aber Excel hat eine Funktion dafür. Probiere =SUMME(B2:B6)",
        };
      return {
        msg: "✗ Die Funktion heisst SUMME() — Argument ist der Bereich B2:B6.",
      };
    },
    successTitle: "🔓 FUNK AKTIV",
    successMsg:
      "=SUMME(B2:B6) — viel effizienter als alles einzeln zu addieren. Das Funksignal läuft. Bei 100 Tagen Daten sparst du damit enorm Zeit. Für den Durchschnitt: =MITTELWERT(B2:B6). Letzter Raum — der Bunker.",
    sheet: [
      { type: "header", cols: ["", "A", "B"] },
      {
        type: "row",
        num: 1,
        cells: [
          { type: "label", val: "Tag", bold: true },
          { type: "label", val: "Verbrauch (Wh)", bold: true },
        ],
      },
      {
        type: "row",
        num: 2,
        cells: [
          { type: "label", val: "Tag 1" },
          { type: "number", val: "340" },
        ],
      },
      {
        type: "row",
        num: 3,
        cells: [
          { type: "label", val: "Tag 2" },
          { type: "number", val: "290" },
        ],
      },
      {
        type: "row",
        num: 4,
        cells: [
          { type: "label", val: "Tag 3" },
          { type: "number", val: "410" },
        ],
      },
      {
        type: "row",
        num: 5,
        cells: [
          { type: "label", val: "Tag 4" },
          { type: "number", val: "275" },
        ],
      },
      {
        type: "row",
        num: 6,
        cells: [
          { type: "label", val: "Tag 5" },
          { type: "number", val: "380" },
        ],
      },
      {
        type: "row",
        num: 7,
        cells: [
          { type: "label", val: "GESAMT", bold: true },
          { type: "input", ref: "B7" },
        ],
      },
    ],
  },
  {
    id: 4,
    title: "ZONE 4 // BUNKER",
    story: `Der Bunker. Massivstahl, 2 Meter tief. Hier ist die Gruppe sicher. Die letzte Tür. Das System berechnet die Kalorienration pro Person — der Kalorienwert pro Dose steht in <strong>B1</strong> und soll beim Kopieren der Formel immer fixiert bleiben.`,
    taskText: `In <strong>C3</strong> soll stehen: Anzahl Dosen (B3) × Kalorien pro Dose (<strong>B1</strong>). B1 darf sich beim Kopieren nach unten <strong>nicht</strong> verändern. Schreibe die Formel mit absolutem Bezug.`,
    inputCell: { ref: "C3" },
    hint: "💡 Fixiere B1 mit Dollarzeichen: $B$1 bleibt immer B1. Die vollständige Formel: =B3*$B$1",
    validate: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      return v === "=b3*$b$1" || v === "=$b$1*b3";
    },
    checkFeedback: (val) => {
      const v = val.trim().replace(/\s/g, "").toLowerCase();
      if (!v.startsWith("=")) return { msg: "⚠ Formeln starten mit = !" };
      if (v.includes("b3") && v.includes("b1") && !v.includes("$"))
        return {
          msg: "⚠ Fast! Aber =B3*B1 würde sich beim Kopieren verändern. Fixiere B1 mit $: $B$1",
        };
      if (v.includes("$b1") || v.includes("b$1"))
        return {
          msg: "⚠ Gut gedacht! Aber fixiere beide Teile: Spalte UND Zeile → $B$1",
        };
      return {
        msg: "✗ Du brauchst: B3 (relativ, ändert sich) multipliziert mit $B$1 (absolut, bleibt fixiert).",
      };
    },
    successTitle: "🏆 BUNKER GEÖFFNET!",
    successMsg:
      "$B$1 ist ein absoluter Bezug — das $ fixiert Spalte und Zeile. Beim Kopieren bleibt $B$1 immer gleich, aber B3 wird zu B4, B5 usw. Ändert man den Kalorienwert in B1, rechnet Excel alles auf einmal neu. Ihr habt überlebt.",
    sheet: [
      { type: "header", cols: ["", "A", "B", "C"] },
      {
        type: "row",
        num: 1,
        cells: [
          { type: "label", val: "Kalorien pro Dose", bold: true },
          { type: "number", val: "350", highlighted: true },
          { type: "label", val: "" },
        ],
      },
      {
        type: "row",
        num: 2,
        cells: [
          { type: "label", val: "Person", bold: true },
          { type: "label", val: "Dosen/Tag", bold: true },
          { type: "label", val: "Kalorien/Tag", bold: true },
        ],
      },
      {
        type: "row",
        num: 3,
        cells: [
          { type: "label", val: "Sara" },
          { type: "number", val: "2" },
          { type: "input", ref: "C3" },
        ],
      },
      {
        type: "row",
        num: 4,
        cells: [
          { type: "label", val: "Marco" },
          { type: "number", val: "3" },
          { type: "label", val: "=B4*$B$1" },
        ],
      },
      {
        type: "row",
        num: 5,
        cells: [
          { type: "label", val: "Lena" },
          { type: "number", val: "2" },
          { type: "label", val: "=B5*$B$1" },
        ],
      },
    ],
  },
];

// ════════════════════════════════════════════
//  PARTICLE HOOK
// ════════════════════════════════════════════
function useParticles(canvasRef) {
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  const spawnParticles = useCallback(
    (n = 40) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      for (let i = 0; i < n; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 2,
          life: 1,
          size: Math.random() * 3 + 1,
        });
      }
    },
    [canvasRef],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.012;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,60,60,${p.life * 0.8})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);

  return { spawnParticles };
}

// ════════════════════════════════════════════
//  SHEET COMPONENT
// ════════════════════════════════════════════
function Sheet({ room, inputValue, inputState, onInputChange, onKeyDown }) {
  return (
    <table className="fer-sheet">
      <tbody>
        {room.sheet.map((row, rowIdx) => {
          if (row.type === "header") {
            return (
              <tr key={rowIdx}>
                {row.cols.map((col, colIdx) => (
                  <th key={colIdx} className="fer-col-header">
                    {col}
                  </th>
                ))}
              </tr>
            );
          }
          return (
            <tr key={rowIdx}>
              <td className="fer-row-header">{row.num}</td>
              {row.cells.map((cell, cellIdx) => {
                if (cell.type === "input") {
                  const cellClasses = [
                    "fer-cell",
                    "input-cell",
                    inputState === "correct" ? "correct" : "",
                    inputState === "wrong" ? "wrong" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <td key={cellIdx} className={cellClasses}>
                      <input
                        className="fer-cell-input"
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        autoFocus
                      />
                    </td>
                  );
                }
                const cellClasses = [
                  "fer-cell",
                  cell.type === "number" ? "number" : "label",
                  cell.bold ? "bold" : "",
                  cell.highlighted ? "highlighted" : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <td key={cellIdx} className={cellClasses}>
                    {cell.val ?? ""}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ════════════════════════════════════════════
//  MAIN COMPONENT
// ════════════════════════════════════════════
const SCREEN = { INTRO: "intro", GAME: "game", FINALE: "finale" };

export default function FormelEscapeRoom() {
  const canvasRef = useRef(null);
  const { spawnParticles } = useParticles(canvasRef);

  const [screen, setScreen] = useState(SCREEN.INTRO);
  const [currentRoom, setCurrentRoom] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [inputState, setInputState] = useState(null); // null | "correct" | "wrong"
  const [feedback, setFeedback] = useState(null); // { ok, msg } | null
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintVisible, setHintVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const room = ROOMS[currentRoom];
  const isLastRoom = currentRoom === ROOMS.length - 1;

  function resetRoomState() {
    setInputValue("");
    setInputState(null);
    setFeedback(null);
    setHintsUsed(0);
    setHintVisible(false);
    setSuccessVisible(false);
  }

  function startGame() {
    resetRoomState();
    setCurrentRoom(0);
    setScreen(SCREEN.GAME);
  }

  function restartGame() {
    resetRoomState();
    setCurrentRoom(0);
    setScreen(SCREEN.GAME);
  }

  function handleInputChange(val) {
    setInputValue(val);
    // Clear wrong state while typing
    if (inputState === "wrong") setInputState(null);
    if (feedback?.ok === false) setFeedback(null);
  }

  function checkAnswer() {
    if (room.validate(inputValue)) {
      setInputState("correct");
      setFeedback({ ok: true, msg: "✓ Korrekt! Tür wird geöffnet..." });
      spawnParticles(60);
      setTimeout(() => {
        setSuccessVisible(true);
        spawnParticles(80);
      }, 700);
    } else {
      setInputState("wrong");
      const fb = room.checkFeedback(inputValue);
      setFeedback({ ok: false, msg: fb.msg });
      setTimeout(() => setInputState(null), 400);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") checkAnswer();
  }

  function showHint() {
    if (hintsUsed >= 3) return;
    setHintsUsed((prev) => prev + 1);
    setHintVisible(true);
  }

  function handleNextRoom() {
    if (isLastRoom) {
      resetRoomState();
      setScreen(SCREEN.FINALE);
      spawnParticles(120);
      const interval = setInterval(() => spawnParticles(10), 800);
      setTimeout(() => clearInterval(interval), 8000);
    } else {
      resetRoomState();
      setCurrentRoom((prev) => prev + 1);
    }
  }

  return (
    <div className="fer-root">
      <canvas ref={canvasRef} className="fer-canvas" />

      {/* ══ INTRO ══ */}
      {screen === SCREEN.INTRO && (
        <div className="fer-intro">
          <div className="fer-intro-logo">
            SURVIVE
            <br />
            .XLS
          </div>
          <div className="fer-intro-sub">
            Tag 7 // Zombie-Apokalypse // Excel oder Tod
          </div>

          <div className="fer-story-box">
            <p>
              Die Welt ist gefallen. Ein Virus hat die Bevölkerung überrannt. Du
              hast dich mit einer kleinen Gruppe in einem verlassenen
              Bürogebäude verschanzt.
            </p>
            <p>
              Im Keller gibt es Vorräte, Medizin, Treibstoff – aber alle Türen
              sind elektronisch verriegelt. Das alte Zugangssystem läuft noch
              auf einem staubigen Laptop.
            </p>
            <p>
              <span className="fer-highlight">
                Das System akzeptiert nur korrekte Excel-Formeln.
              </span>{" "}
              Keine Formel, keine Tür. Keine Tür, kein Überleben.
            </p>
            <p>
              Du hast <span className="fer-highlight">4 Sicherheitszonen</span>{" "}
              zu überwinden. Pro Zone stehen dir{" "}
              <span className="fer-highlight">3 Hinweise</span> zur Verfügung.
              Die Zombies werden nicht warten.
            </p>
          </div>

          <div className="fer-rooms-preview">
            <div className="fer-room-chip unlocked">
              ZONE 1<span>Vorratslager</span>
            </div>
            <div className="fer-room-chip">
              ZONE 2<span>Medizinraum</span>
            </div>
            <div className="fer-room-chip">
              ZONE 3<span>Funkraum</span>
            </div>
            <div className="fer-room-chip">
              ZONE 4<span>Bunker</span>
            </div>
          </div>

          <button className="fer-btn-start" onClick={startGame}>
            ▶ ÜBERLEBEN
          </button>
        </div>
      )}

      {/* ══ GAME ══ */}
      {screen === SCREEN.GAME && (
        <div className="fer-game">
          {/* Header */}
          <div className="fer-game-header">
            <div className="fer-room-title">{room.title}</div>
            <div className="fer-progress-dots">
              {ROOMS.map((_, i) => {
                const cls =
                  i < currentRoom
                    ? "fer-dot done"
                    : i === currentRoom
                      ? "fer-dot current"
                      : "fer-dot";
                return <div key={i} className={cls} />;
              })}
            </div>
            <button
              className={`fer-hints-btn${hintsUsed >= 3 ? " exhausted" : ""}`}
              onClick={showHint}
            >
              💡 HINWEIS ({3 - hintsUsed})
            </button>
          </div>

          {/* Room content */}
          <div className="fer-room-container">
            {/* Story */}
            <div
              className="fer-story-panel"
              dangerouslySetInnerHTML={{ __html: room.story }}
            />

            {/* Spreadsheet */}
            <div className="fer-spreadsheet-wrapper">
              <div className="fer-formula-bar">
                <span className="fer-cell-ref">{room.inputCell.ref}</span>
                <span className="fer-formula-bar-sep">│</span>
                <span className="fer-formula-display">{inputValue}</span>
              </div>
              <Sheet
                room={room}
                inputValue={inputValue}
                inputState={inputState}
                onInputChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Task */}
            <div className="fer-task-panel">
              <div
                className="fer-task-text"
                dangerouslySetInnerHTML={{ __html: room.taskText }}
              />
              <button className="fer-btn-check" onClick={checkAnswer}>
                PRÜFEN →
              </button>
              {feedback && (
                <div className={`fer-feedback ${feedback.ok ? "ok" : "err"}`}>
                  {feedback.msg}
                </div>
              )}
              {hintVisible && (
                <div className="fer-hint-box visible">{room.hint}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ SUCCESS OVERLAY ══ */}
      {screen === SCREEN.GAME && (
        <div
          className={`fer-success-overlay${successVisible ? " visible" : ""}`}
        >
          <div className="fer-success-box">
            <div className="fer-success-icon">🔓</div>
            <div className="fer-success-title">{room.successTitle}</div>
            <div className="fer-success-msg">{room.successMsg}</div>
            <button className="fer-btn-next" onClick={handleNextRoom}>
              {isLastRoom ? "🏆 ABSCHLUSS →" : "NÄCHSTER RAUM →"}
            </button>
          </div>
        </div>
      )}

      {/* ══ FINALE ══ */}
      {screen === SCREEN.FINALE && (
        <div className="fer-finale">
          <div className="fer-finale-title">ÜBERLEBT!</div>
          <div className="fer-finale-sub">ALLE SICHERHEITSZONEN GEKNACKT</div>
          <div className="fer-finale-summary">
            <div className="fer-summary-item">
              ✅ Zone 1 — <span>Grundrechenarten</span>
            </div>
            <div className="fer-summary-item">
              ✅ Zone 2 — <span>Zellbezüge &amp; Kopieren</span>
            </div>
            <div className="fer-summary-item">
              ✅ Zone 3 — <span>Funktionen: SUMME &amp; MITTELWERT</span>
            </div>
            <div className="fer-summary-item">
              ✅ Zone 4 — <span>Absolute Bezüge mit $</span>
            </div>
          </div>
          <div className="fer-password-block">
            <div className="fer-password-label">Zugangscode freigeschaltet</div>
            <div className="fer-password-value">563-HPD</div>
            <div className="fer-password-hint">
              // Bewahre diesen Code gut auf
            </div>
          </div>
          <button className="fer-btn-restart" onClick={restartGame}>
            ↩ NOCHMALS SPIELEN
          </button>
        </div>
      )}
    </div>
  );
}
