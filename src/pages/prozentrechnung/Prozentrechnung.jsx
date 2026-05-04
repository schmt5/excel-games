import { useState, useEffect, useCallback } from "react";
import botyImg from "../../assets/boty.png";
import botyChatImg from "../../assets/boty-chat.png";
import useEmbedResize from "../../useEmbedResize.js";
import "./Prozentrechnung.css";

/* ═══════════════════════════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: 0,
    chat: `Willkommen zur Lektion <strong>Prozentrechnung</strong>! Heute lernen wir, was Prozent eigentlich bedeutet – und wie man damit in Excel arbeitet. Los geht's! 🎯`,
  },
  {
    id: 1,
    chat: `Prozent kommt von <strong>«pro cento»</strong> und heisst <strong>«von hundert»</strong>. Wenn wir <code>25%</code> sagen, meinen wir also: 25 von 100. Wichtig: Eine Zahl wie <code>0.25</code> und <code>25%</code> sind genau dasselbe!`,
  },
  {
    id: 2,
    chat: `Stell dir eine Schokoladentafel mit <strong>50 Stücken</strong> vor. Du hast 20 Stücke gegessen – es sind also noch <strong>30 übrig</strong>. Das heisst: <code>30 von 50 = 60%</code> sind noch da. 🍫`,
  },
  {
    id: 3,
    chat: `Gut, jetzt wisst ihr was Prozent bedeutet. Als Nächstes schauen wir uns an, wie man mit Prozent <strong>rechnet</strong> – und worauf man dabei achten muss. 💪`,
  },
  {
    id: 4,
    chat: `Wichtig, bevor du rechnest: Du musst ein <strong>Gefühl</strong> dafür entwickeln, was rauskommen muss. Erst schätzen, dann rechnen, dann überprüfen. So vermeidest du Fehler! 🧠`,
  },
  {
    id: 5,
    chat: `<strong>Regel 1:</strong> Wenn du eine Zahl mit einer Zahl <strong>unter 1 multiplizierst</strong>, wird das Ergebnis <strong>kleiner</strong>. Logisch – du nimmst ja nur einen <em>Teil</em> davon. 📉`,
  },
  {
    id: 5,
    chat: `<strong>Regel 2:</strong> Wenn du eine Zahl durch eine Zahl <strong>unter 1 teilst</strong>, wird das Ergebnis <strong>grösser</strong>. Das fühlt sich vielleicht komisch an – aber es stimmt! 📈`,
  },
  {
    id: 6,
    chat: `Für manche fühlt sich das falsch an – <em>«geteilt müsste doch weniger werden!»</em> Das liegt daran, dass du in der Schule mit <strong>ganzen Zahlen</strong> gerechnet hast: <code>3×4=12</code>, <code>5×2=10</code>. Du hast dich auf dem Zahlenstrahl von 1–100 bewegt. Beim Prozentrechnen bewegst du dich zwischen <strong>0 und 1</strong>.`,
  },
  {
    id: 7,
    chat: `Jetzt wenden wir das Gelernte an <strong>konkreten Beispielen</strong> an – Schritt für Schritt. So siehst du, wie Prozentrechnen im Alltag funktioniert. 💡`,
  },
  {
    id: 8,
    chat: `Jetzt wenden wir das an einem <strong>konkreten Beispiel</strong> an. Eine Jacke kostet 400 CHF und ist 20% billiger. Was zahlst du? Denk zuerst nach, bevor du rechnest! 🧥`,
  },
  {
    id: 8,
    chat: `<strong>Schritt 1:</strong> Was weiss ich? Die Jacke kostet 400 CHF. 20% billiger heisst: ich zahle nicht mehr 100%, sondern nur noch <code>80%</code> = <code>0.8</code>. <strong>Schritt 2:</strong> Was muss rauskommen? Weniger als 400 – die Jacke wird ja <em>billiger</em>.`,
  },
  {
    id: 9,
    chat: `<strong>Schritt 3:</strong> Mal oder geteilt? Wir brauchen ein Ergebnis <em>kleiner</em> als 400. Also: <code>400 · 0.8</code>. <strong>Schritt 4:</strong> Rechnen – und das Ergebnis ist <code>320 CHF</code>. Passt! ✅`,
  },
  {
    id: 10,
    chat: `Jetzt drehen wir die Aufgabe um. Deine Kollegin sagt: <em>«Ich habe eine Jacke für 320 CHF gekauft – eigentlich wäre sie 400 CHF gewesen.»</em> Du fragst dich: <strong>Wie viel Prozent</strong> hat sie bezahlt? 🤔`,
  },
  {
    id: 11,
    chat: `Zuerst schätzen! <code>100%</code> wären 400 CHF, <code>50%</code> wären 200 CHF. Sie hat 320 CHF bezahlt – das liegt <strong>zwischen 50% und 100%</strong>. Damit wissen wir schon: die Antwort muss irgendwo dazwischen liegen. 🎯`,
  },
  {
    id: 12,
    chat: `Jetzt rechnen: <code>320 ÷ 400 = 0.8</code> = <code>80%</code>. Das liegt zwischen 50% und 100% – passt zu unserer Schätzung! Die andere Richtung <code>400 ÷ 320 = 1.25</code> = 125% wäre über 100% – das kann nicht stimmen. ✅`,
  },
  {
    id: 13,
    chat: `Super gemacht! Das war die Lektion zur <strong>Prozentrechnung</strong>. Du weisst jetzt, was Prozent bedeutet, wie du mit Zahlen unter 1 rechnest – und wie du Fehler vermeidest, indem du <strong>zuerst schätzt</strong>. 🎓`,
  },
];

const TOTAL = SLIDES.length;

/* ═══════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/* 0 – Title */
function Slide0() {
  return (
    <div className="pr-vis-inner pr-vis-title">
      <img
        src={botyImg}
        alt="Boty"
        className="pr-big-emoji"
        style={{
          width: "360px",
          height: "360px",
          objectFit: "contain",
          borderRadius: "16px",
          filter:
            "drop-shadow(0px 12px 16px rgba(0,0,0,0.15)) drop-shadow(0px 4px 6px rgba(0,0,0,0.09))",
          animation: "pr-boty-float 3.5s ease-in-out infinite",
        }}
      />
      <h1>
        Prozent&shy;rechnung
        <br />
        <span>in Excel</span>
      </h1>
      <p className="pr-sub">Was bedeutet % und wie rechnet man damit?</p>
    </div>
  );
}

