
// ===================================
// RESPONSIVE NAVIGATION
// ===================================

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

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

    // Hamburger button
    menuToggle.addEventListener("click", (event) => {
        event.preventDefault();

        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        setMenuState(!isOpen);
    });

    // Navigation links
    mainNav.addEventListener("click", (event) => {
        const link = event.target.closest("a");

        if (link && mainNav.contains(link)) {
            setMenuState(false);
        }
    });

    // Close when clicking outside
    document.addEventListener("click", (event) => {
        if (
            mainNav.classList.contains("open") &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            setMenuState(false);
        }
    });

    // Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
        }
    });

    // Close when switching to desktop
    window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
            setMenuState(false);
        }
    });
}


// ===================================
// SCROLL REVEAL
// ===================================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver((entries, observer) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach((element) => {
        observer.observe(element);
    });

} else {

    revealElements.forEach((element) => {
        element.classList.add("visible");
    });

}


// ===================================
// ACTIVE NAVIGATION ON SCROLL
// ===================================

const sections = document.querySelectorAll(
    "section[id], header[id]"
);

const navLinks = document.querySelectorAll(
    "#mainNav a[href^='#']"
);

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navLinks.forEach((link) => {

                        const isActive =
                            link.getAttribute("href") === `#${currentId}`;

                        link.classList.toggle("active", isActive);

                        if (isActive) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }

                    });
                }

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

}
