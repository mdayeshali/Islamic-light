// ১১৪টি সূরার মেটাডেটা তালিকা
const surahs = [
  { id: 1, name: "আল-ফাতিহা", ar: "الفاتحة", total: 7, type: "মক্কী" },
  { id: 2, name: "আল-বাকারাহ", ar: "البقرة", total: 286, type: "মাদানী" },
  { id: 3, name: "আলে ইমরান", ar: "آل عمران", total: 200, type: "মাদানী" },
  { id: 4, name: "আন-নিসা", ar: "النساء", total: 176, type: "মাদানী" },
  { id: 5, name: "আল-মায়েদাহ", ar: "المائدة", total: 120, type: "মাদানী" },
  { id: 6, name: "আল-আনআম", ar: "الأنعام", total: 165, type: "মক্কী" },
  { id: 7, name: "আল-আরাফ", ar: "الأعراف", total: 206, type: "মক্কী" },
  { id: 8, name: "আল-আনফাল", ar: "الأنفال", total: 75, type: "মাদানী" },
  { id: 9, name: "আত-তাওবাহ", ar: "التوبة", total: 129, type: "মাদানী" },
  { id: 10, name: "ইউনুস", ar: "يونس", total: 109, type: "মক্কী" },
  { id: 11, name: "হুদ", ar: "هود", total: 123, type: "মক্কী" },
  { id: 12, name: "ইউসুফ", ar: "يوسف", total: 111, type: "মক্কী" },
  { id: 13, name: "আর-রাদ", ar: "الرعد", total: 43, type: "মাদানী" },
  { id: 14, name: "ইব্রাহীম", ar: "إبراهيم", total: 52, type: "মক্কী" },
  { id: 15, name: "আল-হিজর", ar: "الحجر", total: 99, type: "মক্কী" },
  { id: 16, name: "আন-নাহল", ar: "النحل", total: 128, type: "মক্কী" },
  { id: 17, name: "আল-ইসরা", ar: "الإسراء", total: 111, type: "মক্কী" },
  { id: 18, name: "আল-কাহফ", ar: "الكهف", total: 110, type: "মক্কী" },
  { id: 19, name: "মারইয়াম", ar: "مريم", total: 98, type: "মক্কী" },
  { id: 20, name: "ত্বা-হা", ar: "طه", total: 135, type: "মক্কী" },
  { id: 21, name: "আল-আম্বিয়া", ar: "الأنبياء", total: 112, type: "মক্কী" },
  { id: 22, name: "আল-হাজ্জ", ar: "الحج", total: 78, type: "মাদানী" },
  { id: 23, name: "আল-মু'মিনুন", ar: "المؤمنون", total: 118, type: "মক্কী" },
  { id: 24, name: "আন-নূর", ar: "النور", total: 64, type: "মাদানী" },
  { id: 25, name: "আল-ফুরকান", ar: "الفرقان", total: 77, type: "মক্কী" },
  { id: 26, name: "আশ-শুআরা", ar: "الشعراء", total: 227, type: "মক্কী" },
  { id: 27, name: "আন-নামল", ar: "النمل", total: 93, type: "মক্কী" },
  { id: 28, name: "আল-কাসাস", ar: "القصص", total: 88, type: "মক্কী" },
  { id: 29, name: "আল-আনকাবুত", ar: "العنكبوت", total: 69, type: "মক্কী" },
  { id: 30, name: "আর-রূম", ar: "الروم", total: 60, type: "মক্কী" },
  { id: 31, name: "লুকমান", ar: "لقمان", total: 34, type: "মক্কী" },
  { id: 32, name: "আস-সাজদাহ", ar: "السجدة", total: 30, type: "মক্কী" },
  { id: 33, name: "আল-আহযাব", ar: "الأحزاب", total: 73, type: "মাদানী" },
  { id: 34, name: "সাবা", ar: "سبأ", total: 54, type: "মক্কী" },
  { id: 35, name: "ফাতির", ar: "فاطر", total: 45, type: "মক্কী" },
  { id: 36, name: "ইয়াসীন", ar: "يس", total: 83, type: "মক্কী" },
  { id: 37, name: "আস-সাফফাত", ar: "الصافات", total: 182, type: "মক্কী" },
  { id: 38, name: "সোয়াদ", ar: "ص", total: 88, type: "মক্কী" },
  { id: 39, name: "আজ-জুমার", ar: "الزمر", total: 75, type: "মক্কী" },
  { id: 40, name: "গাফির", ar: "غافر", total: 85, type: "মক্কী" },
  { id: 41, name: "ফুসসিলাত", ar: "فصلت", total: 54, type: "মক্কী" },
  { id: 42, name: "আশ-শুরা", ar: "الشورى", total: 53, type: "মক্কী" },
  { id: 43, name: "আজ-জুখরুফ", ar: "الزخرف", total: 89, type: "মক্কী" },
  { id: 44, name: "আদ-দুখান", ar: "الدخان", total: 59, type: "মক্কী" },
  { id: 45, name: "আল-জাসিয়াহ", ar: "الجاثية", total: 37, type: "মক্কী" },
  { id: 46, name: "আল-আহকাফ", ar: "الأحقاف", total: 35, type: "মক্কী" },
  { id: 47, name: "মুহাম্মদ", ar: "محمد", total: 38, type: "মাদানী" },
  { id: 48, name: "আল-ফাতহ", ar: "الفتح", total: 29, type: "মাদানী" },
  { id: 49, name: "আল-হুজুরাত", ar: "الحجرات", total: 18, type: "মাদানী" },
  { id: 50, name: "কাফ", ar: "ق", total: 45, type: "মক্কী" },
  { id: 51, name: "আজ-যারিয়াত", ar: "الذاريات", total: 60, type: "মক্কী" },
  { id: 52, name: "আত-তূর", ar: "الطور", total: 49, type: "মক্কী" },
  { id: 53, name: "আন-নাজম", ar: "النجم", total: 62, type: "মক্কী" },
  { id: 54, name: "আল-কামার", ar: "القمر", total: 55, type: "মক্কী" },
  { id: 55, name: "আর-রাহমান", ar: "الرحمن", total: 78, type: "মাদানী" },
  { id: 56, name: "আল-ওয়াকিয়াহ", ar: "الواقعة", total: 96, type: "মক্কী" },
  { id: 57, name: "আল-হাদীদ", ar: "الحديد", total: 29, type: "মাদানী" },
  { id: 58, name: "আল-মুজাদালাহ", ar: "المجادلة", total: 22, type: "মাদানী" },
  { id: 59, name: "আল-হাশর", ar: "الحشر", total: 24, type: "মাদানী" },
  { id: 60, name: "আল-মুমতাহিনাহ", ar: "الممتحنة", total: 13, type: "মাদানী" },
  { id: 61, name: "আস-সাফ", ar: "الصف", total: 14, type: "মাদানী" },
  { id: 62, name: "আল-জুমুআহ", ar: "الجمعة", total: 11, type: "মাদানী" },
  { id: 63, name: "আল-মুনাফিকুন", ar: "المنافقون", total: 11, type: "মাদানী" },
  { id: 64, name: "আত-তাগাবুন", ar: "التغابن", total: 18, type: "মাদানী" },
  { id: 65, name: "আত-ত্বালাক", ar: "الطلاق", total: 12, type: "মাদানী" },
  { id: 66, name: "আত-তাহরীম", ar: "التحريم", total: 12, type: "মাদানী" },
  { id: 67, name: "আল-মুলক", ar: "الملك", total: 30, type: "মক্কী" },
  { id: 68, name: "আল-কলম", ar: "القلم", total: 52, type: "মক্কী" },
  { id: 69, name: "আল-হাক্কাহ", ar: "الحاقة", total: 52, type: "মক্কী" },
  { id: 70, name: "আল-মাআরিজ", ar: "المعارج", total: 44, type: "মক্কী" },
  { id: 71, name: "নূহ", ar: "نوح", total: 28, type: "মক্কী" },
  { id: 72, name: "আল-জিন", ar: "الجن", total: 28, type: "মক্কী" },
  { id: 73, name: "আল-মুযযাম্মিল", ar: "المزمل", total: 20, type: "মক্কী" },
  { id: 74, name: "আল-মুদ্দাসসির", ar: "المدثر", total: 56, type: "মক্কী" },
  { id: 75, name: "আল-কিয়ামাহ", ar: "القيامة", total: 40, type: "মক্কী" },
  { id: 76, name: "আল-ইনসান", ar: "الإنسان", total: 31, type: "মাদানী" },
  { id: 77, name: "আল-মুরসালাত", ar: "المرسلات", total: 50, type: "মক্কী" },
  { id: 78, name: "আন-নাবা", ar: "النبأ", total: 40, type: "মক্কী" },
  { id: 79, name: "আন-নাযিআত", ar: "النازعات", total: 46, type: "মক্কী" },
  { id: 80, name: "আবাসা", ar: "عبس", total: 42, type: "মক্কী" },
  { id: 81, name: "আত-তাকবীর", ar: "التكوير", total: 29, type: "মক্কী" },
  { id: 82, name: "আল-ইনফিতার", ar: "الانفطار", total: 19, type: "মক্কী" },
  { id: 83, name: "আল-মুতাফফিফীন", ar: "المطففين", total: 36, type: "মক্কী" },
  { id: 84, name: "আল-ইনশিকাক", ar: "الانشقاق", total: 25, type: "মক্কী" },
  { id: 85, name: "আল-বুরূজ", ar: "البروج", total: 22, type: "মক্কী" },
  { id: 86, name: "আত-ত্বারিক", ar: "الطارق", total: 17, type: "মক্কী" },
  { id: 87, name: "আল-আলা", ar: "الأعلى", total: 19, type: "মক্কী" },
  { id: 88, name: "আল-গাশিয়াহ", ar: "الغاشية", total: 26, type: "মক্কী" },
  { id: 89, name: "আল-ফজর", ar: "الفجر", total: 30, type: "মক্কী" },
  { id: 90, name: "আল-বালাদ", ar: "البلد", total: 20, type: "মক্কী" },
  { id: 91, name: "আশ-শামস", ar: "الشمس", total: 15, type: "মক্কী" },
  { id: 92, name: "আল-লাইল", ar: "الليل", total: 21, type: "মক্কী" },
  { id: 93, name: "আদ-দুহা", ar: "الضحى", total: 11, type: "মক্কী" },
  { id: 94, name: "আশ-শারহ", ar: "الشرح", total: 8, type: "মক্কী" },
  { id: 95, name: "আত-তীন", ar: "التين", total: 8, type: "মক্কী" },
  { id: 96, name: "আল-আলাক", ar: "العلق", total: 19, type: "মক্কী" },
  { id: 97, name: "আল-কদর", ar: "القدر", total: 5, type: "মক্কী" },
  { id: 98, name: "আল-বাইয়্যিনাহ", ar: "البينة", total: 8, type: "মাদানী" },
  { id: 99, name: "আল-যিলযাল", ar: "الزلزلة", total: 8, type: "মাদানী" },
  { id: 100, name: "আল-আদিয়াত", ar: "العاديات", total: 11, type: "মক্কী" },
  { id: 101, name: "আল-কারিয়াহ", ar: "القارعة", total: 11, type: "মক্কী" },
  { id: 102, name: "আত-তাকাসুর", ar: "التكاثر", total: 8, type: "মক্কী" },
  { id: 103, name: "আল-আসর", ar: "العصر", total: 3, type: "মক্কী" },
  { id: 104, name: "আল-হুমাযাহ", ar: "الهمزة", total: 9, type: "মক্কী" },
  { id: 105, name: "আল-ফীল", ar: "الفيل", total: 5, type: "মক্কী" },
  { id: 106, name: "কুরাইশ", ar: "قريش", total: 4, type: "মক্কী" },
  { id: 107, name: "আল-মাউন", ar: "الماعون", total: 7, type: "মক্কী" },
  { id: 108, name: "আল-কাওসার", ar: "الكوثر", total: 3, type: "মক্কী" },
  { id: 109, name: "আল-কাফিরুন", ar: "الكافرون", total: 6, type: "মক্কী" },
  { id: 110, name: "আন-নাসর", ar: "النصر", total: 3, type: "মাদানী" },
  { id: 111, name: "আল-লাহাব", ar: "المسد", total: 5, type: "মক্কী" },
  { id: 112, name: "আল-ইখলাস", ar: "الإخلاص", total: 4, type: "মক্কী" },
  { id: 113, name: "আল-ফালাক", ar: "الفلق", total: 5, type: "মক্কী" },
  { id: 114, name: "আন-নাস", ar: "الناس", total: 6, type: "মক্কী" }
];

