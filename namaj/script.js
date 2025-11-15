/* ==========================================================
 🌙 Islamic Light – Namaz Education (JS File)
 Author: Md Ayesh Ali | Year: 2025
 Handles:
 ✅ Mobile Menu Toggle
 ✅ Dark Mode Toggle
 ✅ Smooth Scroll Animation
========================================================== */

// 🌿 Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {

  // ------------------------------
  // 📱 Mobile Menu Toggle
  // ------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("active");
    });
  }

  // ------------------------------
  // 🌙 Dark Mode Toggle Button
  // ------------------------------
  const header = document.querySelector(".site-header");
  if (header) {
    const themeToggle = document.createElement("button");
    themeToggle.classList.add("dark-toggle");
    themeToggle.textContent = "🌙";
    header.appendChild(themeToggle);

    themeToggle.addEventListener("click", () => {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      document.body.setAttribute("data-theme", isDark ? "" : "dark");
      themeToggle.textContent = isDark ? "🌙" : "☀️";
    });
  }

  // ------------------------------
  // 🌸 Smooth Scroll Animation
  // ------------------------------
  
  window.addEventListener("scroll", fadeInOnScroll);
  fadeInOnScroll(); // initial call
});
