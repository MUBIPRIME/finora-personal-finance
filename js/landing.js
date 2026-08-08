// ================================
// MOBILE MENU
// ================================

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", () => {

        navLinks.classList.toggle("show");

    });

}


// ================================
// CLOSE MOBILE MENU AFTER CLICK
// ================================

if (navLinks) {

    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("show");

        });

    });

}


// ================================
// THEME TOGGLE
// ================================

const themeBtn =
document.getElementById("themeToggle");

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        const isDark =
        document.documentElement.classList.toggle("dark");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        updateThemeIcon();

    });

}


// ================================
// THEME ICON
// ================================

function updateThemeIcon() {

    if (!themeBtn) return;

    const icon =
    themeBtn.querySelector("i");

    if (!icon) return;

    const isDark =
    document.documentElement.classList.contains("dark");

    if (isDark) {

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

    }

}


// ================================
// LOAD SAVED THEME
// ================================

const savedTheme =
localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.documentElement.classList.add("dark");

}

else {

    document.documentElement.classList.remove("dark");

}

updateThemeIcon();