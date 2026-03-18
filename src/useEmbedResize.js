import { useEffect } from "react";

/**
 * useEmbedResize
 *
 * Detects whether the app is running inside an iframe (or with ?embed=1 in
 * the URL). iFrameResizer (loaded via the content script in index.html) handles
 * all automatic height reporting to the parent — no manual postMessage needed.
 *
 * The hook just applies the `embed-mode` CSS class to <body> so the app can
 * strip decorative chrome (borders, min-height, etc.) when embedded.
 *
 * @returns {boolean} isEmbed — true when running in embed mode
 */
export default function useEmbedResize() {
  const isEmbed =
    typeof window !== "undefined" &&
    (window.self !== window.top ||
      new URLSearchParams(window.location.search).get("embed") === "1");

  useEffect(() => {
    if (isEmbed) {
      document.body.classList.add("embed-mode");
    }
    return () => {
      document.body.classList.remove("embed-mode");
    };
  }, [isEmbed]);

  return isEmbed;
}
