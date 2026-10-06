/* =========================================
   Islamic Light — 3D Carousel Slider
   Auto-slide (6s), Touch Swipe & Dot Navigation
   Author: Md Ayesh Ali
   ========================================= */

(function () {
  "use strict";

  const JSON_URL = "/data/update.json";
  const BANNER_HTML_URL = "/includes/update-banner.html";
  const AUTO_TIME = 6000; // প্রতি ৬ সেকেন্ড পর পর পরিবর্তন হবে

  let updates = [];
  let currentIndex = 0;
  let timer = null;

  // Touch Swipe ভ্যারিয়েবল
  let touchStartX = 0;
  let touchEndX = 0;

  async function initCarousel() {
    const box = document.getElementById("heroUpdateBox");
    if (!box) return;

    try {
      const [htmlRes, jsonRes] = await Promise.all([
        fetch(BANNER_HTML_URL),
        fetch(JSON_URL)
      ]);

      if (!htmlRes.ok || !jsonRes.ok) return;

      box.innerHTML = await htmlRes.text();
      const data = await jsonRes.json();
      updates = Array.isArray(data) ? data : (data.updates || []);

      if (updates.length === 0) return;

      buildCards();
      buildDots();
      updateCarouselPositions();
      setupEvents();
      setupTouchSwipe();
      startAuto();
    } catch (e) {
      console.error("Carousel loading error:", e);
    }
  }

  // ডাইনামিক কার্ড তৈরি
  function buildCards() {
    const track = document.getElementById("carouselTrack");
    if (!track) return;
    track.innerHTML = "";

    updates.forEach((item, idx) => {
      const card = document.createElement("div");
      card.className = "c-card";
      card.onclick = () => {
        if (currentIndex !== idx) {
          currentIndex = idx;
          updateCarouselPositions();
          restartAuto();
        }
      };

      const iconHTML = item.icon && item.icon.includes("fa-")
        ? `<i class="${item.icon}"></i>`
        : (item.icon || "✦");

      card.innerHTML = `
        <div class="c-icon">${iconHTML}</div>
        <div class="c-content">
          <div class="c-top">
            <span class="c-badge">${item.badge || "আপডেট"}</span>
            <span class="c-date">${item.date || ""}</span>
          </div>
          <h3 class="c-title">${item.title || ""}</h3>
          <p class="c-desc">${item.description || ""}</p>
          <a href="${item.link || '#'}" class="c-btn">${item.buttonText || "দেখুন"} →</a>
        </div>
      `;
      track.appendChild(card);
    });
  }

  // ৩D পজিশন ও ডট অ্যাক্টিভ আপডেট
  function updateCarouselPositions() {
    const cards = document.querySelectorAll(".c-card");
    const total = cards.length;

    cards.forEach((card, idx) => {
      card.classList.remove("active", "prev-card", "next-card", "hidden");

      if (idx === currentIndex) {
        card.classList.add("active");
      } else if (idx === (currentIndex - 1 + total) % total) {
        card.classList.add("prev-card");
      } else if (idx === (currentIndex + 1) % total) {
        card.classList.add("next-card");
      } else {
        card.classList.add("hidden");
      }
    });

    // ডট বাটন হাইলাইট
    const dots = document.querySelectorAll(".update-dot-item");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === currentIndex);
    });
  }

  // ডট বাটন তৈরি
  function buildDots() {
    const dotBox = document.getElementById("cDots");
    if (!dotBox) return;
    dotBox.innerHTML = "";

    updates.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "update-dot-item" + (i === 0 ? " active" : "");
      d.setAttribute("aria-label", `Slide ${i + 1}`);

      d.onclick = (e) => {
        e.stopPropagation();
        currentIndex = i;
        updateCarouselPositions();
        restartAuto();
      };

      dotBox.appendChild(d);
    });
  }

  // মাউস ও বাটন ইভেন্ট
  function setupEvents() {
    const prevBtn = document.getElementById("cPrev");
    const nextBtn = document.getElementById("cNext");
    const track = document.getElementById("carouselTrack");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + updates.length) % updates.length;
        updateCarouselPositions();
        restartAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % updates.length;
        updateCarouselPositions();
        restartAuto();
      });
    }

    // মাউস রাখলে অটো-স্লাইড পজ হবে, সরালে আবার শুরু হবে
    if (track) {
      track.addEventListener("mouseenter", stopAuto);
      track.addEventListener("mouseleave", startAuto);
    }
  }

  // হাত দিয়ে সোয়াইপ (Touch Swipe) লজিক
  function setupTouchSwipe() {
    const container = document.querySelector(".carousel-container");
    if (!container) return;

    container.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAuto();
    }, { passive: true });

    container.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
      startAuto();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const swipeDistance = touchStartX - touchEndX;
    const threshold = 40; // কত পিক্সেল সোয়াইপ করলে কার্যকর হবে

    if (swipeDistance > threshold) {
      // আঙুল দিয়ে বামে টানলে পরের স্লাইড
      currentIndex = (currentIndex + 1) % updates.length;
      updateCarouselPositions();
    } else if (swipeDistance < -threshold) {
      // আঙুল দিয়ে ডানে টানলে আগের স্লাইড
      currentIndex = (currentIndex - 1 + updates.length) % updates.length;
      updateCarouselPositions();
    }
  }

  // অটো-স্লাইড টাইমার
  function startAuto() {
    stopAuto();
    if (updates.length <= 1) return;
    timer = setInterval(() => {
      currentIndex = (currentIndex + 1) % updates.length;
      updateCarouselPositions();
    }, AUTO_TIME);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function restartAuto() {
    stopAuto();
    startAuto();
  }

  // স্ক্রিপ্ট শুরু
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
  } else {
    initCarousel();
  }
})();
                  
