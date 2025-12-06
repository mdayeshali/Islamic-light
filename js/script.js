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


    initNavMenu();       // Mobile menu (Updated for Dropdown + Overlay)
    initThemeToggle();   // Dark/Light mode
  } catch (err) {
    console.error("Header/Footer loading failed:", err);
  }
}


// Call immediately
loadPartials();






/* -------------------------------------------------------
   2) MOBILE NAV MENU (Updated for Dropdown and Overlay Close)
--------------------------------------------------------- */
function initNavMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  // নতুন: ফাঁকা জায়গায় ক্লিক ধরার জন্য ওভারলে আনুন
  const overlay = document.getElementById("overlay"); 


  if (!menuBtn || !mobileNav || !overlay) return;


  // মেনু বন্ধ করার ফাংশন
  const closeMenu = () => {
    // CSS-এ .open ক্লাস ব্যবহার করা হয়েছে
    mobileNav.classList.remove("open"); 
    // ওভারলে লুকানো
    overlay.classList.remove("visible"); 
    // মেনু বাটন আইকন স্বাভাবিক অবস্থায় ফিরিয়ে আনা
    menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
  };


  // মেনু খোলার বাটন ক্লিক ইভেন্ট
  menuBtn.addEventListener("click", () => {
    // .open ক্লাস টগল করা
    const isOpening = mobileNav.classList.toggle("open");

    if (isOpening) {
        // মেনু খুললে, ওভারলে দৃশ্যমান হবে
        overlay.classList.add("visible"); 
        // আইকন পরিবর্তন: মেনু খোলা অবস্থায় 'X'
        menuBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    } else {
        // মেনু বন্ধ হলে, ওভারলে লুকানো হবে
        overlay.classList.remove("visible"); 
        // আইকন পরিবর্তন: মেনু বন্ধ অবস্থায় 'বার্স' (☰)
        menuBtn.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    }
  });


  // ওভারলে ক্লিক ইভেন্ট: ফাঁকা জায়গায় ক্লিক করলে মেনু বন্ধ হবে
  overlay.addEventListener("click", closeMenu);
  
  // মেনুর ভেতরের লিংকে ক্লিক করলেও মেনু বন্ধ হবে (ঐচ্ছিক, কিন্তু ভালো UX-এর জন্য)
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
  
  // থিম সেভ করা থাকলে তা লোড করা
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    // সঠিক আইকন সেট করা
    themeBtn.innerHTML = savedTheme === "dark" 
      ? `<i class="fa-solid fa-sun"></i>`
      : `<i class="fa-solid fa-moon"></i>`;
  } else {
    // যদি সেভ করা না থাকে তবে ডিফল্ট আইকন সেট করা
    themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`;
  }


  themeBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");


    if (current === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("islamicTheme");
      themeBtn.innerHTML = `<i class="fa-solid fa-moon"></i>`; // Light mode icon
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("islamicTheme", "dark");
      themeBtn.innerHTML = `<i class="fa-solid fa-sun"></i>`; // Dark mode icon
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