/* 1 – Was bedeutet Prozent? */
function Slide1() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-formula-box" style={{ textAlign: "center" }}>
        <div
          className="pr-formula-big"
          style={{ color: "var(--primary)", fontSize: "3.5rem" }}
        >
          25% = 0.25
        </div>
      </div>
    </div>
  );
}

/* 2 – Schokolade 20×5 rotated */
function Slide2() {
  const eaten = 20;
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">🍫 20 von 50 Stücken gegessen</div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "3px",
          width: "min(160px, 40%)",
          margin: "0 auto",
          transform: "rotate(90deg)",
        }}
      >
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: "3px",
              background: i < eaten ? "#d4a574" : "#5c3317",
              opacity: i < eaten ? 0.35 : 1,
              border: "1px solid #4a2810",
              transition: "background 0.2s, opacity 0.2s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "16px",
          fontSize: "0.85rem",
          color: "var(--muted)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              background: "#d4a574",
              opacity: 0.35,
              border: "1px solid #4a2810",
            }}
          />
          gegessen (20)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              borderRadius: "3px",
              background: "#5c3317",
              border: "1px solid #4a2810",
            }}
          />
          übrig (30)
        </span>
      </div>

      <div
        className="pr-formula-box"
        style={{ textAlign: "center", marginTop: "16px" }}
      >
        <div
          className="pr-formula-big"
          style={{ color: "var(--primary)", fontSize: "1.6rem" }}
        >
          30 von 50 = 60% (übrig)
        </div>
      </div>
    </div>
  );
}

