import { useState, useEffect, useCallback } from "react";
import botyImg from "../../assets/boty.png";
import botyChatImg from "../../assets/boty-chat.png";
import useEmbedResize from "../../useEmbedResize.js";
import "./Zellenbezuege.css";

/* ═══════════════════════════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: 0,
    chat: `Willkommen zur nächsten Lektion! Ihr wisst bereits, dass man in Excel rechnen kann – zum Beispiel mit <code>=5*5</code>. Heute gehen wir einen Schritt weiter: Wir rechnen nicht mehr mit fixen Zahlen, sondern direkt mit <strong>Zellen</strong>. Und wir schauen, was <strong>relative</strong> und <strong>absolute</strong> Zellenbezüge bedeuten.`,
  },
  {
    id: 1,
    chat: `Zur Erinnerung: Ihr könnt in eine Zelle schreiben <code>=5*5</code> und Excel rechnet das sofort aus. Das ist wie ein Taschenrechner – ihr tippt die Zahlen direkt in die Formel. Das kennt ihr bereits.`,
  },
  {
    id: 2,
    chat: `Neu ist jetzt das: Statt <code>=5*5</code> schreibt ihr <code>=B1*B2</code>. Ihr gebt keine Zahlen ein, sondern <strong>Zelladressen</strong>. Excel schaut dann in Zelle B1, holt sich den Wert – und macht dasselbe mit B2. Das Ergebnis ist dasselbe, solange in B1 und B2 eine 5 steht.`,
  },
  {
    id: 3,
    chat: `Und jetzt kommt der entscheidende Vorteil: Wenn ihr in B1 die Zahl änderst – zum Beispiel von 5 auf 8 – dann aktualisiert Excel das Ergebnis in B3 <strong>automatisch</strong>. Ihr müsst die Formel nicht anfassen. Das ist der Grund, warum man mit Zellenbezügen arbeitet.`,
  },
  {
    id: 4,
    chat: `Dieses Verhalten hat einen Namen: <strong>relativer Zellenbezug</strong>. Der Bezug ist relativ zur Position der Formel. Wenn ihr die Formel eine Zeile tiefer kopiert, passt Excel die Zeilennummer automatisch an. Aus <code>=B2*B1</code> wird dann <code>=B3*B2</code> – und so weiter.`,
  },
  {
    id: 5,
    chat: `Hier seht ihr das in Aktion. Eine Liste mit Ferienausgaben aus Italien. In Spalte C steht die Formel <code>=B1*2</code> – einmal eingegeben und nach unten kopiert. Excel hat die Zeilennummer bei jeder Zeile automatisch angepasst. <em>Die Formel wandert mit – das ist relativer Bezug.</em>`,
  },
  {
    id: 6,
    chat: `Jetzt kommt ein konkretes Szenario. Ihr wart in den Ferien in Florenz – Italien. Ihr habt Eis, Pizza, ein Museumsticket und ein Souvenir gekauft, alles in Euro. Jetzt wollt ihr wissen, was das in Schweizer Franken gekostet hat. Der Wechselkurs steht einmal oben in der Tabelle.`,
  },
  {
    id: 7,
    chat: `Hier kommt das Problem. Ihr schreibt die Formel <code>=B3*C1</code> und kopiert sie nach unten. Aber Excel passt auch C1 an – auf C2, C3 … und dort steht gar kein Wechselkurs. <em>Das Ergebnis ist falsch.</em>`,
  },
  {
    id: 8,
    chat: `Die Lösung: <strong>absoluter Zellenbezug</strong>. Ihr schreibt <code>$C$1</code> statt <code>C1</code>. Das <strong>$</strong>-Zeichen sagt Excel: <em>„Diese Zelle soll sich beim Kopieren nicht verändern."</em> Egal wohin ihr die Formel kopiert – sie zeigt immer auf den Wechselkurs in C1.`,
  },
  {
    id: 9,
    chat: `Hier sieht man das Ergebnis. B3 wandert mit – auf B4, B5 – das ist der EUR-Betrag der jeweiligen Ausgabe. Aber <strong>$C$1</strong> bleibt bei jeder Zeile exakt gleich. <em>Genau das wollten wir.</em>`,
  },
  {
    id: 10,
    chat: `Kurz zusammengefasst: <strong>Relativ</strong> – der Bezug passt sich beim Kopieren an. Gut für Werte, die pro Zeile unterschiedlich sind. <strong>Absolut</strong> – der Bezug bleibt immer gleich. Gut für fixe Werte wie Wechselkurse, die für alle Zeilen gleich sind.`,
  },
  {
    id: 11,
    chat: `Jetzt bist du dran! Schau dir die Frage an und wähle die richtige Formel. Du kannst die Antworten anklicken – und Boty sagt dir, ob du richtig liegst. 🎯`,
  },
  {
    id: 12,
    chat: `Super gemacht! Das war die Lektion zu Zellenbezügen. Du weisst jetzt den Unterschied zwischen relativ und absolut – und wann du das <strong>$</strong>-Zeichen einsetzen musst. 🎓`,
  },
];

const TOTAL = SLIDES.length;

/* ═══════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* 0 – Title */
function Slide0() {
  return (
    <div className="zb-vis-inner zb-vis-title">
      <img
        src={botyImg}
        alt="Boty"
        className="zb-big-emoji"
        style={{
          width: "360px",
          height: "360px",
          objectFit: "contain",
          borderRadius: "16px",
          filter:
            "drop-shadow(0px 12px 16px rgba(0,0,0,0.15)) drop-shadow(0px 4px 6px rgba(0,0,0,0.09))",
          animation: "zb-boty-float 3.5s ease-in-out infinite",
        }}
      />
      <h1>
        Rechnen mit
        <br />
        <span>Zellenbezügen</span>
      </h1>
      <p className="zb-sub">Relativ &amp; Absolut – was steckt dahinter?</p>
    </div>
  );
}

