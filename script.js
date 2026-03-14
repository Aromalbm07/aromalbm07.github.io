const hasGSAP = typeof window.gsap !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

if (hasGSAP && hasScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: false });
  gsap.ticker.lagSmoothing(1000, 16);
}

const typingTarget = document.getElementById("typing-text");
const loader = document.querySelector(".page-loader");
const progressBar = document.querySelector(".progress-bar");
const cursorGlow = document.querySelector(".cursor-glow");
const heroVideo = document.querySelector(".hero-video");
const breakVideo = document.querySelector(".break-video");
const heroContent = document.querySelector(".hero-content");
const typeSequence = "Data Scientist | AI Enthusiast | Creator";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
const smallViewportQuery = window.matchMedia("(max-width: 640px)");
let isCoarsePointer = coarsePointerQuery.matches;
let isSmallViewport = smallViewportQuery.matches;
let isMobileExperience = isCoarsePointer || isSmallViewport;
let resizeRefreshFrame = null;
let mobileRevealObserver = null;

function syncViewportState() {
  isCoarsePointer = coarsePointerQuery.matches;
  isSmallViewport = smallViewportQuery.matches;
  isMobileExperience = isCoarsePointer || isSmallViewport;
}

function applyExperienceMode() {
  document.body.classList.toggle("mobile-view", isMobileExperience);
  document.documentElement.style.scrollBehavior = isMobileExperience ? "smooth" : "";
}

function safeSetVisible(selectors) {
  document.querySelectorAll(selectors).forEach((element) => {
    element.style.opacity = "1";
    element.style.transform = "none";
  });
}

function startTyping(text, speed = 70) {
  let index = 0;
  const tick = () => {
    typingTarget.textContent = text.slice(0, index);
    index += 1;
    if (index <= text.length) {
      window.setTimeout(tick, speed);
    }
  };
  tick();
}

function initLoaderAnimation() {
  if (!loader) {
    startTyping(typeSequence, 35);
    return;
  }

  if (reduceMotion) {
    loader.style.display = "none";
    if (hasGSAP) {
      gsap.set([".hero-name", ".eyebrow", ".hero-title", ".hero-description", ".scroll-indicator"], { opacity: 1, y: 0 });
    } else {
      safeSetVisible(".hero-name, .eyebrow, .hero-title, .hero-description, .scroll-indicator");
    }
    startTyping(typeSequence, 35);
    return;
  }

  if (!hasGSAP) {
    loader.style.display = "none";
    safeSetVisible(".hero-name, .eyebrow, .hero-title, .hero-description, .scroll-indicator");
    startTyping(typeSequence, 45);
    return;
  }

  if (isMobileExperience) {
    const mobileTimeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        loader.style.display = "none";
        startTyping(typeSequence, 42);
      }
    });

    mobileTimeline
      .set(".hero-video", {
        opacity: 0.98,
        scale: 1.03,
        filter: "saturate(1.02) contrast(1.02) brightness(0.9)"
      })
      .fromTo(".hero-name", { opacity: 0, y: 18 }, {
        opacity: 1,
        y: 0,
        duration: 0.72
      }, 0.1)
      .fromTo(".eyebrow, .hero-title, .hero-description, .scroll-indicator", {
        opacity: 0,
        y: 16
      }, {
        opacity: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.06
      }, 0.18)
      .to(".page-loader", { opacity: 0, duration: 0.38 }, 0.52);

    return;
  }

  const glitchLayers = gsap.utils.toArray(".loader-glitch span");
  const timeline = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      loader.style.display = "none";
      startTyping(typeSequence);
    }
  });

  timeline
    .fromTo(".hero-video", { opacity: 0, scale: 1.24, filter: "saturate(1.12) contrast(1.08) brightness(0.2)" }, {
      opacity: 0.98,
      scale: 1.12,
      filter: "saturate(1.12) contrast(1.08) brightness(0.84)",
      duration: 2.1
    }, 0.1)
    .fromTo(".hero-overlay", { opacity: 1 }, { opacity: 1, duration: 1.4 }, 0.3)
    .fromTo(glitchLayers, { x: 0, opacity: 1, skewX: 0, scale: 1 }, {
      x: (index) => index % 2 === 0 ? -10 : 10,
      opacity: 0,
      skewX: (index) => index % 2 === 0 ? -14 : 14,
      scale: 0.96,
      stagger: 0.04,
      duration: 0.58
    }, 0.82)
    .fromTo(".hero-name", { opacity: 0, y: 28, scale: 0.98, filter: "blur(16px)" }, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.1
    }, 0.95)
    .fromTo(".eyebrow, .hero-title, .hero-description, .scroll-indicator", {
      opacity: 0,
      y: 28
    }, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.08
    }, 1.15)
    .to(".page-loader", { opacity: 0, duration: 0.85 }, 1.95);
}

function initProgressIndicator() {
  if (!progressBar) {
    return;
  }

  let ticking = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    ticking = false;
  };

  updateProgress();
  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
}

function initCursorGlow() {
  if (!cursorGlow || isCoarsePointer || !hasGSAP) {
    if (cursorGlow) {
      cursorGlow.style.display = "none";
    }
    return;
  }

  const xTo = gsap.quickTo(cursorGlow, "x", { duration: 0.22, ease: "power3.out" });
  const yTo = gsap.quickTo(cursorGlow, "y", { duration: 0.22, ease: "power3.out" });

  window.addEventListener("pointermove", (event) => {
    xTo(event.clientX);
    yTo(event.clientY);
  });
}

