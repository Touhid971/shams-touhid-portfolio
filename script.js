// ===================================
// SHAMS TOUHID - PORTFOLIO JAVASCRIPT
// ===================================


// ===================================
// 1. RESPONSIVE NAVIGATION
// ===================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navbar = document.querySelector(".navbar");

function setMenuState(open) {
    if (!menuToggle || !mainNav) return;

    mainNav.classList.toggle("open", open);
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
    );
}

if (menuToggle && mainNav) {
    // Toggle the mobile menu.
    menuToggle.addEventListener("click", (event) => {
        event.preventDefault();

        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    // Close the mobile menu when clicking outside it.
    document.addEventListener("click", (event) => {
        if (
            mainNav.classList.contains("open") &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    // Close the mobile menu with Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    // Reset the menu when returning to desktop layout.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            setMenuState(false);
        }
    });
}


// ===================================
// 2. ACTIVE NAVIGATION
// ===================================

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll("#mainNav a[href^='#']");
let currentActiveId = "";

function updateActiveNavigation(sectionId) {
    if (!sectionId || currentActiveId === sectionId) return;

    currentActiveId = sectionId;

    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${sectionId}`;
        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}


// ===================================
// 3. INSTANT SAME-PAGE NAVIGATION
// ===================================

// Handle internal links ourselves so section changes do not use smooth
// scrolling. This also accounts for the sticky header on desktop and mobile.
document.addEventListener("click", (event) => {
    // Keep normal browser behavior for modified clicks and non-left clicks.
    if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
    ) {
        return;
    }

    const link = event.target.closest("a[href^='#']");
    if (!link) return;

    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    let targetId;
    try {
        targetId = decodeURIComponent(hash.slice(1));
    } catch {
        return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();

    // Close the mobile menu before moving to the destination.
    if (mainNav && mainNav.contains(link)) {
        setMenuState(false);
    }

    // Reveal destination content immediately so it is not hidden while
    // the browser is moving to the selected section.
    target.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("visible");
    });

    const headerOffset = navbar ? navbar.offsetHeight : 0;
    const destinationTop = Math.max(
        0,
        Math.round(
            window.scrollY + target.getBoundingClientRect().top - headerOffset
        )
    );

    // CSS sets scroll-behavior to auto, so this is an immediate jump.
    window.scrollTo(0, destinationTop);

    // Keep the URL shareable and update the active navigation state.
    if (window.location.hash !== hash) {
        try {
            window.history.pushState(null, "", hash);
        } catch (error) {
            // Some local file previews block history updates; the jump still works.
        }
    }

    updateActiveNavigation(targetId);
});


// ===================================
// 4. SCROLL REVEAL ANIMATION
// ===================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.05,
            rootMargin: "0px 0px 50px 0px"
        }
    );

    revealElements.forEach((element) => {
        observerSafeObserve(revealObserver, element);
    });
} else {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
}

function observerSafeObserve(observer, element) {
    // Elements already revealed by a navigation click need no observation.
    if (!element.classList.contains("visible")) {
        observer.observe(element);
    }
}


// ===================================
// 5. ACTIVE SECTION TRACKING WHILE SCROLLING
// ===================================

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            const visibleSections = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => {
                    return a.boundingClientRect.top - b.boundingClientRect.top;
                });

            if (visibleSections.length > 0) {
                updateActiveNavigation(visibleSections[0].target.id);
            }
        },
        {
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
}


// ===================================
// 6. INITIAL ACTIVE NAVIGATION STATE
// ===================================

const initialSectionId = window.location.hash
    ? window.location.hash.slice(1)
    : "home";

if (document.getElementById(initialSectionId)) {
    updateActiveNavigation(initialSectionId);
}
