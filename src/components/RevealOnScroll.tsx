"use client";

import { useEffect } from "react";

export default function RevealOnScroll() {
  useEffect(() => {

    if (!("IntersectionObserver" in window)) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const seen = new Set<Element>();

    let listening = false;

    const isVisibleByThreshold = (el: Element) => {
      const rect = el.getBoundingClientRect();
      const bottomLimit = window.innerHeight - 50;
      const visible = Math.min(rect.bottom, bottomLimit) - Math.max(rect.top, 0);
      return visible > 0 && visible >= Math.min(rect.height * 0.15, 240);
    };

    function startListening() {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", checkVisible, { passive: true });
      window.addEventListener("resize", checkVisible);
    }

    function stopListening() {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", checkVisible);
      window.removeEventListener("resize", checkVisible);
    }

    function checkVisible() {
      let ancoraDaRivelare = false;
      for (const el of Array.from(document.querySelectorAll(".reveal"))) {
        if (el.classList.contains("revealed")) continue;
        if (isVisibleByThreshold(el)) {
          el.classList.add("revealed");
          observer.unobserve(el);
        } else {
          ancoraDaRivelare = true;
        }
      }
      if (ancoraDaRivelare) startListening();
      else stopListening();
    }

    const track = (el: Element) => {
      if (seen.has(el)) return;
      seen.add(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setTimeout(() => {
          el.classList.add("revealed");
        }, 50);
      } else {
        observer.observe(el);
        startListening();
      }
    };

    const refresh = () => {
      Array.from(document.querySelectorAll(".reveal")).forEach(track);
    };

    refresh();
    window.addEventListener("maeli:reveal-refresh", refresh);

    return () => {
      observer.disconnect();
      stopListening();
      window.removeEventListener("maeli:reveal-refresh", refresh);
    };
  }, []);

  return null;
}
