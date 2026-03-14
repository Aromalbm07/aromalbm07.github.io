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
const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

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

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
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
  if (!hasGSAP || !hasScrollTrigger) {
    safeSetVisible(".reveal-up");
    safeSetVisible(".story-line");
    safeSetVisible(".experience-item");
    return;
  }

  if (reduceMotion) {
    gsap.set([".reveal-up", ".story-line", ".experience-item"], { clearProps: "all", opacity: 1, y: 0, scale: 1 });
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
}

function initHorizontalSkills() {
  const strip = document.querySelector(".skills-strip");
  const skillsSection = document.querySelector(".skills-section");
  if (!strip || !skillsSection) {
    return;
  }

  if (!hasGSAP || !hasScrollTrigger) {
    strip.style.transform = "none";
    return;
  }

  if (reduceMotion || window.innerWidth < 900) {
    gsap.set(strip, { x: 0, clearProps: "transform" });
    return;
  }

  const getDistance = () => Math.max(0, strip.scrollWidth - window.innerWidth);

  gsap.to(strip, {
    x: () => -getDistance(),
    ease: "none",
    scrollTrigger: {
      trigger: skillsSection,
      start: "top top",
      end: () => `+=${getDistance() + window.innerHeight * 0.45}`,
      scrub: 0.8,
      pin: true,
      invalidateOnRefresh: true
    }
  });
}

function initParallaxMoments() {
  if (reduceMotion || !hasGSAP || !hasScrollTrigger || !heroContent) {
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
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  });
}

function initSectionTransitions() {
  if (reduceMotion || !hasGSAP || !hasScrollTrigger) {
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

initVideoPlayback();
initLoaderAnimation();
initProgressIndicator();
initCursorGlow();
initRevealAnimations();
initHorizontalSkills();
initParallaxMoments();
initTiltCards();
initSectionTransitions();

if (hasScrollTrigger) {
  ScrollTrigger.refresh();
}