let currentSurahIndex = 0;
const audio = document.getElementById("audio-element");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");
const reciterSelect = document.getElementById("reciter-select");
const downloadBtn = document.getElementById("download-btn");
const downloadProgress = document.getElementById("download-progress");
const surahListContainer = document.getElementById("surah-list");
const searchInput = document.getElementById("search-input");

// অডিও ইউআরএল পাওয়ার ফাংশন
function getAudioUrl(surahId) {
  const paddedId = String(surahId).padStart(3, "0");
  return `${reciterSelect.value}${paddedId}.mp3`;
}

// সূরা লোড করা
function loadSurah(index, autoPlay = false) {
  currentSurahIndex = index;
  const surah = surahs[index];

  document.getElementById("now-arabic").innerText = surah.ar;
  document.getElementById("now-bengali").innerText = `সূরা ${surah.name}`;
  document.getElementById("now-details").innerText = `আয়াত: ${surah.total} | ${surah.type}`;

  audio.src = getAudioUrl(surah.id);
  seekBar.value = 0;
  currentTimeEl.innerText = "00:00";
  durationTimeEl.innerText = "00:00";

  updateActiveSurahUI();

  if (autoPlay) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    playBtn.innerText = "▶";
  }
}

// UI হাইলাইট আপডেট
function updateActiveSurahUI() {
  document.querySelectorAll(".surah-item").forEach((item, idx) => {
    item.classList.toggle("active", idx === currentSurahIndex);
  });
}

