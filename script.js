// 🌙 Dark Mode Toggle
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "" : "dark";
  toggle.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";
});

