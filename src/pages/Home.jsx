import { useState } from "react";
import useEmbedResize from "../useEmbedResize.js";

const GAMES = [
  {
    slug: "formel-escape-room",
    title: "Formel Escape Room",
    description: "Löse Excel-Formeln, um aus den Räumen zu entkommen.",
  },
  {
    slug: "intro-pirates",
    title: "Käpt'n Zelle – Das Piraten-Abenteuer",
    description: "Lerne Zellbezüge mit einem spannenden Piraten-Abenteuer.",
  },
  {
    slug: "formel-baukasten",
    title: "Formel-Baukasten",
    description: "Baue Excel-Formeln aus Blöcken zusammen.",
  },
  {
    slug: "sortieren-filtern",
    title: "Sortieren & Filtern in Excel",
    description: "Lerne Sortieren und Filtern erklärt mit Smartphone-Fotos.",
  },
];

const BASE_URL = "https://excel-games.vercel.app";

function embedSnippet(slug) {
  return (
    `<div data-excel-game="${slug}"></div>\n<script src="${BASE_URL}/embed.js"></` +
    `script>`
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        padding: "4px 12px",
        fontSize: "13px",
        fontFamily: "var(--mono)",
        background: copied ? "var(--accent)" : "var(--code-bg)",
        color: copied ? "#fff" : "var(--text-h)",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background 0.15s, color 0.15s",
        lineHeight: "1.5",
      }}
    >
      {copied ? "✓ Kopiert!" : "Kopieren"}
    </button>
  );
}

function EmbedSnippet({ game }) {
  const snippet = embedSnippet(game.slug);

  return (
    <div
      style={{
        textAlign: "left",
        marginBottom: "32px",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--text-h)",
          fontFamily: "var(--sans)",
        }}
      >
        {game.title}
      </h3>
      <div style={{ position: "relative" }}>
        <pre
          style={{
            margin: 0,
            padding: "14px 48px 14px 16px",
            background: "var(--code-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontFamily: "var(--mono)",
            fontSize: "13px",
            lineHeight: "1.6",
            color: "var(--text-h)",
            overflowX: "auto",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}
        >
          {snippet}
        </pre>
        <CopyButton text={snippet} />
      </div>
    </div>
  );
}

export default function Home() {
  // eslint-disable-next-line no-unused-vars
  const isEmbed = useEmbedResize();

  return (
    <main
      style={{
        padding: "0 32px 64px",
        maxWidth: "720px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "left",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Excel Games</h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "40px",
          color: "var(--text)",
        }}
      >
        Willkommen! Wähle ein Spiel aus, um zu starten.
      </p>

      {/* ── Game List ── */}
      <section style={{ marginBottom: "56px" }}>
        <h2>Spiele</h2>
        <ul
          style={{
            listStyle: "none",
            margin: "16px 0 0",
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {GAMES.map((game) => (
            <li
              key={game.slug}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px 20px",
                background: "var(--bg)",
                transition: "box-shadow 0.15s",
              }}
            >
              <a
                href={`/${game.slug}`}
                style={{
                  display: "block",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    fontSize: "17px",
                    color: "var(--accent)",
                    marginBottom: "4px",
                  }}
                >
                  {game.title}
                </strong>
                <span style={{ fontSize: "14px", color: "var(--text)" }}>
                  {game.description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Embed Section ── */}
      <section>
        <h2>Spiele einbetten</h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text)",
            margin: "8px 0 28px",
            lineHeight: "1.6",
          }}
        >
          Binde ein Spiel direkt in deine Webseite oder dein Tally-Formular ein.
          Füge einfach den folgenden Code an der gewünschten Stelle ein:
        </p>

        {GAMES.map((game) => (
          <EmbedSnippet key={game.slug} game={game} />
        ))}

        <div
          style={{
            marginTop: "8px",
            padding: "14px 18px",
            background: "var(--accent-bg)",
            border: "1px solid var(--accent-border)",
            borderRadius: "8px",
            fontSize: "14px",
            color: "var(--text)",
            lineHeight: "1.6",
          }}
        >
          <strong style={{ color: "var(--text-h)" }}>Tipp:</strong> Du kannst
          die Breite und Höhe mit{" "}
          <code
            style={{
              fontSize: "13px",
              padding: "2px 6px",
              background: "var(--code-bg)",
              borderRadius: "4px",
              color: "var(--text-h)",
            }}
          >
            data-width
          </code>{" "}
          und{" "}
          <code
            style={{
              fontSize: "13px",
              padding: "2px 6px",
              background: "var(--code-bg)",
              borderRadius: "4px",
              color: "var(--text-h)",
            }}
          >
            data-height
          </code>{" "}
          anpassen, z.&nbsp;B.{" "}
          <code
            style={{
              fontSize: "13px",
              padding: "2px 6px",
              background: "var(--code-bg)",
              borderRadius: "4px",
              color: "var(--text-h)",
            }}
          >
            {`<div data-excel-game="formel-escape-room" data-height="800">`}
          </code>
        </div>
      </section>
    </main>
  );
}