// প্লে/পজ টগল
playBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶";
  }
});

// পরবর্তী ও পূর্ববর্তী সূরা
nextBtn.addEventListener("click", () => {
  if (currentSurahIndex < surahs.length - 1) {
    loadSurah(currentSurahIndex + 1, true);
  }
});

prevBtn.addEventListener("click", () => {
  if (currentSurahIndex > 0) {
    loadSurah(currentSurahIndex - 1, true);
  }
});

// অডিও শেষ হলে পরবর্তী সূরা প্লে
audio.addEventListener("ended", () => {
  if (currentSurahIndex < surahs.length - 1) {
    loadSurah(currentSurahIndex + 1, true);
  }
});

// টাইম আপডেট ও সিক বার
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    seekBar.max = Math.floor(audio.duration);
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeEl.innerText = formatTime(audio.currentTime);
    durationTimeEl.innerText = formatTime(audio.duration);
  }
});

seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

// সময় ফরম্যাট (mm:ss)
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ক্বারী পরিবর্তন
reciterSelect.addEventListener("change", () => {
  const wasPlaying = !audio.paused;
  const currentTime = audio.currentTime;
  audio.src = getAudioUrl(surahs[currentSurahIndex].id);
  audio.currentTime = currentTime;
  if (wasPlaying) audio.play();
});

