/**
 * Islamic Light - Core Script v2.5
 * Developed by: Md Ayesh Ali
 * Features: Smart Copy, Laptop Optimized, Overlay Auto-Close
 */

// ১. গ্লোবাল ভেরিয়েবল
let currentSurah = "";
let arabicFont = 32;
let banglaFont = 18;
let selectedAr = "";
let selectedBn = "";
let selectedSurahName = "";
let selectedAyahNumber = "";

const surahBengaliNames = [
    "আল-ফাতিহা", "আল-বাকারাহ", "আল-ইমরান", "আন-নিসা", "আল-মায়িদাহ", "আল-আনআম", "আল-আরাফ", "আল-আনফাল", "আত-তাওবাহ", "ইউনূস", "হুদ", "ইউসুফ", "আর-রাদ", "ইব্রাহিম", "আল-হিজর", "আন-নাহল", "বনী ইসরাঈল", "আল-কাহফ", "মারইয়াম", "ত্বহা", "আল-আম্বিয়া", "আল-হাজ্জ", "আল-মুমিনুন", "আন-নূর", "আল-ফুরকান", "আশ-শুয়ারা", "আন-নামল", "আল-কাসাস", "আল-আনকাবুত", "আর-রূম", "লুকমান", "আস-সাজদাহ", "আল-আহযাব", "সাবা", "ফাতির", "ইয়াসীন", "আস-সাফফাত", "সাদ", "আয-যুমার", "গাফির", "ফুসসিলাত", "আশ-শূরা", "আয-যুখরুফ", "আদ-দুখান", "আল-জাসিয়াহ", "আল-আহক্বাফ", "মুহাম্মদ", "আল-ফাতহ", "আল-হুজুরাত", "ক্বাফ", "আয-যারিয়াত", "আত-তূর", "আন-নাজম", "আল-ক্বামার", "আর-রাহমান", "আল-ওয়াকিয়াহ", "আল-হাদীদ", "আল-মুজাদালাহ", "আল-হাশর", "আল-মুমতাহিনাহ", "আস-সাফ", "আল-জুমুআহ", "আল-মুনাফিকুন", "আত-তাগাবুন", "আত-তালাক", "আত-তাহরীম", "আল-মুলক", "আল-ক্বালাম", "আল-হাক্কাহ", "আল-মাআরিজ", "নূহ", "আল-জিন", "আল-মুযযামমিল", "আল-মুদ্দাসসির", "আল-ক্বিয়ামাহ", "আদ-দাহর", "আল-মুরসালাত", "আন-নাবা", "আন-নাযিয়াত", "আবাসা", "আত-তাকবীর", "আল-ইনফিতার", "আল-মুতাফফিফীন", "আল-ইনশিকাক", "আল-বুরূজ", "আত-তারিক্ব", "আল-আলা", "আল-গাশিয়াহ", "আল-ফজর", "আল-বালাদ", "আশ-শামস", "আল-লাইল", "আদ-দুহা", "আলাম নাশরাহ", "আত-তীন", "আল-আলাক্ব", "আল-ক্বদর", "আল-বাইয়্যিনাহ", "আয-যিলযাল", "আল-আদিয়াত", "আল-ক্বারিআহ", "আত-তাকাসুর", "আল-আসর", "আল-হুমাযাহ", "আল-ফীল", "কুরাইশ", "আল-মাউন", "আল-কাওসার", "আল-কাফিরুন", "আন-নাসর", "লাহাব", "আল-ইখলাস", "আল-ফালাক্ব", "আন-নাস"
];

// ২. ইনিশিয়ালাইজেশন
document.addEventListener('DOMContentLoaded', () => {
    loadSavedSettings();
    populateSurahList();
    initEventListeners();
});

// ৩. সেটিংস লোড ও অ্যাপ্লাই
function loadSavedSettings() {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode'); //
        if(document.getElementById('darkMode')) document.getElementById('darkMode').checked = true;
    }
    arabicFont = localStorage.getItem('arFontSize') || 32;
    banglaFont = localStorage.getItem('bnFontSize') || 18;
    document.getElementById('arabicSize').value = arabicFont;
    document.getElementById('banglaSize').value = banglaFont;
}

// ৪. প্যানেল কন্ট্রোল (Fix: Overlay Close)
function togglePanel(id) {
    const overlay = document.getElementById("overlay");
    const panel = document.getElementById(id);
    
    closeAll(); 

    panel.style.visibility = "visible";
    panel.classList.add("active");
    overlay.style.display = "block";
    setTimeout(() => {
        overlay.style.opacity = "1";
    }, 10);
    document.body.style.overflow = "hidden"; // প্যানেল খুললে পেজ স্ক্রল বন্ধ
}

