/* =========================================
   Islamic Light — 3D Carousel Slider
   Smooth Slow-Motion & Real-Time Finger Drag/Swipe
   Author: Md Ayesh Ali
   ========================================= */

(function () {
  "use strict";

  const JSON_URL = "/data/update.json";
  const BANNER_HTML_URL = "/includes/update-banner.html";
  const AUTO_TIME = 7500; // আরামদায়ক স্লো-মোশন দেখার জন্য ৭.৫ সেকেন্ড
  const TRANSITION_DURATION = 1400; // ১.৪ সেকেন্ড স্লো-মোশন লক

  let updates = [];
  let currentIndex = 0;
  let timer = null;
  let isTransitioning = false;

  // রিয়েল-টাইম টাচ/ড্র্যাগ ট্র্যাকিং ভ্যারিয়েবল
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let containerWidth = 0;

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
      setupRealtimeTouch();
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
      card.onclick = (e) => {
        // ড্র্যাগ করার সময় ক্লিক ইভেন্ট ব্লক রাখা
        if (Math.abs(currentX - startX) > 10) return;
        if (currentIndex !== idx && !isTransitioning) {
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

  // ৩D পজিশন ও ডট আপডেট (স্লো-মোশন ট্রানজিশন লকের সাথে)
  function updateCarouselPositions() {
    isTransitioning = true;
    const cards = document.querySelectorAll(".c-card");
    const total = cards.length;

    cards.forEach((card, idx) => {
      // ড্র্যাগ করার সময় দেওয়া ইনলাইন স্টাইল রিসেট করে CSS ক্লাসের পূর্ণ ট্রানজিশনে ফেরা
      card.style.transform = "";
      card.style.transition = "";

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

    // স্লো-মোশন শেষ হওয়া পর্যন্ত বাটন লক রাখা
    setTimeout(() => {
      isTransitioning = false;
    }, TRANSITION_DURATION);
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
        if (isTransitioning || currentIndex === i) return;
        currentIndex = i;
        updateCarouselPositions();
        restartAuto();
      };

      dotBox.appendChild(d);
    });
  }

  // বাটন ও হোভার ইভেন্ট
  function setupEvents() {
    const prevBtn = document.getElementById("cPrev");
    const nextBtn = document.getElementById("cNext");
    const track = document.getElementById("carouselTrack");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        currentIndex = (currentIndex - 1 + updates.length) % updates.length;
        updateCarouselPositions();
        restartAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (isTransitioning) return;
        currentIndex = (currentIndex + 1) % updates.length;
        updateCarouselPositions();
        restartAuto();
      });
    }

    if (track) {
      track.addEventListener("mouseenter", stopAuto);
      track.addEventListener("mouseleave", startAuto);
    }
  }

  // আঙুলের সাথে সাথে সরাসরি সোয়াইপ (Real-time Follow Finger)
  function setupRealtimeTouch() {
    const container = document.querySelector(".carousel-container");
    if (!container) return;

    container.addEventListener("touchstart", (e) => {
      if (isTransitioning) return;
      stopAuto();
      isDragging = true;
      startX = e.touches[0].clientX;
      currentX = startX;
      containerWidth = container.offsetWidth || 350;

      // টাচ চলাকালীন CSS ট্রানজিশন বন্ধ রাখা যাতে আঙুলের সাথে সরাসরি নড়ে
      const cards = document.querySelectorAll(".c-card");
      cards.forEach((card) => {
        card.style.transition = "none";
      });
    }, { passive: true });

    container.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;

      // ড্র্যাগ রেশিও (-১ থেকে +১)
      const dragPercent = Math.max(-1, Math.min(1, diffX / (containerWidth * 0.75)));

      const activeCard = document.querySelector(".c-card.active");
      const prevCard = document.querySelector(".c-card.prev-card");
      const nextCard = document.querySelector(".c-card.next-card");

      // সক্রিয় কার্ড আঙুলের সাথে ডানে-বামে সরবে এবং সামান্য বাঁকবে
      if (activeCard) {
        const rotate = -dragPercent * 28;
        const scale = 1 - Math.abs(dragPercent) * 0.18;
        activeCard.style.transform = `translateX(${diffX}px) translateZ(0) rotateY(${rotate}deg) scale(${scale})`;
      }

      // পূর্বের ও পরের কার্ডগুলো ইন্টারঅ্যাকটিভভাবে কাছে আসবে
      if (prevCard && diffX > 0) {
        const scale = 0.82 + dragPercent * 0.18;
        const rotate = 36 - dragPercent * 36;
        prevCard.style.transform = `translateX(calc(-52% + ${diffX * 0.5}px)) translateZ(-180px) rotateY(${rotate}deg) scale(${scale})`;
      }

      if (nextCard && diffX < 0) {
        const scale = 0.82 + Math.abs(dragPercent) * 0.18;
        const rotate = -36 + Math.abs(dragPercent) * 36;
        nextCard.style.transform = `translateX(calc(52% + ${diffX * 0.5}px)) translateZ(-180px) rotateY(${rotate}deg) scale(${scale})`;
      }
    }, { passive: true });

    container.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = currentX - startX;
      const threshold = 50; // ৫০ পিক্সেল টানলে স্লাইড পরিবর্তন হবে

      if (diffX < -threshold) {
        // বামে টেনে ছেড়ে দিলে পরের স্লাইড
        currentIndex = (currentIndex + 1) % updates.length;
      } else if (diffX > threshold) {
        // ডানে টেনে ছেড়ে দিলে আগের স্লাইড
        currentIndex = (currentIndex - 1 + updates.length) % updates.length;
      }

      // ট্রানজিশন ফিরিয়ে দিয়ে স্মুথলি পজিশনে সেট করা
      updateCarouselPositions();
      startAuto();
    }, { passive: true });
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
   