// মেমরিতে সরাসরি MP3 ডাউনলোড লজিক
downloadBtn.addEventListener("click", async () => {
  const surah = surahs[currentSurahIndex];
  const url = getAudioUrl(surah.id);
  const filename = `${String(surah.id).padStart(3, "0")}_${surah.name}.mp3`;

  try {
    downloadBtn.disabled = true;
    downloadProgress.innerText = "ডাউনলোড শুরু হয়েছে, অপেক্ষা করুন...";

    const res = await fetch(url);
    if (!res.ok) throw new Error("নেটওয়ার্ক এরর");

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(blobUrl);

    downloadProgress.innerText = "ডাউনলোড সম্পন্ন হয়েছে!";
    setTimeout(() => downloadProgress.innerText = "", 4000);
  } catch (err) {
    downloadProgress.innerText = "ডাউনলোড ব্যর্থ! বিকল্পভাবে ফাইল ওপেন হচ্ছে...";
    window.open(url, "_blank");
  } finally {
    downloadBtn.disabled = false;
  }
});

// সূরা তালিকা রেন্ডার
function renderSurahs(list) {
  surahListContainer.innerHTML = "";
  list.forEach((surah, index) => {
    const item = document.createElement("div");
    item.className = `surah-item ${index === currentSurahIndex ? "active" : ""}`;
    item.innerHTML = `
      <div style="display:flex; align-items:center;">
        <span class="number-badge">${surah.id}</span>
        <div>
          <div style="font-weight:600;">সূরা ${surah.name}</div>
          <small style="color:var(--text-muted); font-size:12px;">আয়াত: ${surah.total}</small>
        </div>
      </div>
      <span class="arabic-text">${surah.ar}</span>
    `;
    item.addEventListener("click", () => loadSurah(surahs.findIndex(s => s.id === surah.id), true));
    surahListContainer.appendChild(item);
  });
}

// সার্চ ফিল্টার
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const filtered = surahs.filter(s => 
    s.name.toLowerCase().includes(query) || 
    s.id.toString() === query || 
    s.ar.includes(query)
  );
  renderSurahs(filtered);
});

// ইনিশিয়ালাইজেশন
renderSurahs(surahs);
loadSurah(0, false);
    
