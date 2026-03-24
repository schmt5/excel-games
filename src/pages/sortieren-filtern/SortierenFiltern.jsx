import { useState, useEffect, useCallback } from "react";
import botyImg from "../../assets/boty.png";
import botyChatImg from "../../assets/boty-chat.png";
import useEmbedResize from "../../useEmbedResize.js";
import "./SortierenFiltern.css";

/* ═══════════════════════════════════════════════════════════════
   PHOTO DATA
   ═══════════════════════════════════════════════════════════════ */

const PHOTOS = [
  {
    id: 1,
    emoji: "🌊",
    title: "Sommerferien Strand",
    date: "2022-07-12",
    dateLabel: "12. Jul 2022",
    location: "Florenz",
  },
  {
    id: 2,
    emoji: "🎉",
    title: "Geburtstagsparty",
    date: "2023-10-18",
    dateLabel: "18. Okt 2023",
    location: "Bern",
  },
  {
    id: 3,
    emoji: "🏔️",
    title: "Skiurlaub Berge",
    date: "2023-02-04",
    dateLabel: "4. Feb 2023",
    location: "Zürich",
  },
  {
    id: 4,
    emoji: "😂",
    title: "Meme Screenshot",
    date: "2024-01-03",
    dateLabel: "3. Jan 2024",
    location: "Zürich",
  },
  {
    id: 5,
    emoji: "🍦",
    title: "Gelato am Markt",
    date: "2022-08-20",
    dateLabel: "20. Aug 2022",
    location: "Florenz",
  },
  {
    id: 6,
    emoji: "🏛️",
    title: "Uffizien Galerie",
    date: "2022-08-21",
    dateLabel: "21. Aug 2022",
    location: "Florenz",
  },
  {
    id: 7,
    emoji: "🐶",
    title: "Hund im Park",
    date: "2023-05-14",
    dateLabel: "14. Mai 2023",
    location: "Bern",
  },
  {
    id: 8,
    emoji: "🌉",
    title: "Ponte Vecchio",
    date: "2022-08-19",
    dateLabel: "19. Aug 2022",
    location: "Florenz",
  },
];

const LOCATIONS = ["Alle Orte", "Florenz", "Bern", "Zürich"];

