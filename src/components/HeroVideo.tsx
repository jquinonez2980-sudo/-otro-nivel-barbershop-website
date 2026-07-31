"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The looping shop footage behind the hero.
 *
 * It is decorative, so it is not fetched until the page has finished loading
 * *and* someone has actually interacted — no visitor pays 1.5 MB of cellular
 * data for a video they scrolled past in a second. Visitors who ask for
 * reduced motion, who have Data Saver on, or who are on a slow connection
 * keep the still frame.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && connection.effectiveType !== "4g") return;

    const events = [
      "pointerdown",
      "pointermove",
      "touchstart",
      "wheel",
      "keydown",
    ] as const;

    const start = () => {
      teardown();
      setReady(true);
    };
    const arm = () => {
      for (const event of events) {
        window.addEventListener(event, start, { passive: true });
      }
    };
    const teardown = () => {
      window.removeEventListener("load", arm);
      for (const event of events) window.removeEventListener(event, start);
    };

    if (document.readyState === "complete") arm();
    else window.addEventListener("load", arm, { once: true });

    return teardown;
  }, []);

  // Attribute-only autoplay often leaves the element at readyState 0 / paused.
  useEffect(() => {
    if (!ready) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked (rare with muted+playsInline) — the still stays up.
      });
    };

    tryPlay();
    video.addEventListener("canplay", tryPlay);
    return () => video.removeEventListener("canplay", tryPlay);
  }, [ready]);

  if (!ready) return null;

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      src="/media/hero-loop-v3.mp4"
    />
  );
}