function initRevealAnimations() {
  const revealTargets = ".story-section .reveal-up, .skills-section .reveal-up, .projects-section .reveal-up, .contact-section .reveal-up, .story-line, .skill-spotlight, .skill-card, .experience-item";

  if (!hasGSAP || !hasScrollTrigger) {
    safeSetVisible(revealTargets);
    return;
  }

  if (reduceMotion) {
    gsap.set(revealTargets, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
    return;
  }

  if (isMobileExperience) {
    const elements = gsap.utils.toArray(revealTargets);
    if (!("IntersectionObserver" in window)) {
      gsap.set(elements, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(elements, {
      opacity: 0,
      y: 22
    });

    mobileRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        gsap.to(entry.target, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          overwrite: "auto"
        });

        mobileRevealObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    elements.forEach((element) => {
      mobileRevealObserver.observe(element);
    });

    return;
  }

  gsap.utils.toArray(".reveal-up").forEach((element) => {
    gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 1.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 88%"
      }
    });
  });

  gsap.utils.toArray(".story-line").forEach((line) => {
    gsap.fromTo(line, {
      opacity: 0.18,
      scale: 0.92,
      y: 80
    }, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: line,
        start: "top 86%",
        end: "center 60%",
        scrub: 1.2
      }
    });
  });

  gsap.fromTo(".story-lines", {
    y: 24
  }, {
    y: -8,
    ease: "none",
    scrollTrigger: {
      trigger: ".story-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.utils.toArray(".experience-item").forEach((item) => {
    const main = item.querySelectorAll(".experience-main > *");
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 88%"
      }
    });

    timeline
      .fromTo(item, {
        opacity: 0,
        y: 28
      }, {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: "power3.out"
      })
      .fromTo(main, {
        opacity: 0,
        y: 18
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.06,
        duration: 0.42
      }, 0.08);
  });

  gsap.utils.toArray(".skill-spotlight, .skill-card").forEach((item, index) => {
    gsap.fromTo(item, {
      opacity: 0,
      y: 30
    }, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: "power3.out",
      delay: index % 2 === 0 ? 0 : 0.05,
      scrollTrigger: {
        trigger: item,
        start: "top 88%"
      }
    });
  });
}

function initResponsiveHandlers() {
  window.addEventListener("resize", () => {
    const previousMobileState = isMobileExperience;
    syncViewportState();
    applyExperienceMode();

    if (resizeRefreshFrame) {
      window.cancelAnimationFrame(resizeRefreshFrame);
    }

    resizeRefreshFrame = window.requestAnimationFrame(() => {
      resizeRefreshFrame = null;

      if (previousMobileState !== isMobileExperience) {
        reinitializeResponsiveAnimations();
        return;
      }

      if (hasScrollTrigger) {
        ScrollTrigger.refresh();
      }
    });
  }, { passive: true });
}

function initParallaxMoments() {
  if (reduceMotion || isMobileExperience || !hasGSAP || !hasScrollTrigger || !heroContent) {
    return;
  }

  gsap.to(heroContent, {
    yPercent: 6,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  });

  if (!isMobileExperience) {
    gsap.to(".hero-video", {
      scale: 1.03,
      yPercent: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 0.8
      }
    });
  }

  gsap.to(".hero-overlay", {
    opacity: 0.82,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 0.8
    }
  });

  gsap.to(".break-video", {
    scale: 1.05,
    yPercent: -1.5,
    ease: "none",
    scrollTrigger: {
      trigger: ".break-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8
    }
  });
}

function initTiltCards() {
  return;
}

function initVideoPlayback() {
  [heroVideo, breakVideo].forEach((video) => {
    if (!video) {
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.disablePictureInPicture = true;
    video.style.transform = "translateZ(0)";
    if (isCoarsePointer || isSmallViewport) {
      video.preload = video === heroVideo ? "auto" : "metadata";
    }

    if (video === breakVideo && isMobileExperience && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
              playPromise.catch(() => {});
            }
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(video);
      return;
    }

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });
}

function initSectionTransitions() {
  if (reduceMotion || isMobileExperience || !hasGSAP || !hasScrollTrigger) {
    return;
  }

  gsap.utils.toArray("section").forEach((section) => {
    gsap.fromTo(section, {
      opacity: 0.92
    }, {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        end: "top 48%",
        scrub: 0.6
      }
    });
  });
}

function initMobileOptimizations() {
  syncViewportState();
  applyExperienceMode();

  if (!isMobileExperience) {
    return;
  }
}

function clearResponsiveAnimationState() {
  if (mobileRevealObserver) {
    mobileRevealObserver.disconnect();
    mobileRevealObserver = null;
  }

  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  if (!hasGSAP) {
    return;
  }

  gsap.set([
    ".story-section .reveal-up",
    ".skills-section .reveal-up",
    ".projects-section .reveal-up",
    ".contact-section .reveal-up",
    ".story-line",
    ".skill-spotlight",
    ".skill-card",
    ".experience-item",
    ".hero-content",
    ".hero-video",
    ".hero-overlay",
    ".break-video"
  ], {
    clearProps: "transform,opacity"
  });
}

function initResponsiveAnimations() {
  initRevealAnimations();
  initParallaxMoments();
  initSectionTransitions();

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

function reinitializeResponsiveAnimations() {
  clearResponsiveAnimationState();
  initResponsiveAnimations();
}

initVideoPlayback();
initMobileOptimizations();
initLoaderAnimation();
initProgressIndicator();
initCursorGlow();
initResponsiveAnimations();
initTiltCards();
initResponsiveHandlers();