/* 1 – Rückblick =5*5 */
function Slide1() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">Das kennt ihr schon</div>
      <div className="zb-xl-wrap">
        <div className="zb-xl-bar">
          <span className="zb-cell-ref">B3</span>
          <span className="zb-fx">fx</span>
          <span className="zb-fd zb-fd-blue">=5*5</span>
        </div>
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td></td>
              <td className="zb-formula-cell">=5*5</td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-result-note">
        <span>Excel rechnet:</span>
        <span className="zb-result-value">= 25</span>
      </div>
    </div>
  );
}

/* 2 – Neu =B1*B2 */
function Slide2() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">Neu: Rechnen mit Zellen</div>
      <div className="zb-xl-wrap">
        <div className="zb-xl-bar">
          <span className="zb-cell-ref">B3</span>
          <span className="zb-fx">fx</span>
          <span className="zb-fd zb-fd-blue">=B1*B2</span>
        </div>
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td></td>
              <td className="zb-active-cell">5</td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td></td>
              <td className="zb-active-cell">5</td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td></td>
              <td className="zb-formula-cell">=B1*B2</td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-result-note">
        <span>Excel liest B1 und B2 und rechnet:</span>
        <span className="zb-result-value">= 25</span>
      </div>
    </div>
  );
}

/* 3 – Vorteil automatisches Update */
function Slide3() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">Der entscheidende Vorteil</div>
      <div className="zb-xl-wrap">
        <div className="zb-xl-bar">
          <span className="zb-cell-ref">B3</span>
          <span className="zb-fx">fx</span>
          <span className="zb-fd zb-fd-blue">=B1*B2</span>
        </div>
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td></td>
              <td
                className="zb-active-cell"
                style={{ color: "var(--abs)", fontWeight: 700 }}
              >
                8
              </td>
              <td
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  textAlign: "left",
                  paddingLeft: "10px",
                }}
              >
                ← Wert geändert!
              </td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td></td>
              <td className="zb-active-cell">5</td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td></td>
              <td className="zb-formula-cell">=B1*B2</td>
              <td
                style={{
                  fontSize: "0.75rem",
                  color: "var(--result)",
                  fontWeight: 600,
                  textAlign: "left",
                  paddingLeft: "10px",
                }}
              >
                → Ergebnis: 40 ✓
              </td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-info-note">
        B1 geändert von 5 auf 8 → B3 aktualisiert sich{" "}
        <strong>automatisch</strong>.
      </div>
    </div>
  );
}