/* 3 – Mal oder Geteilt durch Zahl unter 1 */
function Slide3() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">So sollst du vorgehen:</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "min(420px, 100%)",
          margin: "0 auto",
        }}
      >
        {[
          {
            nr: "1",
            emoji: "🧐",
            text: "Überlegen, was etwa das Ergebnis sein soll",
          },
          { nr: "2", emoji: "🧩", text: "Rechnen" },
          {
            nr: "3",
            emoji: "✅",
            text: "Überprüfen, ob es mit deiner Schätzung übereinstimmt",
          },
        ].map((step) => (
          <div
            key={step.nr}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "18px 20px",
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>{step.emoji}</span>
            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  fontWeight: 600,
                  marginBottom: "2px",
                }}
              >
                Schritt {step.nr}
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 500 }}>
                {step.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 3b – Section: Jetzt wird gerechnet */
function SlideCalcIntro() {
  return (
    <div className="pr-vis-inner pr-vis-title">
      <span style={{ fontSize: "4rem", marginBottom: "32px" }}>🧮</span>
      <h1>
        Jetzt wird
        <br />
        <span>gerechnet</span>
      </h1>
      <p className="pr-sub">Wie rechnet man mit Prozent?</p>
    </div>
  );
}

/* 4 – Regel 1: Mal unter 1 → kleiner */
function Slide4() {
  const examples = [
    { start: 300, factor: 0.6, result: 180 },
    { start: 200, factor: 0.25, result: 50 },
  ];
  const maxVal = 300;

  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">Regel 1</div>

      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          padding: "20px 24px",
          width: "min(460px, 100%)",
          margin: "0 auto 20px",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          textAlign: "left",
        }}
      >
        Wenn du eine Zahl <strong>mal eine Zahl unter 1</strong> rechnest, wird
        das Ergebnis <strong>kleiner</strong>.
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          width: "min(460px, 100%)",
          margin: "0 auto",
        }}
      >
        {examples.map((ex, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "14px",
                color: "var(--text)",
              }}
            >
              {ex.start} · {ex.factor} = {ex.result}
            </div>
            {/* Start bar */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  marginBottom: "3px",
                }}
              >
                {ex.start}
              </div>
              <div
                style={{
                  height: "18px",
                  width: `${(ex.start / maxVal) * 100}%`,
                  background: "var(--primary-md)",
                  borderRadius: "4px",
                }}
              />
            </div>
            {/* Result bar */}
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--primary-dk)",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                {ex.result} ← kleiner ✓
              </div>
              <div
                style={{
                  height: "18px",
                  width: `${(ex.result / maxVal) * 100}%`,
                  background: "var(--primary)",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 5 – Regel 2: Geteilt unter 1 → grösser */
function Slide5() {
  const examples = [
    { start: 180, divisor: 0.6, result: 300 },
    { start: 45, divisor: 0.15, result: 300 },
  ];
  const maxVal = 300;

  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">Regel 2</div>

      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          padding: "20px 24px",
          width: "min(460px, 100%)",
          margin: "0 auto 20px",
          fontSize: "1.05rem",
          lineHeight: 1.6,
          textAlign: "left",
        }}
      >
        Wenn du eine Zahl <strong>durch eine Zahl unter 1 teilst</strong>, wird
        das Ergebnis <strong>grösser</strong>.
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          width: "min(460px, 100%)",
          margin: "0 auto",
        }}
      >
        {examples.map((ex, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--surface)",
              border: "1.5px solid var(--border)",
              borderRadius: "12px",
              padding: "20px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontFamily: "'Courier New', monospace",
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "14px",
                color: "var(--text)",
              }}
            >
              {ex.start} ÷ {ex.divisor} = {ex.result}
            </div>
            {/* Start bar */}
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--muted)",
                  marginBottom: "3px",
                }}
              >
                {ex.start}
              </div>
              <div
                style={{
                  height: "18px",
                  width: `${(ex.start / maxVal) * 100}%`,
                  background: "var(--primary-md)",
                  borderRadius: "4px",
                }}
              />
            </div>
            {/* Result bar */}
            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "var(--primary-dk)",
                  fontWeight: 600,
                  marginBottom: "3px",
                }}
              >
                {ex.result} ← grösser ✓
              </div>
              <div
                style={{
                  height: "18px",
                  width: `${(ex.result / maxVal) * 100}%`,
                  background: "var(--primary)",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 6 – Warum es sich falsch anfühlt – Zwei Zahlenwelten */
function Slide6() {
  const maxVal = 3;
  const ticks = [
    { val: 0, label: "0" },
    { val: 0.25, label: "0.25" },
    { val: 0.5, label: "0.5" },
    { val: 0.75, label: "0.75" },
    { val: 1, label: "1" },
    { val: 1.5, label: "1.5" },
    { val: 2, label: "2" },
    { val: 2.5, label: "2.5" },
    { val: 3, label: "3" },
  ];

  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">Zwei Zahlenwelten – ein Zahlenstrahl</div>

      <div
        style={{
          width: "min(680px, 95%)",
          margin: "0 auto",
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          padding: "28px 24px 20px",
        }}
      >
        {/* Labels above the line */}
        <div
          style={{
            display: "flex",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: `${(1 / maxVal) * 100}%`,
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
            }}
          >
            🌟 Prozent-Welt
          </div>
          <div
            style={{
              width: `${(2 / maxVal) * 100}%`,
              textAlign: "center",
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--muted)",
            }}
          >
            🏫 Ganze Zahlen
          </div>
        </div>

        {/* Number line */}
        <div style={{ position: "relative", height: "52px" }}>
          {/* Segment 0–1 (Prozent) */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: 0,
              width: `${(1 / maxVal) * 100}%`,
              height: "6px",
              background: "var(--primary)",
              borderRadius: "3px 0 0 3px",
            }}
          />
          {/* Segment 1–3 (Ganze Zahlen) */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              left: `${(1 / maxVal) * 100}%`,
              width: `${(2 / maxVal) * 100}%`,
              height: "6px",
              background: "var(--primary-md)",
              borderRadius: "0 3px 3px 0",
            }}
          />
          {/* Ticks */}
          {ticks.map((t) => {
            const inProzent = t.val <= 1;
            return (
              <div
                key={t.val}
                style={{
                  position: "absolute",
                  left: `${(t.val / maxVal) * 100}%`,
                  top: 0,
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: t.val === 1 ? "14px" : "10px",
                    height: t.val === 1 ? "14px" : "10px",
                    borderRadius: "50%",
                    background: inProzent
                      ? "var(--primary-dk)"
                      : "var(--primary)",
                    border:
                      t.val === 1 ? "2px solid var(--primary-dk)" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: t.val === 1 ? 800 : 600,
                    color: inProzent ? "var(--primary-dk)" : "var(--muted)",
                    marginTop: "4px",
                  }}
                >
                  {t.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Explanation below */}
        <div
          style={{
            display: "flex",
            marginTop: "16px",
            gap: "12px",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "14px",
              background: "var(--primary-lt)",
              border: "1.5px solid var(--primary)",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "var(--primary-dk)",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Hier bewegst du dich beim Prozentrechnen
          </div>
          <div
            style={{
              flex: 2,
              padding: "14px",
              background: "var(--bg)",
              border: "1.5px solid var(--border)",
              borderRadius: "10px",
              fontSize: "0.9rem",
              color: "var(--muted)",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            Das kennst du: 3×4=12, 5×2=10
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6b – Section: Prozentrechnen am Beispiel */
function SlideBeispielIntro() {
  return (
    <div className="pr-vis-inner pr-vis-title">
      <span style={{ fontSize: "4rem", marginBottom: "32px" }}>💡</span>
      <h1>
        Prozentrechnen
        <br />
        <span>am Beispiel</span>
      </h1>
      <p className="pr-sub">Schritt für Schritt durch die Aufgabe</p>
    </div>
  );
}

/* 7 – Jacke Szenario */
function Slide7() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">So denkst du dich durch eine Aufgabe</div>

      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "16px",
          padding: "48px 40px",
          width: "min(400px, 100%)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", display: "inline-block" }}>
          <span style={{ fontSize: "7rem" }}>🧥</span>
          <div
            style={{
              position: "absolute",
              top: "-4px",
              right: "-32px",
              padding: "4px 12px",
              background: "var(--err-lt)",
              border: "1.5px solid var(--err-border)",
              borderRadius: "14px",
              color: "var(--err)",
              fontWeight: 700,
              fontSize: "0.82rem",
              whiteSpace: "nowrap",
            }}
          >
            –20%
          </div>
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: "1.5rem",
            marginTop: "12px",
            color: "var(--text)",
          }}
        >
          400 CHF
        </div>
        <div
          style={{
            marginTop: "16px",
            fontSize: "1.1rem",
            color: "var(--muted)",
            fontWeight: 500,
          }}
        >
          Was zahlst du?
        </div>
      </div>
    </div>
  );
}

/* 8 – Jacke: Schritte 1 & 2 */
function Slide8() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">🧥 Jacke für 400 CHF – 20% Rabatt</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "min(440px, 100%)",
          margin: "0 auto",
        }}
      >
        {/* Step 1 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "8px",
            }}
          >
            🧐 Schritt 1: Was weiss ich?
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "18px",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              color: "var(--text)",
            }}
          >
            <li>
              Die Jacke kostet <strong>400 CHF</strong>.
            </li>
            <li>
              20% billiger heisst: ich zahle nicht mehr 100%, sondern nur noch{" "}
              <strong>80%</strong>.
            </li>
            <li>
              <span
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  color: "var(--primary-dk)",
                }}
              >
                80% = 0.8
              </span>
            </li>
          </ul>
        </div>

        {/* Step 2 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "8px",
            }}
          >
            🎯 Schritt 2: Was muss rauskommen?
          </div>
          <div style={{ fontSize: "0.92rem", lineHeight: 1.7 }}>
            Die Jacke wird <strong>billiger</strong> → das Ergebnis muss{" "}
            <strong>kleiner als 400</strong> sein.
          </div>
        </div>
      </div>
    </div>
  );
}

/* 9 – Jacke: Schritte 3 & 4 */
function Slide9() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">🧥 Jacke für 400 CHF – 20% Rabatt</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "min(440px, 100%)",
          margin: "0 auto",
        }}
      >
        {/* Step 3 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "12px",
            }}
          >
            ⚖️ Schritt 3: Mal oder geteilt?
          </div>

          {/* Wrong option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              background: "var(--err-lt)",
              border: "1.5px solid var(--err-border)",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--err)",
                fontSize: "1.1rem",
              }}
            >
              ✗
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--err)",
                }}
              >
                400 ÷ 0.8 = 500
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                grösser als 400 → falsch!
              </div>
            </div>
          </div>

          {/* Right option */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              background: "var(--primary-lt)",
              border: "1.5px solid var(--primary)",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--primary-dk)",
                fontSize: "1.1rem",
              }}
            >
              ✓
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--primary-dk)",
                }}
              >
                400 · 0.8 = 320
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                kleiner als 400 → richtig!
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 – Result */}
        <div
          style={{
            background: "var(--primary-lt)",
            border: "1.5px solid var(--primary)",
            borderRadius: "12px",
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "8px",
            }}
          >
            ✅ Schritt 4: Rechnen
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: "1.6rem",
              color: "var(--primary-dk)",
            }}
          >
            400 · 0.8 = 320 CHF
          </div>
        </div>
      </div>
    </div>
  );
}

