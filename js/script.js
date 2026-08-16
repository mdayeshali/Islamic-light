/* =======================================================
 🌙 Islamic Light — Global JavaScript
 Author: Md Ayesh Ali
 Website: IslamicLight.in
========================================================= */

// PWA Install Prompt Variable
let deferredPrompt = null;

// ১. পেজ লোডের শুরুতেই PWA ইভেন্ট ক্যাপচার করা
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('✅ PWA Install Prompt প্রস্তুত');

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

    // হেডার-ফুটার DOM-এ বসার পর প্রয়োজনীয় ফাংশন চালু করা
    initNavMenu();       
    initThemeToggle();   
    initInstallBtn();    // ইনস্টল বাটন ইনিশিয়ালাইজেশন
  } catch (err) {
    console.error("Header/Footer loading failed:", err);
  }
}

// Call Header & Footer immediately
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
   4) PAGE FADE-IN ANIMATION & URL PARAMS
--------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".fade-in").forEach((el) => {
    el.classList.add("active");
  });
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("success")) {
  setTimeout(() => {
    alert("✔ আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে! ধন্যবাদ ❤️");
  }, 400);
}


/* -------------------------------------------------------
   5) SHARE BUTTON FUNCTIONS
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
   6) PWA APP INSTALL LOGIC
--------------------------------------------------------- */
function initInstallBtn() {
  const installBtn = document.getElementById('pwaInstallBtn');
  const installContainer = document.getElementById('pwaInstallContainer');

  if (!installBtn) return;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true || 
                       navigator.userAgent.includes("IslamicLightApp");

  if (isStandalone) {
    if (installContainer) installContainer.style.display = 'none';
    else installBtn.style.display = 'none';
    return;
  }

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

  if (typeof gtag === 'function') {
    gtag('event', 'pwa_installed', {
      'event_category': 'App Install',
      'event_label': 'Islamic Light PWA'
    });
  }
});


/* =======================================================
   🌙 7) ISLAMIC & BENGALI CALENDAR SYSTEM
========================================================= */

// সংখ্যাকে বাংলায় রূপান্তর
function toBnNum(n) {
  const bn = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
  return n.toString().replace(/\d/g, d => bn[d]);
}

// হিজরি ১২টি মাসের নাম
const hijriMonthsBn = [
  "মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি",
  "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শাবান",
  "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ"
];

// হিজরী তারিখ কনভার্টার
function getHijriData(date) {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    
    const parts = fmt.formatToParts(date);
    let hDay = 1, hMonth = 1, hYear = 1448;

    parts.forEach(p => {
      if (p.type === 'day') hDay = parseInt(p.value, 10);
      if (p.type === 'month') hMonth = parseInt(p.value, 10);
      if (p.type === 'year') hYear = parseInt(p.value.replace(/[^0-9]/g, ''), 10);
    });

    return {
      day: toBnNum(hDay),
      monthName: hijriMonthsBn[hMonth - 1] || "রবিউল আউয়াল",
      year: toBnNum(hYear)
    };
  } catch (e) {
    return { day: "৩", monthName: "রবিউল আউয়াল", year: "১৪৪৮" };
  }
}

// বাংলা মাসের হিসাব
function getBengaliDate(date) {
  const banglaMonths = [
    "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
    "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
  ];
  
  const d = date.getDate();
  const m = date.getMonth();
  const y = date.getFullYear();

  let bDay, bMonthIndex, bYear;
  bYear = (m < 3 || (m === 3 && d < 14)) ? y - 594 : y - 593;

  const startDay = [14, 15, 15, 16, 16, 16, 17, 16, 15, 14, 13, 14];
  const daysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

  if (d >= startDay[m]) {
    bDay = d - startDay[m] + 1;
    bMonthIndex = (m + 8) % 12;
  } else {
    let prevM = (m - 1 + 12) % 12;
    bDay = daysInMonth[prevM] - (startDay[m] - d - 1);
    bMonthIndex = (m + 7) % 12;
  }

  return `${toBnNum(bDay)} ${banglaMonths[bMonthIndex]}, ${toBnNum(bYear)}`;
}

let viewDate = new Date();

function initIslamicCalendar() {
  const today = new Date();
  const hijri = getHijriData(today);

  // মিনি কার্ডে ডাটা সেট করা
  const elHDay = document.getElementById('hijriDay');
  const elHMonth = document.getElementById('hijriMonth');
  const elHYear = document.getElementById('hijriYear');
  const elGreg = document.getElementById('gregorianDate');
  const elBen = document.getElementById('bengaliDate');

  if (elHDay) elHDay.innerText = hijri.day;
  if (elHMonth) elHMonth.innerText = hijri.monthName;
  if (elHYear) elHYear.innerText = `${hijri.year} হিজরি`;

  const engMonthsBn = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  if (elGreg) {
    elGreg.innerText = `${toBnNum(today.getDate())} ${engMonthsBn[today.getMonth()]}, ${toBnNum(today.getFullYear())}`;
  }
  if (elBen) {
    elBen.innerText = getBengaliDate(today);
  }

  setupModalEvents();
}

function renderMonthGrid(targetDate) {
  const grid = document.getElementById('calDaysGrid');
  const modalTitle = document.getElementById('modalHijriMonth');
  const modalSubTitle = document.getElementById('modalSubTitle');
  if (!grid) return;

  grid.innerHTML = '';

  const y = targetDate.getFullYear();
  const m = targetDate.getMonth();
  
  const firstDayIndex = new Date(y, m, 1).getDay();
  const totalDays = new Date(y, m + 1, 0).getDate();
  const today = new Date();

  const midDateHijri = getHijriData(new Date(y, m, 15));
  const engMonthsBn = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
  
  if (modalTitle) modalTitle.innerText = `${midDateHijri.monthName} ${midDateHijri.year} হিজরি`;
  if (modalSubTitle) modalSubTitle.innerText = `${engMonthsBn[m]} ${toBnNum(y)}`;

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-cell empty';
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= totalDays; day++) {
    const cellDate = new Date(y, m, day);
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    const cellHijri = getHijriData(cellDate);

    if (
      cellDate.getDate() === today.getDate() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getFullYear() === today.getFullYear()
    ) {
      cell.classList.add('today');
    }

    cell.innerHTML = `
      <span>${cellHijri.day}</span>
      <span class="eng-sub">${toBnNum(day)}</span>
    `;

    grid.appendChild(cell);
  }
}

function setupModalEvents() {
  const cardBtn = document.getElementById('openCalendarBtn');
  const modal = document.getElementById('calModalOverlay');
  const closeBtn = document.getElementById('closeCalModalBtn');
  const prevBtn = document.getElementById('prevMonthBtn');
  const nextBtn = document.getElementById('nextMonthBtn');

  if (!cardBtn || !modal) return;

  cardBtn.addEventListener('click', () => {
    viewDate = new Date();
    renderMonthGrid(viewDate);
    modal.classList.add('active');
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      renderMonthGrid(viewDate);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      renderMonthGrid(viewDate);
    });
  }
}

// DOM লোড হলে ক্যালেন্ডার ইনিশিয়ালাইজ করা
document.addEventListener('DOMContentLoaded', () => {
  initIslamicCalendar();
});
       