/* ═══════════════════════════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: 0,
    chat: `Willkommen! Heute schauen wir uns zwei wichtige Funktionen in Excel an: <strong>Sortieren</strong> und <strong>Filtern</strong>. Und damit ihr das sofort versteht, erkläre ich es mit etwas, das ihr alle kennt – euren Fotos auf dem Smartphone.`,
  },
  {
    id: 1,
    chat: `Kurze Frage in die Runde: <em>Wie viele Fotos habt ihr gerade auf eurem Handy?</em> Hundert? Fünfhundert? Mehr? – Ja, ich dachte mir's. Genau mit diesen Fotos erkläre ich euch heute, was Sortieren und Filtern in Excel bedeutet.`,
  },
  {
    id: 2,
    chat: `Fangen wir mit dem <strong>Sortieren</strong> an. Ihr öffnet eure Galerie – und alles ist wild durcheinander. Ein Foto vom letzten Sommer, dann ein Meme von gestern, dann ein Screenshot von vor zwei Jahren. <em>Chaos pur.</em>`,
  },
  {
    id: 3,
    chat: `Also tippt ihr auf <strong>„nach Datum sortieren"</strong>. Plötzlich sind die ältesten Fotos ganz oben, die neuesten ganz unten – oder umgekehrt, je nachdem was ihr wollt. Was hat sich verändert? Nur die <strong>Reihenfolge</strong>. Kein einziges Foto wurde gelöscht, keins wurde verändert. Alles ist noch da – einfach neu angeordnet.`,
  },
  {
    id: 4,
    chat: `Jetzt bist <strong>du dran</strong>! Wähle oben aus, ob du die Fotos nach <em>Neueste</em> oder <em>Älteste</em> sortieren möchtest. Beobachte, wie sich die Reihenfolge ändert – aber alle Fotos bleiben da. <strong>Nichts geht verloren.</strong>`,
  },
  {
    id: 5,
    chat: `Genau das macht <strong>Sortieren in Excel</strong>. Ihr habt eine lange Liste – zum Beispiel mit Namen, Preisen oder Daten – und sagt Excel: <em>„Ordne das bitte für mich."</em> Excel ordnet um, löscht aber <strong>nichts</strong>.`,
  },
  {
    id: 6,
    chat: `Jetzt zum <strong>Filtern</strong>. Stellt euch vor, ihr wart in den Ferien in <strong>Florenz – Italien</strong>. Wunderschöne Stadt, tolle Fotos, und nebenbei: unglaublich gutes Eis. Fast so gut wie das von Lea. <em>Fast.</em>`,
  },
  {
    id: 7,
    chat: `Jetzt seid ihr wieder zuhause und wollt genau diese Florenz-Fotos nochmal anschauen. Also geht ihr in die Suche und <strong>filtert nach dem Ort „Florenz"</strong>. Plötzlich seht ihr nur noch die Fotos, die dort aufgenommen wurden. Die anderen sind nicht weg – sie sind einfach gerade <strong>ausgeblendet</strong>.`,
  },
  {
    id: 8,
    chat: `Sobald ihr den Filter wieder wegnehmt und zur normalen Galerie zurückgeht – <strong>da sind sie alle wieder</strong>. Alle Fotos, genau wie vorher. <em>Nichts ist weg.</em>`,
  },
  {
    id: 9,
    chat: `Jetzt kannst <strong>du selbst filtern</strong>! Wähle einen Ort aus dem Dropdown – und sieh, wie nur die Fotos von diesem Ort sichtbar bleiben. Die anderen verschwinden kurz aus der Ansicht, aber sie sind <em>nicht weg</em>. Wähle „Alle Orte" um alle wieder zu sehen.`,
  },
  {
    id: 10,
    chat: `Das ist <strong>Filtern in Excel</strong>. Ihr sagt: <em>„Zeig mir nur die Zeilen, die mich gerade interessieren."</em> Der Rest verschwindet kurz aus der Ansicht – aber <strong>nur aus der Ansicht</strong>. Die Daten sind sicher, nichts geht verloren.`,
  },
  {
    id: 11,
    chat: `Was ist also der Unterschied? Beim <strong>Sortieren</strong> seht ihr alles – aber in einer neuen Reihenfolge. Beim <strong>Filtern</strong> bleibt die Reihenfolge gleich – aber ihr seht nur einen Teil. Zwei verschiedene Werkzeuge, zwei verschiedene Zwecke.`,
  },
  {
    id: 12,
    chat: `Und das Wichtigste: Beides könnt ihr jederzeit <strong>rückgängig machen</strong>. Excel löscht nie etwas davon – es ordnet nur um, oder blendet kurz aus. Eure Daten sind immer sicher.`,
  },
  {
    id: 13,
    chat: `Und damit sind wir am Ende! Ihr habt heute zwei wichtige Werkzeuge kennengelernt: <strong>Sortieren</strong> – um eine Liste in eine neue Reihenfolge zu bringen – und <strong>Filtern</strong> – um nur das zu sehen, was euch gerade interessiert. Beides ist jederzeit rückgängig machbar, und Excel löscht dabei <em>nie</em> etwas. Gut gemacht! 🎓`,
  },
];

const TOTAL = SLIDES.length;

/* ═══════════════════════════════════════════════════════════════
   VISUAL COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function Slide0() {
  return (
    <div className="sf-vis-inner sf-vis-title">
      <img
        src={botyImg}
        alt="Boty"
        className="sf-big-emoji"
        style={{
          width: "360px",
          height: "360px",
          objectFit: "contain",
          borderRadius: "16px",
          filter:
            "drop-shadow(0px 12px 16px rgba(0,0,0,0.15)) drop-shadow(0px 4px 6px rgba(0,0,0,0.09))",
          animation: "sf-boty-float 3.5s ease-in-out infinite",
        }}
      />
      <h1>
        Sortieren &amp; <span>Filtern</span>
        <br />
        in Excel
      </h1>
      <p className="sf-sub">Erklärt mit Fotos auf dem Smartphone</p>
    </div>
  );
}

function Slide1() {
  return (
    <div className="sf-vis-inner sf-phone-wrap">
      <div className="sf-phone-intro">
        <div className="sf-phone-intro-title">Wie viele Fotos hast du?</div>
        <div className="sf-phone-intro-sub">Hundert? Fünfhundert? Mehr?</div>
      </div>
      <div className="sf-phone">
        <div className="sf-phone-notch" />
        <div className="sf-photo-grid">
          {[
            { bg: "#fde8e8", e: "🌊" },
            { bg: "#e8f0fd", e: "🎉" },
            { bg: "#fdf5e8", e: "🌅" },
            { bg: "#e8fde8", e: "😂" },
            { bg: "#f5e8fd", e: "📸" },
            { bg: "#fde8f5", e: "🏔️" },
            { bg: "#e8fdfd", e: "🍕" },
            { bg: "#fdf0e8", e: "🐶" },
            { bg: "#eefde8", e: "🎵" },
          ].map((cell, i) => (
            <div
              key={i}
              className="sf-photo-cell"
              style={{ background: cell.bg }}
            >
              {cell.e}
            </div>
          ))}
        </div>
        <div className="sf-phone-label">Galerie – alles durcheinander</div>
      </div>
    </div>
  );
}

function Slide2() {
  return (
    <div className="sf-vis-inner sf-keyword-card">
      <div className="sf-keyword-big">Sortieren</div>
      <div className="sf-keyword-sub">
        Alles bleibt da – nur die Reihenfolge ändert sich
      </div>
    </div>
  );
}

function Slide3() {
  return (
    <div className="sf-vis-inner sf-sort-vis">
      <div className="sf-section-label">Fotos nach Datum sortiert ↑</div>
      <div className="sf-sort-row">
        <span>🌊</span> Sommerferien Strand
        <span className="sf-date-lbl">12. Jul 2022</span>
      </div>
      <div className="sf-sort-arrow">↓</div>
      <div className="sf-sort-row">
        <span>🏔️</span> Skiurlaub Berge
        <span className="sf-date-lbl">4. Feb 2023</span>
      </div>
      <div className="sf-sort-arrow">↓</div>
      <div className="sf-sort-row">
        <span>🎉</span> Geburtstagsparty
        <span className="sf-date-lbl">18. Okt 2023</span>
      </div>
      <div className="sf-sort-arrow">↓</div>
      <div className="sf-sort-row">
        <span>😂</span> Meme Screenshot
        <span className="sf-date-lbl">3. Jan 2024</span>
      </div>
      <div className="sf-ok-note">✓ Alle Fotos da – nur neu angeordnet</div>
    </div>
  );
}

/* ── INTERACTIVE SORT SLIDE ── */
function Slide4() {
  const [order, setOrder] = useState("newest");

  const sorted = [...PHOTOS].sort((a, b) => {
    if (order === "newest") return b.date.localeCompare(a.date);
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="sf-vis-inner sf-interactive-slide">
      {/* Header */}
      <div className="sf-interactive-header">
        <div className="sf-interactive-title">
          <span className="sf-interactive-icon">↕️</span>
          Sortieren – probiere es aus!
        </div>
        <div className="sf-select-wrap">
          <label className="sf-select-label" htmlFor="sort-select">
            Sortieren nach
          </label>
          <div className="sf-select-outer">
            <select
              id="sort-select"
              className="sf-select"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="newest">🆕 Neueste zuerst</option>
              <option value="oldest">🕰️ Älteste zuerst</option>
            </select>
            <span className="sf-select-chevron">▾</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="sf-photo-list">
        {sorted.map((photo, idx) => (
          <div key={photo.id} className="sf-photo-row">
            <span className="sf-photo-rank">{idx + 1}</span>
            <span className="sf-photo-emoji">{photo.emoji}</span>
            <span className="sf-photo-title">{photo.title}</span>
            <span className="sf-photo-loc-tag">{photo.location}</span>
            <span className="sf-photo-date">{photo.dateLabel}</span>
          </div>
        ))}
      </div>

      <div className="sf-interactive-note">
        ✓ Alle {PHOTOS.length} Fotos sichtbar – nur die Reihenfolge ändert sich
      </div>
    </div>
  );
}

function Slide5() {
  return (
    <div className="sf-vis-inner sf-sort-vis">
      <div className="sf-section-label">
        Excel-Liste sortiert nach Name A → Z
      </div>
      <div className="sf-sort-row">
        <span>📋</span> Abegg, Sara
        <span className="sf-date-lbl">Klasse 3b</span>
      </div>
      <div className="sf-sort-arrow">↓</div>
      <div className="sf-sort-row">
        <span>📋</span> Brunner, Lea
        <span className="sf-date-lbl">Klasse 2a</span>
      </div>
      <div className="sf-sort-arrow">↓</div>
      <div className="sf-sort-row">
        <span>📋</span> Müller, Jana
        <span className="sf-date-lbl">Klasse 3b</span>
      </div>
      <div className="sf-ok-note">✓ Gleiche Logik wie bei den Fotos</div>
    </div>
  );
}

function Slide6() {
  return (
    <div className="sf-vis-inner">
      <div className="sf-fun-card">
        <span className="sf-fe">🍦</span>
        <h2>Florenz, Italien 🇮🇹</h2>
        <p>Wunderschöne Stadt, tolle Fotos – und unglaublich gutes Eis.</p>
        <div className="sf-fun-note">
          Fast so gut wie das von Lea. <em>Fast.</em>
        </div>
      </div>
    </div>
  );
}

function Slide7() {
  return (
    <div className="sf-vis-inner sf-filter-vis">
      <div className="sf-section-label">
        Galerie › Suche nach Ort: Florenz 📍
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🌉</span>
        Ponte Vecchio
        <span className="sf-chip-loc">📍 Florenz</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🍦</span>
        Gelato am Markt
        <span className="sf-chip-loc">📍 Florenz</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🏛️</span>
        Uffizien Galerie
        <span className="sf-chip-loc">📍 Florenz</span>
      </div>
      <div className="sf-filter-sep" />
      <div className="sf-filter-chip dimmed">
        <span className="sf-chip-icon">😂</span>
        Meme Screenshot
        <span className="sf-chip-loc">📍 Zürich</span>
      </div>
      <div className="sf-filter-chip dimmed">
        <span className="sf-chip-icon">🎉</span>
        Geburtstagsparty
        <span className="sf-chip-loc">📍 Bern</span>
      </div>
      <div className="sf-filter-chip dimmed">
        <span className="sf-chip-icon">🐶</span>
        Hund im Park
        <span className="sf-chip-loc">📍 Basel</span>
      </div>
      <div className="sf-ok-note">
        ✓ Nur Florenz-Fotos sichtbar – andere ausgeblendet
      </div>
    </div>
  );
}

function Slide8() {
  return (
    <div className="sf-vis-inner sf-filter-vis">
      <div className="sf-safe-badge">✅ Filter weg – alles wieder da</div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🌉</span>
        Ponte Vecchio
        <span className="sf-chip-loc">📍 Florenz</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">😂</span>
        Meme Screenshot
        <span className="sf-chip-loc">📍 Zürich</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🎉</span>
        Geburtstagsparty
        <span className="sf-chip-loc">📍 Bern</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">🐶</span>
        Hund im Park
        <span className="sf-chip-loc">📍 Basel</span>
      </div>
      <div className="sf-ok-note">
        ✓ Alle Fotos wieder sichtbar – nichts gelöscht
      </div>
    </div>
  );
}

/* ── INTERACTIVE FILTER SLIDE ── */
function Slide9() {
  const [location, setLocation] = useState("Alle Orte");

  const visibleCount =
    location === "Alle Orte"
      ? PHOTOS.length
      : PHOTOS.filter((p) => p.location === location).length;

  return (
    <div className="sf-vis-inner sf-interactive-slide">
      {/* Header */}
      <div className="sf-interactive-header">
        <div className="sf-interactive-title">
          <span className="sf-interactive-icon">🔍</span>
          Filtern – probiere es aus!
        </div>
        <div className="sf-select-wrap">
          <label className="sf-select-label" htmlFor="filter-select">
            Ort filtern
          </label>
          <div className="sf-select-outer">
            <select
              id="filter-select"
              className="sf-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === "Alle Orte" ? "📍 Alle Orte" : `📍 ${loc}`}
                </option>
              ))}
            </select>
            <span className="sf-select-chevron">▾</span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="sf-photo-list">
        {PHOTOS.map((photo) => {
          const visible =
            location === "Alle Orte" || photo.location === location;
          return (
            <div
              key={photo.id}
              className={`sf-photo-row${visible ? " sf-photo-row--visible" : " sf-photo-row--hidden"}`}
            >
              <span className="sf-photo-emoji">{photo.emoji}</span>
              <span className="sf-photo-title">{photo.title}</span>
              <span className="sf-photo-loc-tag">{photo.location}</span>
              <span className="sf-photo-date">{photo.dateLabel}</span>
              {!visible && (
                <span className="sf-hidden-badge">ausgeblendet</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="sf-interactive-note">
        {location === "Alle Orte"
          ? `✓ Alle ${PHOTOS.length} Fotos sichtbar`
          : `✓ ${visibleCount} von ${PHOTOS.length} Fotos sichtbar – ${PHOTOS.length - visibleCount} ausgeblendet (nicht gelöscht!)`}
      </div>
    </div>
  );
}

function Slide10() {
  return (
    <div className="sf-vis-inner sf-filter-vis">
      <div className="sf-section-label">Excel › Filter: Klasse 3b</div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">📋</span>
        Abegg, Sara
        <span className="sf-chip-loc">Klasse 3b</span>
      </div>
      <div className="sf-filter-chip shown">
        <span className="sf-chip-icon">📋</span>
        Müller, Jana
        <span className="sf-chip-loc">Klasse 3b</span>
      </div>
      <div className="sf-filter-sep" />
      <div className="sf-filter-chip dimmed">
        <span className="sf-chip-icon">📋</span>
        Brunner, Lea
        <span className="sf-chip-loc">Klasse 2a</span>
      </div>
      <div className="sf-filter-chip dimmed">
        <span className="sf-chip-icon">📋</span>
        Huber, Mia
        <span className="sf-chip-loc">Klasse 1c</span>
      </div>
      <div className="sf-ok-note">✓ Gleiche Logik wie in der Galerie</div>
    </div>
  );
}

function Slide11() {
  return (
    <div className="sf-vis-inner">
      <div className="sf-compare-grid">
        <div className="sf-compare-box">
          <span className="sf-cb-emoji">📅</span>
          <h3>Sortieren</h3>
          <p>
            Alles sichtbar – neue <strong>Reihenfolge</strong>. Nichts
            verschwindet.
          </p>
        </div>
        <div className="sf-compare-box">
          <span className="sf-cb-emoji">📍</span>
          <h3>Filtern</h3>
          <p>
            Reihenfolge gleich – nur ein <strong>Teil</strong> sichtbar. Rest
            ist versteckt.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slide12() {
  return (
    <div
      className="sf-vis-inner"
      style={{ alignItems: "center", textAlign: "center" }}
    >
      <div className="sf-safe-badge">🔄 Beides jederzeit rückgängig</div>
      <div className="sf-mem-list">
        <div className="sf-mem-row">
          <span className="sf-mr-icon">↕️</span>
          <div>
            <div className="sf-mr-title">Sortieren</div>
            <div className="sf-mr-sub">Reihenfolge zurücksetzen → fertig</div>
          </div>
        </div>
        <div className="sf-mem-row">
          <span className="sf-mr-icon">🔍</span>
          <div>
            <div className="sf-mr-title">Filtern</div>
            <div className="sf-mr-sub">Filter entfernen → alles wieder da</div>
          </div>
        </div>
      </div>
      <p className="sf-mem-note">
        Excel <strong>löscht nie</strong> – es ordnet nur um oder blendet kurz
        aus.
      </p>
    </div>
  );
}

function Slide13() {
  return (
    <div className="sf-vis-inner" style={{ alignItems: "center" }}>
      <div className="sf-finale-card">
        <span className="sf-finale-emoji">🎓</span>
        <div className="sf-finale-eyebrow">Ende der Lektion</div>
        <div className="sf-finale-title">Das hast du heute gelernt</div>
        <div className="sf-finale-list">
          <div className="sf-finale-item">
            <span className="sf-finale-item-icon">📅</span>
            <div>
              <div className="sf-finale-item-title">Sortieren</div>
              <div className="sf-finale-item-sub">
                Reihenfolge ändern – nichts geht verloren
              </div>
            </div>
          </div>
          <div className="sf-finale-item alt">
            <span className="sf-finale-item-icon">📍</span>
            <div>
              <div className="sf-finale-item-title">Filtern</div>
              <div className="sf-finale-item-sub">
                Nur das Wichtige anzeigen – alles bleibt gespeichert
              </div>
            </div>
          </div>
        </div>
        <div className="sf-finale-footer">
          Excel löscht nie – es ordnet nur um oder blendet kurz aus. 🙌
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
  Slide13,
];

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function SortierenFiltern() {
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
      // Don't steal keyboard from the select dropdowns
      if (e.target.tagName === "SELECT") return;
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
    <div className="sf-root">
      {/* ── TOPBAR ── */}
      <div className="sf-topbar">
        <div className="sf-brand">
          <div className="sf-brand-dot" />
          <div>
            <div className="sf-brand-title">
              Sortieren &amp; Filtern in Excel
            </div>
            <div className="sf-brand-sub">Erklärt mit Smartphone-Fotos</div>
          </div>
        </div>

        <div className="sf-progress-wrap">
          <div
            className="sf-progress-bar"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="sf-topbar-right">
          <span className="sf-slide-counter">
            {current + 1} / {TOTAL}
          </span>
          <button
            className="sf-btn"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
          >
            ← Zurück
          </button>
          <button
            className="sf-btn"
            onClick={() => goTo(current + 1)}
            disabled={current === TOTAL - 1}
          >
            Weiter →
          </button>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="sf-main">
        {/* Chat panel */}
        <div className="sf-chat-panel">
          <div className="sf-chat-label">
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
          <div className="sf-chat-area">
            <div className="sf-chat-bubble-wrap">
              <div className="sf-robot-avatar">
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
              <div className="sf-bubble">
                <div className="sf-bubble-sender">Boty · Excel</div>
                <div
                  key={current}
                  className="sf-bubble-text"
                  dangerouslySetInnerHTML={{ __html: SLIDES[current].chat }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual panel */}
        <div className="sf-visual-panel">
          {VISUALS.map((Visual, idx) => (
            <div
              key={idx}
              className={`sf-slide${idx === current ? " active" : ""}`}
            >
              {idx === current && <Visual />}
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOMBAR ── */}
      <div className="sf-bottombar">
        <div className="sf-key-hint">
          <kbd className="sf-kbd">←</kbd>
          <kbd className="sf-kbd">→</kbd>
          navigieren &nbsp;·&nbsp;
          <kbd className="sf-kbd">Space</kbd> weiter
        </div>
      </div>
    </div>
  );
}
