"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const EsmiChat = dynamic(() => import("@/components/EsmiChat"));

/**
 * Keeps the chat widget — its JS, its logo, its launcher — entirely out of the
 * initial page load. It mounts on the first sign of a real visitor, or when the
 * browser goes idle, whichever comes first. Nobody can click a chat bubble
 * before the page has painted anyway.
 */
export default function EsmiChatLoader() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    const events = ["pointerdown", "pointermove", "touchstart", "keydown"] as const;
    let done = false;

    const show = () => {
      if (done) return;
      done = true;
      setMount(true);
    };

    for (const event of events) {
      window.addEventListener(event, show, { passive: true });
    }
    const idleId = requestIdle(show);

    return () => {
      done = true;
      for (const event of events) window.removeEventListener(event, show);
      cancelIdle(idleId);
    };
  }, []);

  return mount ? <EsmiChat /> : null;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

function requestIdle(cb: () => void): number {
  const w = window as IdleWindow;
  return typeof w.requestIdleCallback === "function"
    ? w.requestIdleCallback(cb, { timeout: 4000 })
    : window.setTimeout(cb, 2500);
}

function cancelIdle(id: number) {
  const w = window as IdleWindow;
  if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id);
  else window.clearTimeout(id);
}
