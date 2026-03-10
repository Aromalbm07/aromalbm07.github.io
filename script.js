/**
 * Portfolio Interactive Scripts
 * Handles animations, scrolling, parallax, and UI interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Navigation Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link, .nav-btn');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // 2. Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // Sticky Nav
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active Link Highlighting
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    if (window.scrollY >= (sectionTop - 200)) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${current}`) {
                        item.classList.add('active');
                    }
                });
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset so it triggers right before coming into full view
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed (uncomment below for one-time reveal)
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Trigger Intro Animations on Load
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-content.reveal-left, .hero-visual.reveal-right');
        heroElements.forEach(el => el.classList.add('active'));
    }, 100);

    // 5. Mouse Move Parallax Effect for Hero Elements
    // Disabled on touch/mobile devices — use gyroscope or skip entirely
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 992;

    if (!isTouchDevice) { // Only apply parallax on non-touch, large screens
        const parallaxElements = document.querySelectorAll('.parallax-element');
        const heroSection = document.querySelector('.hero-section');
        heroSection.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2);
            const y = (e.clientY - window.innerHeight / 2);

            parallaxElements.forEach(el => {
                const speed = el.getAttribute('data-speed');
                const xPos = x * speed;
                const yPos = y * speed;
                
                if (el.classList.contains('portrait-image')) {
                     el.style.transform = `translate(${xPos}px, ${yPos}px)`;
                } else if (el.classList.contains('badge-1')) {
                     el.style.transform = `translate(${xPos}px, calc(-15px + ${yPos}px))`;
                } else if (el.classList.contains('badge-2')) {
                     el.style.transform = `translate(${xPos}px, calc(15px + ${yPos}px))`;
                }
            });
        });

        // Reset positions when mouse leaves the hero section
        heroSection.addEventListener('mouseleave', () => {
             parallaxElements.forEach(el => {
                 el.style.transform = 'translate(0, 0)';
             });
        });
    }

    // 6. Initialize Particles.js Background
    // Skipped on mobile/touch devices to save CPU and battery
    const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window);
    if (typeof particlesJS !== 'undefined' && !isMobile) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 40,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#00f0ff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#bb00ff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 200,
                        "line_linked": {
                            "opacity": 0.6
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
});
