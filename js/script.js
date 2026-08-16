/* =======================================================
 🌙 Islamic Light — Global JavaScript
 Author: Md Ayesh Ali
 Website: IslamicLight.in
========================================================= */

// PWA Install Prompt Variable (একবার ডিক্লেয়ার করা হয়েছে)
let deferredPrompt = null;

// ১. পেজ লোডের শুরুতেই ব্রাউজারের ইনস্টল ইভেন্ট ক্যাপচার করা
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('✅ PWA Install Prompt প্রস্তুত');

  // ইনস্টল কন্টেইনার থাকলে দৃশ্যমান করা
  const installContainer = document.getElementById('pwaInstallContainer');
  if (installContainer && !window.matchMedia('(display-mode: standalone)').matches) {
    installContainer.style.display = 'flex';
  }
});


/* -------------------------------------------------------
   1) AUTO-LOAD HEADER & FOOTER
--------------------------------------------------------- */
async function loadPartials() {
  try {
    const headerReq = await fetch("/header.html");
    const footerReq = await fetch("/footer.html");

    if (!headerReq.ok || !footerReq.ok) {
      throw new Error("Header or Footer file not found.");
    }

    const headerHTML = await headerReq.text();
    const footerHTML = await footerReq.text();

    // Insert Header & Footer
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
    document.body.insertAdjacentHTML("beforeend", footerHTML);

    // হেডার-ফুটার পেজে বসার পর সব প্রয়োজনীয় ফাংশন চালু করা
    initNavMenu();       
    initThemeToggle();   
    initInstallBtn();    // ইনস্টল বাটন ইনিশিয়ালাইজেশন
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
function initInstallBtn() {
  const installBtn = document.getElementById('pwaInstallBtn');
  const installContainer = document.getElementById('pwaInstallContainer');

  if (!installBtn) return;

  // অলরেডি ইনস্টল করা অ্যাপ (Standalone Mode) হলে কন্টেইনার সম্পূর্ণ হাইড রাখা
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true || 
                       navigator.userAgent.includes("IslamicLightApp");

  if (isStandalone) {
    if (installContainer) installContainer.style.display = 'none';
    else installBtn.style.display = 'none';
    return;
  }

  // বাটনে ক্লিক হ্যান্ডলার
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);

      if (outcome === 'accepted') {
        if (installContainer) installContainer.style.display = 'none';
        else installBtn.style.display = 'none';
      }
      deferredPrompt = null;
    } else {
      alert("📲 ইসলামিক লাইট অ্যাপটি ইনস্টল করতে:\n\n১. ব্রাউজারের ওপরের ডানপাশের ৩টি বিন্দু (Menu / 3-dots) অপশনে ক্লিক করুন।\n২. এরপর 'Install app' বা 'Add to Home screen' অপশনে চাপ দিন।\n\n(Safari ব্রাউজারে 'Share' আইকন থেকে 'Add to Home Screen' চাপুন)");
    }
  });
}

// অ্যাপ ইনস্টল সম্পন্ন হলে ইভেন্ট ও ট্র্যাকিং
window.addEventListener('appinstalled', () => {
  const installContainer = document.getElementById('pwaInstallContainer');
  const btn = document.getElementById('pwaInstallBtn');
  
  if (installContainer) {
    installContainer.style.display = 'none';
  } else if (btn) {
    btn.style.display = 'none';
  }

  deferredPrompt = null;
  console.log('🎉 ইসলামিক লাইট অ্যাপ সফলভাবে ইনস্টল হয়েছে!');

  // Google Analytics (GA4) Custom Event
  if (typeof gtag === 'function') {
    gtag('event', 'pwa_installed', {
      'event_category': 'App Install',
      'event_label': 'Islamic Light PWA'
    });
  }
});