/* 10 – Umgekehrtes Szenario */
function Slide10() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">Gleiches Szenario – andere Frage</div>

      <div
        style={{
          background: "var(--surface)",
          border: "1.5px solid var(--border)",
          borderRadius: "16px",
          padding: "32px 28px",
          width: "min(400px, 100%)",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "2.2rem" }}>🗣️</span>
        <div
          style={{
            marginTop: "12px",
            fontSize: "1.05rem",
            color: "var(--text)",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          «Ich habe eine Jacke für <strong>320 CHF</strong> gekauft – eigentlich
          wäre sie <strong>400 CHF</strong> gewesen.»
        </div>
        <div
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "var(--primary-lt)",
            border: "1.5px solid var(--primary)",
            borderRadius: "20px",
            display: "inline-block",
            color: "var(--primary-dk)",
            fontWeight: 700,
            fontSize: "1.05rem",
          }}
        >
          Wie viel % hat sie bezahlt?
        </div>
      </div>
    </div>
  );
}

/* 11 – Schätzung: zwischen 50% und 100% */
function Slide11() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">🧥 320 von 400 CHF – wie viel %?</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "min(440px, 100%)",
          margin: "0 auto",
        }}
      >
        {/* Step 1 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "8px",
            }}
          >
            🧐 Schritt 1: Was weiss ich?
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "18px",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              color: "var(--text)",
            }}
          >
            <li>
              Originalpreis: <strong>400 CHF</strong>
            </li>
            <li>
              Bezahlt: <strong>320 CHF</strong>
            </li>
          </ul>
        </div>

        {/* Step 2 – Estimation */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "12px",
            }}
          >
            🎯 Schritt 2: Schätzen
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginBottom: "12px",
            }}
          >
            {[
              { pct: "100%", val: "400 CHF", highlight: false },
              { pct: "?", val: "320 CHF", highlight: true },
              { pct: "50%", val: "200 CHF", highlight: false },
            ].map((row, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  background: row.highlight
                    ? "var(--primary-lt)"
                    : "transparent",
                  border: row.highlight
                    ? "1.5px solid var(--primary)"
                    : "1.5px solid transparent",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: row.highlight ? "var(--primary-dk)" : "var(--text)",
                    minWidth: "50px",
                  }}
                >
                  {row.pct}
                </span>
                <span style={{ color: "var(--muted)" }}>=</span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: row.highlight ? 700 : 400,
                    color: row.highlight ? "var(--primary-dk)" : "var(--text)",
                  }}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "0.88rem",
              color: "var(--primary-dk)",
              fontWeight: 600,
            }}
          >
            → Die Antwort muss zwischen 50% und 100% liegen.
          </div>
        </div>
      </div>
    </div>
  );
}

