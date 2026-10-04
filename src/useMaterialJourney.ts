import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type RefObject, useRef, useState } from "react";
import type { CameraTravel } from "./MaterialScene";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin);

// Reverting a context renders its recorded tweens at their start before any cleanup runs.
// That render is bookkeeping, not a camera move, so camera updates ignore it.
const reverting = () =>
  Boolean((gsap.core as unknown as { reverting?: () => unknown }).reverting?.());

export const materialShots = [
  { name: "Composition", progress: 0 },
  { name: "The curve", progress: 0.46 },
  { name: "The grain", progress: 1 },
] as const;

/** Scroll changes one scalar. Three samples a real position and look-target path. */
export function useMaterialJourney(
  motion: boolean,
  projects: RefObject<HTMLHeadingElement | null>,
) {
  const root = useRef<HTMLDivElement>(null);
  const travel = useRef<CameraTravel>({ progress: 0 });
  const actions = useRef<{ jump: (index: number) => void; skip: () => void } | null>(null);
  const [activeShot, setActiveShot] = useState(0);
  const [scrollLinked, setScrollLinked] = useState(false);
  const [available, setAvailable] = useState(true);
  const [announcement, setAnnouncement] = useState("");

  useGSAP(
    () => {
      const element = root.current;
      const stage = element?.querySelector<HTMLElement>(".hero");
      if (!element || !stage) return;
      let alive = true;
      let tearingDown = false;
      let pinActive = false;
      let trigger: ScrollTrigger | undefined;
      let railTween: gsap.core.Tween | undefined;
      let scrollTween: gsap.core.Tween | undefined;
      let currentShot = -1;
      travel.current.onAvailability = (value) => {
        if (alive) setAvailable(value);
      };
      const rail = { progress: travel.current.progress };
      const captions = Array.from(element.querySelectorAll<HTMLElement>("[data-camera-caption]"));
      const meter = element.querySelector<HTMLElement>(".journey-progress-fill");
      const setProgress = meter ? gsap.quickSetter(meter, "scaleX") : null;
      const captionOpacity = captions.map((caption) => gsap.quickSetter(caption, "opacity"));
      const captionVisibility = captions.map((caption) => gsap.quickSetter(caption, "visibility"));

      const update = () => {
        // Killing the pinned tween also rewinds its trigger; that is not the visitor's view.
        if (!alive || tearingDown) return;
        const progress = gsap.utils.clamp(0, 1, rail.progress);
        travel.current.progress = progress;
        travel.current.wake?.();
        setProgress?.(progress);
        const shot = progress < 0.24 ? 0 : progress < 0.7 ? 1 : 2;
        if (shot !== currentShot) {
          currentShot = shot;
          setActiveShot(shot);
        }
        // Opacity alone updates during scrolling; no per-frame React or layout work.
        const opacity = [
          1 - gsap.utils.clamp(0, 1, (progress - 0.08) / 0.15),
          Math.min(
            gsap.utils.clamp(0, 1, (progress - 0.22) / 0.13),
            1 - gsap.utils.clamp(0, 1, (progress - 0.6) / 0.1),
          ),
          gsap.utils.clamp(0, 1, (progress - 0.69) / 0.12),
        ];
        captions.forEach((caption, i) => {
          const value = opacity[i] ?? 0;
          captionOpacity[i]?.(value);
          if (i === 0) {
            // The page's h1 stays in the accessibility tree while it fades for the camera.
            // Only its link leaves the tab order, and never while it holds focus.
            caption.style.pointerEvents = value < 0.5 ? "none" : "";
            const link = caption.querySelector<HTMLElement>("a");
            if (link && document.activeElement !== link) link.inert = value < 0.5;
            return;
          }
          captionVisibility[i]?.(value > 0.01 ? "visible" : "hidden");
          caption.inert = value < 0.5;
        });
      };

      const media = gsap.matchMedia();
      media.add(
        { all: "all", tall: "(min-height: 740px)", reduced: "(prefers-reduced-motion: reduce)" },
        (context) => {
          const shouldPin =
            motion && available && context.conditions?.tall && !context.conditions?.reduced;
          setScrollLinked(Boolean(shouldPin));
          if (shouldPin) {
            railTween = gsap.fromTo(
              rail,
              { progress: 0 },
              {
                progress: 1,
                ease: "none",
                onUpdate: () => {
                  if (!reverting()) update();
                },
                scrollTrigger: {
                  id: "strata-material-camera",
                  trigger: element,
                  pin: stage,
                  start: "top top",
                  // Re-evaluated on every refresh. invalidateOnRefresh is deliberately absent:
                  // it rewinds this constant tween to 0 and fires onUpdate mid-pin.
                  end: () =>
                    `+=${Math.round(window.innerHeight * (window.innerWidth < 800 ? 1.75 : 2.25))}`,
                  scrub: 0.7,
                  anticipatePin: 1,
                  onRefresh: () => update(),
                  onToggle: (self) => {
                    pinActive = self.isActive;
                  },
                },
              },
            );
            trigger = railTween.scrollTrigger;
          } else {
            trigger = undefined;
            // Retain the chosen angle when motion is paused; subsequent buttons cut instantly.
            update();
          }
          return () => {
            // Removing the pin also removes its scroll spacer. If the visitor is inside the
            // passage (motion switch, OS preference, height change), keep the hero in view.
            const restoreHero = pinActive && element.isConnected;
            const heroTop = element.getBoundingClientRect().top + window.scrollY;
            trigger = undefined;
            pinActive = false;
            tearingDown = true;
            scrollTween?.kill();
            railTween?.kill();
            gsap.killTweensOf(rail);
            tearingDown = false;
            if (restoreHero) {
              requestAnimationFrame(() => {
                if (element.isConnected) window.scrollTo({ top: heroTop, behavior: "instant" });
              });
            }
          };
        },
      );

      // Plain handlers: tweens created here stay out of the useGSAP context, because reverting
      // a context re-renders its recorded tweens at their start (scroll and camera jump back).
      actions.current = {
        jump: (index: number) => {
          const shot = materialShots[index];
          if (!shot) return;
          setAnnouncement(`${shot.name} view`);
          scrollTween?.kill();
          if (trigger) {
            scrollTween = gsap.to(window, {
              scrollTo: {
                y: trigger.start + (trigger.end - trigger.start) * shot.progress,
                autoKill: true,
              },
              duration: 1,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          } else {
            gsap.killTweensOf(rail);
            if (motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              gsap.to(rail, {
                progress: shot.progress,
                duration: 1.1,
                ease: "power2.inOut",
                onUpdate: update,
              });
            } else {
              rail.progress = shot.progress;
              update();
            }
          }
        },
        skip: () => {
          const destination = projects.current;
          if (!destination) return;
          scrollTween?.kill();
          scrollTween = gsap.to(window, {
            scrollTo: { y: destination, offsetY: 36, autoKill: true },
            duration:
              motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.75 : 0,
            ease: "power2.inOut",
            overwrite: "auto",
            onComplete: () => destination.focus({ preventScroll: true }),
            onInterrupt: () => destination.focus({ preventScroll: true }),
          });
        },
      };
      update();
      // Fonts can change the hero height once. Refresh after that known layout change.
      document.fonts.ready.then(() => {
        if (alive) ScrollTrigger.refresh();
      });
      return () => {
        alive = false;
        actions.current = null;
        travel.current.onAvailability = undefined;
        scrollTween?.kill();
        media.revert();
        captions.forEach((caption) => {
          caption.style.removeProperty("opacity");
          caption.style.removeProperty("visibility");
          caption.style.removeProperty("pointer-events");
          caption.inert = false;
          const link = caption.querySelector<HTMLElement>("a");
          if (link) link.inert = false;
        });
        meter?.style.removeProperty("transform");
      };
    },
    { scope: root, dependencies: [motion, available], revertOnUpdate: true },
  );

  return {
    root,
    travel,
    activeShot,
    scrollLinked,
    available,
    announcement,
    jump: (index: number) => actions.current?.jump(index),
    skip: () => actions.current?.skip(),
  };
}