function closeAll() {
    const overlay = document.getElementById("overlay");
    
    // সব পপআপ ও কপি মেনু বন্ধ
    document.querySelectorAll('.popup, .copy-menu').forEach(p => {
        p.classList.remove("active");
        setTimeout(() => { 
            if(!p.classList.contains('active')) p.style.visibility = "hidden"; 
        }, 300);
    });
    
    // ওভারলে হাইড করা
    overlay.style.opacity = "0";
    setTimeout(() => { 
        if(overlay.style.opacity === "0") overlay.style.display = "none"; 
    }, 300);
    
    document.body.style.overflow = "auto"; // স্ক্রল পুনরায় চালু
}

// ৫. সুরা লিস্ট তৈরি
function populateSurahList() {
    const select = document.getElementById("surahSelect");
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            data.data.forEach((surah, index) => {
                let option = document.createElement("option");
                option.value = surah.number;
                option.text = `${surah.number}. সূরা ${surahBengaliNames[index]}`;
                select.appendChild(option);
            });
        });
}

// ৬. সুরা কন্টেন্ট লোড ও রেন্ডার
async function loadSurah(num) {
    if (!num) return;
    const quranDiv = document.getElementById("quran");
    quranDiv.innerHTML = `<div style="text-align:center; padding:100px 0;"><p style="color:var(--primary-color); font-weight:600;">পবিত্র কুরআন থেকে সূরা লোড হচ্ছে...</p></div>`;

    try {
        const [arRes, bnRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${num}/ar.alafasy`),
            fetch(`https://api.alquran.cloud/v1/surah/${num}/bn.bengali`)
        ]);
        const arData = await arRes.json();
        const bnData = await bnRes.json();
        renderSurah(arData.data, bnData.data);
    } catch (error) {
        quranDiv.innerHTML = `<p style="text-align:center; color:red; padding:50px;">ইন্টারনেট সংযোগ সমস্যা!</p>`;
    }
}

function renderSurah(ar, bn) {
    const bngName = surahBengaliNames[ar.number - 1];
    const type = ar.revelationType === "Meccan" ? "মক্কী" : "মাদানী";
    
    let html = `
        <div class="surah-header">
            <h2>সূরা ${bngName}</h2> <span class="surah-info-tag">আয়াত: ${ar.numberOfAyahs} | ${type}</span>
        </div>
        <div class="surah-container">
    `;

    ar.ayahs.forEach((ayah, i) => {
        const arClean = ayah.text.replace(/'/g, "\\'").replace(/"/g, '\\"');
        const bnClean = bn.ayahs[i].text.replace(/'/g, "\\'").replace(/"/g, '\\"');
        
        html += `
            <div class="ayah" onclick="openCopyMenu('${arClean}', '${bnClean}', '${bngName}', '${ayah.numberInSurah}')">
                <span class="number">আয়াত: ${ayah.numberInSurah}</span>
                <div class="arabic" style="font-size:${arabicFont}px;">${ayah.text}</div>
                <div class="bangla" style="font-size:${banglaFont}px;">${bn.ayahs[i].text}</div>
            </div>
        `;
    });

    html += `</div>`;
    document.getElementById("quran").innerHTML = html;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ৭. স্মার্ট কপি সিস্টেম
function openCopyMenu(ar, bn, sName, aNum) {
    selectedAr = ar;
    selectedBn = bn;
    selectedSurahName = sName;
    selectedAyahNumber = aNum;

    const menu = document.getElementById("copyMenu");
    const overlay = document.getElementById("overlay");
    
    menu.style.visibility = "visible";
    menu.classList.add("active");
    overlay.style.display = "block";
    setTimeout(() => overlay.style.opacity = "1", 10);
}

function executeCopy(mode) {
    let header = `সূরা ${selectedSurahName} (আয়াত: ${selectedAyahNumber})\n\n`;
    let text = "";
    if (mode === 'ar') text = header + selectedAr;
    else if (mode === 'bn') text = header + selectedBn;
    else text = header + selectedAr + "\n\n" + selectedBn;

    text += "\n\n— Islamic Light App";

    navigator.clipboard.writeText(text).then(() => {
        alert("নাম ও নম্বরসহ কপি হয়েছে!");
        closeAll();
    });
}

// ৮. ইভেন্ট লিসেনারস ও সেটিংস
function initEventListeners() {
    document.getElementById("surahSelect").addEventListener("change", (e) => loadSurah(e.target.value));
    
    document.getElementById("arabicSize").addEventListener('input', (e) => {
        arabicFont = e.target.value;
        localStorage.setItem('arFontSize', arabicFont);
        updateUI();
    });

    document.getElementById("banglaSize").addEventListener('input', (e) => {
        banglaFont = e.target.value;
        localStorage.setItem('bnFontSize', banglaFont);
        updateUI();
    });

    document.getElementById('darkMode').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

function updateUI() {
    document.querySelectorAll('.arabic').forEach(el => el.style.fontSize = arabicFont + 'px');
    document.querySelectorAll('.bangla').forEach(el => el.style.fontSize = banglaFont + 'px');
                              }
              
