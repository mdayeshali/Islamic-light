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
    // Relative path used for GitHub Pages / any folder compatibility
    const headerReq = await fetch("./header.html");
    const footerReq = await fetch("./footer.html");

    if (!headerReq.ok || !footerReq.ok) {
      throw new Error("Header or Footer file not found.");
    }

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

// Call header & footer loader immediately
loadPartials();


/* -------------------------------------------------------
   2) MOBILE NAV MENU
--------------------------------------------------------- */
function initNavMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const overlay = document.getElementById("overlay"); 

  if (!menuBtn || !mobileNav || !overlay) return;

  const closeMenu = () => {
    mobileNav.classList.remove("open"); 
    overlay.classList.remove("visible"); 
    menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
  };

  menuBtn.addEventListener("click", () => {
    const isOpening = mobileNav.classList.toggle("open");

    if (isOpening) {
        overlay.classList.add("visible"); 
        menuBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    } else {
        overlay.classList.remove("visible"); 
        menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    }
  });

  overlay.addEventListener("click", closeMenu);
  
  mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
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
    themeBtn.innerHTML = savedTheme === "dark" 
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
  } else {
    themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
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
   6) SHARE BUTTON FUNCTIONS
--------------------------------------------------------- */
function toggleShareMenu() {
    let menu = document.getElementById("share-menu");
    if(menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
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


/* -------------------------------------------------------
   7) PWA APP INSTALL LOGIC
--------------------------------------------------------- */
let deferredPrompt;

// PWA Event Catching
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Load event ensuring button click listener is registered after HTML loads
document.addEventListener('DOMContentLoaded', () => {
  const installBtn = document.getElementById('pwaInstallBtn');

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      } else {
        alert("ইসলামিক লাইট অ্যাপটি ইনস্টল করতে ব্রাউজারের ওপরের ৩টি বিন্দু (Menu/3-dots) অপশনে চাপ দিয়ে 'Add to Home screen' বা 'Install app'-এ ক্লিক করুন।");
      }
    });
  }

  // Hide button if opened as standalone app
  if (window.matchMedia('(display-mode: standalone)').matches) {
    if (installBtn) installBtn.style.display = 'none';
  }
});

// Hide button when installed
window.addEventListener('appinstalled', () => {
  const installBtn = document.getElementById('pwaInstallBtn');
  if (installBtn) installBtn.style.display = 'none';
});
   