/* 4 – Relativer Begriff */
function Slide4() {
  return (
    <div className="zb-vis-inner" style={{ textAlign: "center", gap: "16px" }}>
      <div className="zb-vis-label" style={{ alignSelf: "center" }}>
        Relativer Zellenbezug
      </div>
      <div className="zb-formula-box" style={{ textAlign: "center" }}>
        <div className="zb-formula-big" style={{ color: "var(--col-b)" }}>
          =B2*B1
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--muted)",
            lineHeight: 1.6,
            maxWidth: "340px",
            margin: "0 auto",
          }}
        >
          Der Bezug ist <strong>relativ</strong> zur aktuellen Position.
          <br />
          Beim Kopieren passt Excel den Bezug <strong>automatisch an</strong>.
        </div>
      </div>
      <div className="zb-relative-note">
        <span>Eine Zeile tiefer kopiert →</span>
        <span className="code">=B3*B2</span>
      </div>
    </div>
  );
}

/* 5 – Relativ in Aktion – Ferienausgaben */
function Slide5() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">
        Relativer Bezug – Ferienausgaben in EUR
      </div>
      <div className="zb-xl-wrap">
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A (Ausgabe)</th>
              <th>B (EUR)</th>
              <th>C (×2)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td>Eis 🍦</td>
              <td>3.50</td>
              <td
                className="zb-formula-cell"
                style={{
                  borderColor: "var(--primary)",
                  background: "var(--primary-lt)",
                }}
              >
                =B1*2
              </td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td>Pizza 🍕</td>
              <td>12.00</td>
              <td className="zb-formula-cell">=B2*2</td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td>Museum 🏛️</td>
              <td>8.00</td>
              <td className="zb-formula-cell">=B3*2</td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td>Souvenir 🎁</td>
              <td>15.00</td>
              <td className="zb-formula-cell">=B4*2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-info-note">
        Formel in C1 eingegeben → nach unten kopiert.
        <br />
        Excel passt die <strong>Zeilennummer</strong> automatisch an.
      </div>
    </div>
  );
}

/* 6 – Szenario Wechselkurs Einführung */
function Slide6() {
  return (
    <div className="zb-vis-inner" style={{ textAlign: "center", gap: "16px" }}>
      <div className="zb-vis-label" style={{ alignSelf: "center" }}>
        Szenario: Ferien in Italien 🇮🇹
      </div>
      <div className="zb-scenario-card">
        <span className="zb-sc-emoji">🛍️</span>
        <div className="zb-sc-title">Du warst in Florenz</div>
        <div className="zb-sc-body">
          Du hast Eis, Pizza, ein Museumsticket und ein Souvenir gekauft – alles
          in <strong>Euro</strong>.<br />
          <br />
          Jetzt willst du wissen, was das in <strong>
            Schweizer Franken
          </strong>{" "}
          gekostet hat.
          <br />
          <br />
          Der Wechselkurs steht <strong>einmal</strong> in deiner Tabelle.
        </div>
      </div>
    </div>
  );
}

