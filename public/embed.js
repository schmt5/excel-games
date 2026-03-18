(function () {
  "use strict";

  var DEFAULT_BASE_URL = "https://excel-games.vercel.app";

  /**
   * Detect the base URL from the script's own src attribute.
   * Falls back to DEFAULT_BASE_URL if detection fails.
   */
  function detectBaseUrl() {
    try {
      var scripts = document.querySelectorAll("script[src]");
      for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute("src");
        if (src && src.indexOf("embed.js") !== -1) {
          var url = new URL(src, window.location.href);
          return url.origin;
        }
      }
      // eslint-disable-next-line no-unused-vars
    } catch (_) {
      // ignore
    }
    return DEFAULT_BASE_URL;
  }

  var VALID_SLUGS = {
    "formel-escape-room": true,
    "intro-pirates": true,
    "formel-baukasten": true,
  };

  /**
   * Replace a div[data-excel-game] with a styled iframe.
   */
  function mountGame(div, baseUrl) {
    var slug = div.getAttribute("data-excel-game");
    if (!slug || !VALID_SLUGS[slug]) {
      console.warn("[ExcelGames] Unknown game slug:", slug);
      return;
    }

    // Avoid double-mounting
    if (div.getAttribute("data-excel-game-mounted") === "true") {
      return;
    }
    div.setAttribute("data-excel-game-mounted", "true");

    var width = div.getAttribute("data-width") || "100%";
    var height = parseInt(div.getAttribute("data-height") || "600", 10);
    var overrideBase = div.getAttribute("data-base-url");
    var origin = overrideBase || baseUrl;

    // Strip trailing slash
    origin = origin.replace(/\/$/, "");

    var src = origin + "/" + slug + "?embed=1";

    var iframe = document.createElement("iframe");
    iframe.setAttribute("src", src);
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("allow", "clipboard-write");
    iframe.setAttribute("title", "Excel Game: " + slug);
    iframe.setAttribute("loading", "lazy");

    iframe.style.display = "block";
    iframe.style.border = "none";
    iframe.style.width = width;
    iframe.style.height = height + "px";
    iframe.style.maxWidth = "100%";
    iframe.style.overflow = "hidden";

    // Transfer any existing children of the div into a noscript fallback
    // (clear the div first)
    div.innerHTML = "";
    div.style.lineHeight = "0"; // prevent gap under iframe
    div.appendChild(iframe);

    // Store reference for resize messages
    iframe._excelGameSlug = slug;
  }

  /**
   * Listen for postMessage resize events from any mounted iframe.
   */
  function setupResizeListener() {
    if (window._excelGamesResizeListening) return;
    window._excelGamesResizeListening = true;

    window.addEventListener("message", function (event) {
      try {
        var data = event.data;
        if (
          data &&
          typeof data === "object" &&
          data.type === "excel-game-resize" &&
          typeof data.height === "number"
        ) {
          // Find the iframe whose contentWindow sent this message
          var iframes = document.querySelectorAll("iframe");
          for (var i = 0; i < iframes.length; i++) {
            var iframe = iframes[i];
            if (iframe.contentWindow === event.source) {
              iframe.style.height = Math.ceil(data.height) + "px";
              break;
            }
          }
        }
        // eslint-disable-next-line no-unused-vars
      } catch (_) {
        // ignore cross-origin or malformed messages
      }
    });
  }

  /**
   * Find all unmounted game divs and mount them.
   */
  function init() {
    var baseUrl = detectBaseUrl();
    var divs = document.querySelectorAll("[data-excel-game]");

    if (divs.length === 0) return;

    setupResizeListener();

    for (var i = 0; i < divs.length; i++) {
      mountGame(divs[i], baseUrl);
    }
  }

  // Expose public API
  window.ExcelGames = window.ExcelGames || {};
  window.ExcelGames.init = init;

  // Auto-run: if DOM is already ready, run now; otherwise wait.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
