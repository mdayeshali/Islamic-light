/* =======================================================
 🌙 Islamic Light — Global JavaScript
 Author: Md Ayesh Ali
 Website: IslamicLight.in
========================================================= */

/* -------------------------------------------------------
   1) AUTO-LOAD HEADER & FOOTER (Works in any folder)
--------------------------------------------------------- */
async function loadPartials() {
  try {
    // Always load from root folder
    const headerReq = await fetch("/header.html");
    const footerReq = await fetch("/footer.html");

    const headerHTML = await headerReq.text();
    const footerHTML = await footerReq.text();

    // Insert Header at top
    document.body.insertAdjacentHTML("afterbegin", headerHTML);

    // Insert Footer at bottom
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    initNavMenu();       // Mobile menu
    initThemeToggle();   // Dark/Light mode
  } catch (err) {
    console.error("Header/Footer loading failed:", err);
  }
}

// Call immediately
loadPartials();



/* -------------------------------------------------------
   2) MOBILE NAV MENU
--------------------------------------------------------- */
function initNavMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    menuBtn.innerHTML = mobileNav.classList.contains("active")
      ? `<i class="fa-solid fa-xmark"></i>`
      : `<i class="fa-solid fa-bars"></i>`;
  });
}



/* -------------------------------------------------------
   3) DARK / LIGHT THEME SWITCH
--------------------------------------------------------- */
function initThemeToggle() {
  const themeBtn = document.getElementById("themeToggle");
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem("islamicTheme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");

    if (current === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("islamicTheme");
      themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("islamicTheme", "dark");
      themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }
  });
}



/* -------------------------------------------------------
   4) PAGE FADE-IN ANIMATION
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in").forEach((el) => {
    el.classList.add("active");
  });
});


/* -------------------------------------------------------
   5) FORM SUCCESS MESSAGE (Contact Page)
--------------------------------------------------------- */
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("success")) {
  setTimeout(() => {
    alert("✔ আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! ধন্যবাদ ❤️");
  }, 400);
}


/* -------------------------------------------------------
   share bottun
--------------------------------------------------------- */
function toggleShareMenu() {
    let menu = document.getElementById("share-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://api.whatsapp.com/send?text=${url}`, "_blank");
}

function shareToYouTube() {
    alert("🔴 YouTube-এ আর্টিকেল শেয়ার করার আলাদা অপশন নেই।\nআপনি Copy Link ব্যবহার করে পোস্টে পেস্ট করতে পারবেন।");
}

function copyArticleLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 লিংক কপি হয়েছে!");
}