/* 7 – Problem: Wechselkurs wandert mit */
function Slide7() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">
        Problem: Wechselkurs wandert beim Kopieren mit
      </div>
      <div className="zb-xl-wrap">
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B (EUR)</th>
              <th>C</th>
              <th>D (CHF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td
                style={{
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                Kurs:
              </td>
              <td></td>
              <td
                className="zb-active-cell"
                style={{ fontWeight: 700, color: "var(--abs)" }}
              >
                0.96
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                Ausgabe
              </td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                EUR
              </td>
              <td></td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                CHF
              </td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td>Eis 🍦</td>
              <td>3.50</td>
              <td></td>
              <td className="zb-formula-cell">=B3*C1</td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td>Pizza 🍕</td>
              <td>12.00</td>
              <td></td>
              <td className="zb-err-cell">=B4*C2 ✗</td>
            </tr>
            <tr>
              <td className="zb-row-num">5</td>
              <td>Museum 🏛️</td>
              <td>8.00</td>
              <td></td>
              <td className="zb-err-cell">=B5*C3 ✗</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-err-note">
        ⚠️ C1 wandert mit → C2, C3 … aber dort steht kein Wechselkurs!
      </div>
    </div>
  );
}

/* 8 – Lösung $C$1 */
function Slide8() {
  return (
    <div className="zb-vis-inner" style={{ gap: "16px", textAlign: "center" }}>
      <div className="zb-vis-label" style={{ alignSelf: "center" }}>
        Lösung: Absoluter Zellenbezug
      </div>
      <div className="zb-formula-box">
        <div className="zb-formula-big" style={{ color: "var(--abs)" }}>
          =B3*$C$1
        </div>
        <div className="zb-formula-parts">
          <div className="zb-fp">
            <div className="zb-fp-val blue">B3</div>
            <div className="zb-fp-lbl">wandert mit</div>
          </div>
          <div className="zb-fp">
            <div className="zb-fp-op">×</div>
          </div>
          <div className="zb-fp">
            <div className="zb-fp-val abs">$C$1</div>
            <div className="zb-fp-lbl">bleibt fixiert</div>
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: "0.82rem",
          color: "var(--muted)",
          maxWidth: "360px",
          lineHeight: 1.6,
        }}
      >
        Das <strong style={{ color: "var(--abs)" }}>$</strong>-Zeichen sagt
        Excel:
        <br />
        <em>
          „Diese Zelle soll sich beim Kopieren <strong>nicht</strong>{" "}
          verändern."
        </em>
      </div>
    </div>
  );
}

/* 9 – Absolut in Aktion */
function Slide9() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-vis-label">
        Absoluter Bezug – $C$1 bleibt immer fixiert
      </div>
      <div className="zb-xl-wrap">
        <table className="zb-xl-table">
          <thead>
            <tr>
              <th></th>
              <th>A</th>
              <th>B (EUR)</th>
              <th>C</th>
              <th>D (CHF)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="zb-row-num">1</td>
              <td
                style={{
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                Kurs:
              </td>
              <td></td>
              <td
                className="zb-active-cell"
                style={{ fontWeight: 700, color: "var(--abs)" }}
              >
                0.96
              </td>
              <td></td>
            </tr>
            <tr>
              <td className="zb-row-num">2</td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                Ausgabe
              </td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                EUR
              </td>
              <td></td>
              <td style={{ color: "var(--muted)", fontSize: "0.78rem" }}>
                CHF
              </td>
            </tr>
            <tr>
              <td className="zb-row-num">3</td>
              <td>Eis 🍦</td>
              <td>3.50</td>
              <td></td>
              <td className="zb-formula-abs">=B3*$C$1</td>
            </tr>
            <tr>
              <td className="zb-row-num">4</td>
              <td>Pizza 🍕</td>
              <td>12.00</td>
              <td></td>
              <td className="zb-formula-abs">=B4*$C$1</td>
            </tr>
            <tr>
              <td className="zb-row-num">5</td>
              <td>Museum 🏛️</td>
              <td>8.00</td>
              <td></td>
              <td className="zb-formula-abs">=B5*$C$1</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="zb-info-note">
        B3→B4→B5 wandert mit ✓ &nbsp;·&nbsp;{" "}
        <strong className="abs">$C$1</strong> bleibt bei jeder Zeile gleich ✓
      </div>
    </div>
  );
}

/* 10 – Vergleich Cards */
function Slide10() {
  return (
    <div className="zb-vis-inner">
      <div className="zb-compare-grid">
        <div className="zb-compare-box">
          <span className="zb-cb-emoji">🔄</span>
          <h3>Relativ</h3>
          <p>
            Bezug wandert beim Kopieren mit.
            <br />
            Schreibweise: <code>=B3*2</code>
          </p>
        </div>
        <div className="zb-compare-box">
          <span className="zb-cb-emoji">📌</span>
          <h3>Absolut</h3>
          <p>
            Bezug bleibt immer gleich.
            <br />
            Schreibweise: <code>=B3*$C$1</code>
          </p>
        </div>
      </div>
    </div>
  );
}

/* 11 – Interactive Quiz */
const QUIZ_OPTIONS = [
  { label: "A", text: "=B3*C1", correct: false },
  { label: "B", text: "=B3*$C$1", correct: true },
  { label: "C", text: "=$B$3*$C$1", correct: false },
  { label: "D", text: "=$B3*C1", correct: false },
];