/* 12 – Welche Division? */
function Slide12() {
  return (
    <div className="pr-vis-inner" style={{ textAlign: "center" }}>
      <div className="pr-vis-label">🧥 320 von 400 CHF – wie viel %?</div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "min(440px, 100%)",
          margin: "0 auto",
        }}
      >
        {/* Step 3 */}
        <div
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            borderRadius: "12px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "12px",
            }}
          >
            ⚖️ Schritt 3: Welche Richtung?
          </div>

          {/* Wrong */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              background: "var(--err-lt)",
              border: "1.5px solid var(--err-border)",
              borderRadius: "8px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--err)",
                fontSize: "1.1rem",
              }}
            >
              ✗
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--err)",
                }}
              >
                400 ÷ 320 = 1.25 = 125%
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                über 100% – das kann nicht stimmen!
              </div>
            </div>
          </div>

          {/* Right */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 14px",
              background: "var(--primary-lt)",
              border: "1.5px solid var(--primary)",
              borderRadius: "8px",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "var(--primary-dk)",
                fontSize: "1.1rem",
              }}
            >
              ✓
            </span>
            <div>
              <div
                style={{
                  fontFamily: "'Courier New', monospace",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: "var(--primary-dk)",
                }}
              >
                320 ÷ 400 = 0.8 = 80%
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--muted)",
                }}
              >
                zwischen 50% und 100% → passt!
              </div>
            </div>
          </div>
        </div>

        {/* Step 4 – Result */}
        <div
          style={{
            background: "var(--primary-lt)",
            border: "1.5px solid var(--primary)",
            borderRadius: "12px",
            padding: "24px 20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--primary-dk)",
              marginBottom: "8px",
            }}
          >
            ✅ Schritt 4: Ergebnis
          </div>
          <div
            style={{
              fontFamily: "'Courier New', monospace",
              fontWeight: 700,
              fontSize: "1.6rem",
              color: "var(--primary-dk)",
            }}
          >
            Sie hat 80% bezahlt.
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "var(--muted)",
              marginTop: "6px",
            }}
          >
            Also 20% Rabatt – genau wie auf dem Schild!
          </div>
        </div>
      </div>
    </div>
  );
}

