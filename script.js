// 🌙 Dark Mode Toggle
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "" : "dark";
  toggle.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";
});


let deferredPrompt;
const installBtn = document.getElementById('pwaInstallBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  // ডিফল্ট পপআপ বন্ধ করা
  e.preventDefault();
  deferredPrompt = e;
  
  // ইনস্টল করার উপযোগী হলে বাটনটি দৃশ্যমান হবে
  if (installBtn) {
    installBtn.style.display = 'block';
  }
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

// অ্যাপ ইতোমধ্যে ইনস্টল করা থাকলে বাটনটি লুকিয়ে যাবে
window.addEventListener('appinstalled', () => {
  if (installBtn) {
    installBtn.style.display = 'none';
  }
});