function Slide11() {
  const [answered, setAnswered] = useState(null); // null | "correct" | "wrong"
  const [picked, setPicked] = useState(null); // index of clicked option

  function handleAnswer(idx, isCorrect) {
    if (answered !== null) return;
    setPicked(idx);
    setAnswered(isCorrect ? "correct" : "wrong");
  }

  function reset() {
    setAnswered(null);
    setPicked(null);
  }

  const correctIdx = QUIZ_OPTIONS.findIndex((o) => o.correct);

  return (
    <div className="zb-vis-inner zb-quiz-slide">
      {/* LEFT – Table */}
      <div className="zb-quiz-col">
        <div className="zb-quiz-heading">Ausgangslage</div>
        <div className="zb-xl-wrap" style={{ maxWidth: "100%" }}>
          <table className="zb-xl-table">
            <thead>
              <tr>
                <th></th>
                <th>A</th>
                <th>B</th>
                <th>C</th>
                <th>D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="zb-row-num">1</td>
                <td
                  style={{
                    fontSize: "0.76rem",
                    color: "var(--muted)",
                    fontWeight: 600,
                  }}
                >
                  Kurs EUR→CHF:
                </td>
                <td></td>
                <td
                  className="zb-active-cell"
                  style={{ color: "var(--abs)", fontWeight: 700 }}
                >
                  0.96
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="zb-row-num">2</td>
                <td style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  Ausgabe
                </td>
                <td style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  EUR
                </td>
                <td></td>
                <td style={{ fontSize: "0.74rem", color: "var(--muted)" }}>
                  CHF
                </td>
              </tr>
              <tr>
                <td className="zb-row-num">3</td>
                <td>Eis 🍦</td>
                <td>3.50</td>
                <td></td>
                <td className="zb-quiz-target-cell">= ?</td>
              </tr>
              <tr>
                <td className="zb-row-num">4</td>
                <td>Pizza 🍕</td>
                <td>12.00</td>
                <td></td>
                <td className="zb-quiz-copied-cell">↓ kopiert</td>
              </tr>
              <tr>
                <td className="zb-row-num">5</td>
                <td>Museum 🏛️</td>
                <td>8.00</td>
                <td></td>
                <td className="zb-quiz-copied-cell">↓ kopiert</td>
              </tr>
              <tr>
                <td className="zb-row-num">6</td>
                <td>Souvenir 🎁</td>
                <td>15.00</td>
                <td></td>
                <td className="zb-quiz-copied-cell">↓ kopiert</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="zb-quiz-table-note">
          Formel in <strong>D3</strong> eingeben → nach{" "}
          <strong>D4, D5, D6</strong> kopieren.
          <br />
          Kurs steht in <strong className="abs">C1</strong> und soll immer
          gleich bleiben.
        </div>
      </div>

      {/* RIGHT – Quiz */}
      <div className="zb-quiz-col">
        <div className="zb-quiz-heading">🎯 Welche Formel kommt in D3?</div>
        <div className="zb-quiz-options">
          {QUIZ_OPTIONS.map((opt, idx) => {
            let cls = "zb-quiz-option";
            if (answered !== null) {
              if (idx === correctIdx) cls += " correct";
              else if (idx === picked && !opt.correct) cls += " wrong";
            }
            const badgeText =
              answered !== null && idx === correctIdx
                ? "✓"
                : answered !== null && idx === picked && !opt.correct
                  ? "✗"
                  : opt.label;

            return (
              <button
                key={opt.label}
                className={cls}
                disabled={answered !== null}
                onClick={() => handleAnswer(idx, opt.correct)}
              >
                <span className="zb-quiz-badge">{badgeText}</span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {answered === "correct" && (
          <div className="zb-quiz-feedback ok">
            ✅ <strong>Richtig!</strong> <code>=B3*$C$1</code> – B3 wandert beim
            Kopieren mit (relativ), $C$1 bleibt immer fixiert (absolut).
          </div>
        )}
        {answered === "wrong" && (
          <div className="zb-quiz-feedback ko">
            ❌ <strong>Nicht ganz.</strong> B3 soll sich anpassen (relativ),
            aber C1 muss fixiert bleiben → <code>$C$1</code>.
          </div>
        )}

        {answered !== null && (
          <button className="zb-quiz-reset" onClick={reset}>
            ↺ Nochmal versuchen
          </button>
        )}
      </div>
    </div>
  );
}

/* 12 – Ende */
function Slide12() {
  return (
    <div className="zb-vis-inner" style={{ alignItems: "center" }}>
      <div className="zb-end-card">
        <span className="zb-end-emoji">🎓</span>
        <div className="zb-end-tag">Ende der Lektion</div>
        <h2>Das hast du heute gelernt</h2>
        <div className="zb-end-rows">
          <div className="zb-end-row">
            <span className="zb-er-icon">🔗</span>
            <div>
              <div className="zb-er-title">Zellenbezug</div>
              <div className="zb-er-sub">
                Formel verweist auf Zellen: <code>=B1*B2</code>
              </div>
            </div>
          </div>
          <div className="zb-end-row">
            <span className="zb-er-icon">🔄</span>
            <div>
              <div className="zb-er-title">Relativ</div>
              <div className="zb-er-sub">
                Wandert beim Kopieren: <code>=B3*2</code>
              </div>
            </div>
          </div>
          <div className="zb-end-row">
            <span className="zb-er-icon">📌</span>
            <div>
              <div className="zb-er-title">Absolut</div>
              <div className="zb-er-sub">
                Bleibt fixiert: <code>=B3*$C$1</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VISUALS = [
  Slide0,
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Zellenbezuege() {
  // eslint-disable-next-line no-unused-vars
  const isEmbed = useEmbedResize();
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((n) => {
    const next = Math.max(0, Math.min(n, TOTAL - 1));
    setCurrent(next);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.target.tagName === "SELECT" || e.target.tagName === "BUTTON")
        return;
      if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        goTo(current + 1);
      }
      if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        goTo(current - 1);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, goTo]);

  const progressPct = ((current + 1) / TOTAL) * 100;

  return (
    <div className="zb-root">
      {/* ── TOPBAR ── */}
      <div className="zb-topbar">
        <div className="zb-brand">
          <div className="zb-brand-dot" />
          <div>
            <div className="zb-brand-title">Zellenbezüge in Excel</div>
            <div className="zb-brand-sub">Relativ &amp; Absolut</div>
          </div>
        </div>

        <div className="zb-progress-wrap">
          <div
            className="zb-progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="zb-topbar-right">
          <span className="zb-slide-counter">
            {current + 1} / {TOTAL}
          </span>
          <button
            className="zb-btn"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ← Zurück
          </button>
          <button
            className="zb-btn"
            onClick={() => goTo(current + 1)}
            disabled={current === TOTAL - 1}
          >
            Weiter →
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="zb-main">
        {/* Chat panel */}
        <div className="zb-chat-panel">
          <div className="zb-chat-label">
            <img
              src={botyChatImg}
              alt="Boty"
              style={{
                width: "18px",
                height: "18px",
                objectFit: "cover",
                borderRadius: "50%",
                verticalAlign: "middle",
                marginRight: "6px",
              }}
            />
            Boty
          </div>
          <div className="zb-chat-area">
            <div className="zb-chat-bubble-wrap">
              <div className="zb-robot-avatar">
                <img
                  src={botyChatImg}
                  alt="Boty"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <div className="zb-bubble">
                <div className="zb-bubble-sender">Boty · Excel</div>
                <div
                  key={current}
                  className="zb-bubble-text"
                  dangerouslySetInnerHTML={{ __html: SLIDES[current].chat }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual panel */}
        <div className="zb-visual-panel">
          {VISUALS.map((Visual, idx) => (
            <div
              key={idx}
              className={`zb-slide${idx === current ? " active" : ""}`}
            >
              {idx === current && <Visual />}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOMBAR ── */}
      <div className="zb-bottombar">
        <div className="zb-key-hint">
          <kbd className="zb-kbd">←</kbd>
          <kbd className="zb-kbd">→</kbd>
          navigieren &nbsp;·&nbsp;
          <kbd className="zb-kbd">Space</kbd> weiter
        </div>
      </div>
    </div>
  );
}