/* 13 – Zusammenfassung */
function Slide13() {
  return (
    <div className="pr-vis-inner" style={{ alignItems: "center" }}>
      <div className="pr-end-card">
        <span className="pr-end-emoji">🎓</span>
        <div className="pr-end-tag">Ende der Lektion</div>
        <h2>Das hast du heute gelernt</h2>
        <div className="pr-end-rows">
          <div className="pr-end-row">
            <span className="pr-er-icon">💯</span>
            <div>
              <div className="pr-er-title">Prozent = von hundert</div>
              <div className="pr-er-sub">
                <code>25% = 0.25</code> – nur anders geschrieben.
              </div>
            </div>
          </div>
          <div className="pr-end-row">
            <span className="pr-er-icon">📉</span>
            <div>
              <div className="pr-er-title">× Zahl unter 1 → kleiner</div>
              <div className="pr-er-sub">
                <code>300 · 0.6 = 180</code>
              </div>
            </div>
          </div>
          <div className="pr-end-row">
            <span className="pr-er-icon">📈</span>
            <div>
              <div className="pr-er-title">÷ Zahl unter 1 → grösser</div>
              <div className="pr-er-sub">
                <code>180 ÷ 0.6 = 300</code>
              </div>
            </div>
          </div>
          <div className="pr-end-row">
            <span className="pr-er-icon">🧠</span>
            <div>
              <div className="pr-er-title">Erst schätzen, dann rechnen</div>
              <div className="pr-er-sub">
                So erkennst du sofort, ob dein Ergebnis stimmt.
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
  SlideCalcIntro,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  SlideBeispielIntro,
  Slide7,
  Slide8,
  Slide9,
  Slide10,
  Slide11,
  Slide12,
  Slide13,
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Prozentrechnung() {
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
    <div className="pr-root">
      {/* ── TOPBAR ── */}
      <div className="pr-topbar">
        <div className="pr-brand">
          <div className="pr-brand-dot" />
          <div>
            <div className="pr-brand-title">Prozentrechnung in Excel</div>
            <div className="pr-brand-sub">Was bedeutet % ?</div>
          </div>
        </div>

        <div className="pr-progress-wrap">
          <div
            className="pr-progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="pr-topbar-right">
          <span className="pr-slide-counter">
            {current + 1} / {TOTAL}
          </span>
          <button
            className="pr-btn"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ← Zurück
          </button>
          <button
            className="pr-btn"
            onClick={() => goTo(current + 1)}
            disabled={current === TOTAL - 1}
          >
            Weiter →
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="pr-main">
        {/* Chat panel */}
        <div className="pr-chat-panel">
          <div className="pr-chat-label">
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
          <div className="pr-chat-area">
            <div className="pr-chat-bubble-wrap">
              <div className="pr-robot-avatar">
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
              <div className="pr-bubble">
                <div className="pr-bubble-sender">Boty · Excel</div>
                <div
                  key={current}
                  className="pr-bubble-text"
                  dangerouslySetInnerHTML={{ __html: SLIDES[current].chat }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual panel */}
        <div className="pr-visual-panel">
          {VISUALS.map((Visual, idx) => (
            <div
              key={idx}
              className={`pr-slide${idx === current ? " active" : ""}`}
            >
              {idx === current && <Visual />}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOMBAR ── */}
      <div className="pr-bottombar">
        <div className="pr-key-hint">
          <kbd className="pr-kbd">←</kbd>
          <kbd className="pr-kbd">→</kbd>
          navigieren &nbsp;·&nbsp;
          <kbd className="pr-kbd">Space</kbd> weiter
        </div>
      </div>
    </div>
  );
}
