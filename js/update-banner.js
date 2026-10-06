/* =========================================
   Islamic Light
   Dynamic Update Banner
   ========================================= */

(function () {
    "use strict";

    /* =====================================
       SETTINGS & PATHS
       ===================================== */
    const BANNER_HTML_URL = "/includes/update-banner.html";
    const JSON_URL = "/data/update.json";
    const AUTO_SLIDE_TIME = 6000;

    /* =====================================
       VARIABLES
       ===================================== */
    let updates = [];
    let currentIndex = 0;
    let slideTimer = null;
    let isAnimating = false;

    // Elements (DOM লোড হওয়ার পর সিলেক্ট হবে)
    let card, icon, badge, date, title, description, button, buttonText, number, dots, prevButton, nextButton;

    /* =====================================
       STEP 1: LOAD HTML & INITIALIZE
       ===================================== */
    async function initBanner() {
        const container = document.getElementById("heroUpdateBox");
        if (!container) return;

        try {
            // ১. আগে update-banner.html ফেচ করে কন্টেইনারে ঢোকানো
            const htmlRes = await fetch(BANNER_HTML_URL);
            if (!htmlRes.ok) throw new Error("Banner HTML could not be loaded.");
            container.innerHTML = await htmlRes.text();

            // ২. HTML পেজে বসার পর এলিমেন্টগুলো সিলেক্ট করা
            card = document.getElementById("updateCard");
            icon = document.getElementById("updateIcon");
            badge = document.getElementById("updateBadge");
            date = document.getElementById("updateDate");
            title = document.getElementById("updateTitle");
            description = document.getElementById("updateDescription");
            button = document.getElementById("updateButton");
            buttonText = document.getElementById("updateButtonText");
            number = document.getElementById("updateNumber");
            dots = document.getElementById("updateDots");
            prevButton = document.getElementById("updatePrev");
            nextButton = document.getElementById("updateNext");

            // ৩. ইভেন্ট লিসেনার সেট করা
            if (prevButton) prevButton.addEventListener("click", previousUpdate);
            if (nextButton) nextButton.addEventListener("click", nextUpdate);
            if (card) {
                card.addEventListener("mouseenter", stopAutoSlide);
                card.addEventListener("mouseleave", startAutoSlide);
            }

            // ৪. JSON থেকে ডাটা লোড করা
            loadUpdates();

        } catch (error) {
            console.error("Update Banner Init Error:", error);
            hideBanner();
        }
    }

    /* =====================================
       STEP 2: LOAD JSON DATA
       ===================================== */
    async function loadUpdates() {
        try {
            const response = await fetch(JSON_URL);
            if (!response.ok) throw new Error("Update JSON could not be loaded.");

            const data = await response.json();
            
            // data বা data.updates দুটো ফরম্যাটই হ্যান্ডেল করার জন্য:
            updates = Array.isArray(data) ? data : (data.updates || []);

            if (updates.length === 0) {
                throw new Error("No updates found.");
            }

            createDots();
            showUpdate(0);
            startAutoSlide();

        } catch (error) {
            console.error("Update JSON Error:", error);
            hideBanner();
        }
    }

    /* =====================================
       SHOW UPDATE
       ===================================== */
    function showUpdate(index) {
        if (!updates.length) return;

        currentIndex = (index + updates.length) % updates.length;
        const item = updates[currentIndex];

        // আইকন হ্যান্ডলিং (টেক্সট অথবা FontAwesome আইকন দুটোই সাপোর্ট করবে)
        if (icon) {
            if (item.icon && item.icon.includes("fa-")) {
                icon.innerHTML = `<i class="${item.icon}"></i>`;
            } else {
                icon.innerHTML = item.icon || "✦";
            }
        }

        if (badge) badge.textContent = item.badge || "নতুন আপডেট";
        if (date) date.textContent = item.date || "";
        if (title) title.textContent = item.title || "";
        if (description) description.textContent = item.description || "";
        if (buttonText) buttonText.textContent = item.buttonText || "দেখুন";
        if (button) button.href = item.link || "#";
        if (number) number.textContent = `${currentIndex + 1} / ${updates.length}`;

        updateDots();
    }

        /* =====================================
       C    /* =====================================
       CHANGE UPDATE WITH 3D ANIMATION
       ===================================== */
    function changeUpdate(index) {
        if (isAnimating) return;
        if (updates.length <= 1) return;

        isAnimating = true;
        if (card) card.classList.add("is-changing");

        // ৫৫০ms পর পুরনো স্লাইড গুটিয়ে শেষ হবে এবং নতুন স্লাইড ওপর থেকে নামবে
        setTimeout(function () {
            showUpdate(index);
            if (card) card.classList.remove("is-changing");

            // নতুন স্লাইড সম্পূর্ণ খুলে স্বাভাবিক হতে আরও ৫৫০ms সময় নেবে
            setTimeout(function () {
                isAnimating = false;
            }, 550);
        }, 550);
    }

   

    /* =====================================
       SLIDE CONTROLS
       ===================================== */
    function nextUpdate() {
        changeUpdate(currentIndex + 1);
        restartAutoSlide();
    }

    function previousUpdate() {
        changeUpdate(currentIndex - 1);
        restartAutoSlide();
    }

    /* =====================================
       DOTS CREATION & UPDATE
       ===================================== */
    function createDots() {
        if (!dots) return;
        dots.innerHTML = "";

        updates.forEach(function (_, index) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "update-dot-item";
            dot.setAttribute("aria-label", `Update ${index + 1}`);

            dot.addEventListener("click", function () {
                changeUpdate(index);
                restartAutoSlide();
            });

            dots.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dots) return;
        const allDots = dots.querySelectorAll(".update-dot-item");
        allDots.forEach(function (dot, index) {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    /* =====================================
       AUTO SLIDE
       ===================================== */
    function startAutoSlide() {
        stopAutoSlide();
        if (updates.length <= 1) return;

        slideTimer = setInterval(function () {
            changeUpdate(currentIndex + 1);
        }, AUTO_SLIDE_TIME);
    }

    function stopAutoSlide() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    function restartAutoSlide() {
        startAutoSlide();
    }

    /* =====================================
       HIDE BANNER IF EMPTY OR ERROR
       ===================================== */
    function hideBanner() {
        const section = document.getElementById("updateSection");
        if (section) section.style.display = "none";
    }

    /* =====================================
       START AFTER DOM READY
       ===================================== */
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBanner);
    } else {
        initBanner();
    }

})();
