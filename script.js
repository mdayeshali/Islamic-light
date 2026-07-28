// 🌙 Dark Mode Toggle
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  document.body.dataset.theme =
    document.body.dataset.theme === "dark" ? "" : "dark";
  toggle.textContent = document.body.dataset.theme === "dark" ? "☀️" : "🌙";
});


let deferredPrompt;
const installBtn = document.getElementById('pwaInstallBtn');

// ১. ব্রাউজার PWA ইভেন্ট ডিটেক্ট করলে এটি ট্রিগার হবে
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  // ইনস্টল বাটনটি স্ক্রিনে দৃশ্যমান করা
  if (installBtn) {
    installBtn.style.display = 'block';
  }
});

// ২. বাটনে ক্লিক করলে ইনস্টল ডায়ালগ দেখানো
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User choice: ${outcome}`);
      
      deferredPrompt = null;
      installBtn.style.display = 'none';
    }
  });
}

// ৩. ইনস্টল সম্পন্ন হয়ে গেলে বাটন লুকিয়ে ফেলা
window.addEventListener('appinstalled', () => {
  if (installBtn) {
    installBtn.style.display = 'none';
  }
});
