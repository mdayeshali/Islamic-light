// 🌙 Dark Mode Toggle
const toggle = document.getElementById("themeToggle");
toggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "" : "dark";
  toggle.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";
});

// 📱 Mobile Menu Toggle
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuBtn.textContent = navMenu.classList.contains("active") ? "✕" : "☰";
});
