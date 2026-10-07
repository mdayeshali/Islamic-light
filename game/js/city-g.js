/**
 * Islamic City - Core Engine
 * Islamic Light (islamiclight.in)
 */

"use strict";

const DATA_URL = "data/city-g.json";
const STORAGE_KEY = "islamicCityProgress";

// Application State
const state = {
    data: null,
    buildings: [],
    missions: [],
    questions: {},
    levels: [],
    achievements: [],
    xp: 0,
    level: 1,
    completedMissions: [],
    unlockedAchievements: [],
    currentMission: null,
    currentQuestion: null,
    selectedBuilding: null,
    questionIndex: 0,
    correctAnswers: 0
};

const $ = (id) => document.getElementById(id);

// Cached Selectors
const el = {
    cityModal: $("cityModal"),
    helpButton: $("helpButton"),
    helpModal: $("helpModal"),
    helpClose: $("helpClose"),
    helpOk: $("helpOk"),
    playerLevel: $("playerLevel"),
    playerXP: $("playerXP"),
    xpProgress: $("xpProgress"),
    missionCompleted: $("missionCompleted"),
    missionTotal: $("missionTotal"),
    cityMap: $("cityMap")
};

// Fallback Defaults
const defaultData = {
    levels: [
        { level: 1, requiredXP: 0 },
        { level: 2, requiredXP: 40 },
        { level: 3, requiredXP: 90 },
        { level: 4, requiredXP: 150 },
        { level: 5, requiredXP: 220 }
    ],
    buildings: [
        { id: "mosque", name: "মসজিদ", icon: "🕌", description: "নামাজ সম্পর্কিত চ্যালেঞ্জ ও মৌলিক জ্ঞান。", unlockLevel: 1, mission: "mosque" },
        { id: "quran", name: "কুরআন কেন্দ্র", icon: "📖", description: "কুরআনের আয়াত ও সূরা সম্পর্কিত জ্ঞান।", unlockLevel: 1, mission: "quran" },
        { id: "library", name: "ইসলামিক লাইব্রেরি", icon: "📚", description: "হাদিস ও ইসলামের ইতিহাস সম্পর্কিত প্রশ্ন।", unlockLevel: 2, mission: "hadith" },
        { id: "hajj", name: "হজ কেন্দ্র", icon: "🕋", description: "পবিত্র হজ ও উমরার বিধিবিধান।", unlockLevel: 3, mission: "hajj" },
        { id: "home", name: "আমার বাড়ি", icon: "🏠", description: "আপনার ব্যক্তিগত অর্জন ও প্রগ্রেস প্রোফাইল।", unlockLevel: 1, mission: null }
    ],
    missions: [
        { id: "mosque", title: "নামাজ মিশন", icon: "🕌", description: "সালাত সম্পর্কিত প্রশ্নের সঠিক উত্তর দিন।", unlockLevel: 1, xp: 30, status: "active" },
        { id: "quran", title: "কুরআন মিশন", icon: "📖", description: "কুরআনের প্রাথমিক বিষয়াবলি যাচাই করুন।", unlockLevel: 1, xp: 30, status: "active" },
        { id: "hadith", title: "হাদিস মিশন", icon: "📚", description: "সহিহ হাদিসের জ্ঞান যাচাই করুন।", unlockLevel: 2, xp: 40, status: "active" },
        { id: "hajj", title: "হজ মিশন", icon: "🕋", description: "হজের আহকাম ও শিক্ষণীয় বিষয়।", unlockLevel: 3, xp: 50, status: "active" }
    ],
    questions: {},
    achievements: [
        { id: "first_step", name: "প্রথম পদক্ষেপ", requirement: { type: "missions", value: 1 } },
        { id: "halfway", name: "অর্ধেক পথ", requirement: { type: "missions", value: 2 } },
        { id: "scholar", name: "জ্ঞান অন্বেষী", requirement: { type: "xp", value: 100 } }
    ]
};

/* =========================================================
   SYNTHESIZED AUDIO & HAPTICS (NO EXTERNAL AUDIO FILES)
========================================================= */

const SoundFX = {
    ctx: null,
    init() {
        if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
    },
    playTone(freq, type, duration, delay = 0) {
        try {
            this.init();
            if (!this.ctx) return;
            if (this.ctx.state === "suspended") this.ctx.resume();

            setTimeout(() => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            }, delay);
        } catch (_) {}
    },
    click() {
        this.playTone(400, "sine", 0.05);
    },
    correct() {
        this.playTone(523.25, "sine", 0.1, 0); // C5
        this.playTone(659.25, "sine", 0.15, 100); // E5
        this.playTone(783.99, "sine", 0.25, 200); // G5
        if (navigator.vibrate) navigator.vibrate(40);
    },
    wrong() {
        this.playTone(280, "sawtooth", 0.15, 0);
        this.playTone(220, "sawtooth", 0.25, 120);
        if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
    },
    levelUp() {
        const notes = [440, 554, 659, 880];
        notes.forEach((f, i) => this.playTone(f, "triangle", 0.2, i * 110));
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }
};

/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", init);

async function init() {
    loadProgress();
    bindEvents();
    await loadGameData();
    calculateLevel(false);
    updatePlayerUI();
    updateMissionUI();
    updateBuildingState();
}

/* =========================================================
   DATA LOADER
========================================================= */

async function loadGameData() {
    try {
        const response = await fetch(DATA_URL, { cache: "no-cache" });
        if (!response.ok) throw new Error("Network response failed");
        const data = await response.json();

        state.data = data;
        state.buildings = Array.isArray(data.buildings) ? data.buildings : defaultData.buildings;
        state.missions = Array.isArray(data.missions) ? data.missions : defaultData.missions;
        state.questions = data.questions && typeof data.questions === "object" ? data.questions : defaultData.questions;
        state.levels = Array.isArray(data.levels) ? data.levels : defaultData.levels;
        state.achievements = Array.isArray(data.achievements) ? data.achievements : defaultData.achievements;
    } catch (error) {
        console.warn("Falling back to local default data:", error);
        state.buildings = defaultData.buildings;
        state.missions = defaultData.missions;
        state.questions = defaultData.questions;
        state.levels = defaultData.levels;
        state.achievements = defaultData.achievements;
    }

    if (el.missionTotal) {
        el.missionTotal.textContent = state.missions.filter(m => m && m.status !== "coming-soon").length;
    }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */

function bindEvents() {
    document.querySelectorAll(".city-building").forEach(button => {
        button.addEventListener("click", () => {
            SoundFX.click();
            openBuilding(button.dataset.building);
        });
    });

    document.querySelectorAll(".mission-card").forEach(card => {
        card.addEventListener("click", () => {
            SoundFX.click();
            openMission(card.dataset.mission);
        });
    });

    if (el.helpButton) el.helpButton.addEventListener("click", () => { SoundFX.click(); openHelpModal(); });
    if (el.helpClose) el.helpClose.addEventListener("click", closeHelpModal);
    if (el.helpOk) el.helpOk.addEventListener("click", closeHelpModal);

    const helpOverlay = document.querySelector(".help-overlay");
    if (helpOverlay) helpOverlay.addEventListener("click", closeHelpModal);

    const modalOverlay = el.cityModal?.querySelector(".modal-overlay");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", () => {
            closeCityModal();
            resetQuestionUI();
        });
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCityModal();
            closeHelpModal();
            resetQuestionUI();
        }
    });
}

/* =========================================================
   BUILDING LOGIC
========================================================= */

function openBuilding(buildingId) {
    const building = getBuilding(buildingId);

    if (!building) {
        showToast("এই স্থানটি পাওয়া যায়নি।");
        return;
    }

    if (building.status === "coming-soon") {
        showToast("এই স্থানটি শীঘ্রই চালু হবে।");
        return;
    }

    const requiredLevel = Number(building.unlockLevel || 1);
    if (state.level < requiredLevel) {
        showToast(`এই স্থানটি আনলক করতে Level ${requiredLevel} প্রয়োজন।`);
        return;
    }

    state.selectedBuilding = building;

    if (buildingId === "home") {
        openProfile();
        return;
    }

    const mission = getMission(building.mission);
    const completed = mission ? isMissionCompleted(mission.id) : false;

    renderBuildingModal(building, mission, completed);
    openCityModal();
}

function renderBuildingModal(building, mission, isCompleted) {
    const box = el.cityModal.querySelector(".modal-box");
    if (!box) return;

    box.innerHTML = `
        <button class="modal-close" id="modalClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">${building.icon || "🏛️"}</div>
        <h2 id="modalTitle">${escapeHTML(building.name || "Islamic City")}</h2>
        <p id="modalDescription">${escapeHTML(building.description || "এখানে প্রবেশ করুন।")}</p>
        <button class="modal-action" id="modalAction" type="button" ${isCompleted ? "disabled" : ""}>
            ${isCompleted ? "Mission সম্পন্ন হয়েছে" : (mission ? "Mission শুরু করুন" : "ফিরে যান")}
        </button>
    `;

    $("modalClose").addEventListener("click", closeCityModal);
    $("modalAction").addEventListener("click", () => {
        SoundFX.click();
        if (mission && !isCompleted) {
            closeCityModal();
            openMission(mission.id);
        } else {
            closeCityModal();
        }
    });
}

/* =========================================================
   MISSION LOGIC
========================================================= */

function openMission(missionId) {
    const mission = getMission(missionId);

    if (!mission) {
        showToast("Mission পাওয়া যায়নি।");
        return;
    }

    if (mission.status === "coming-soon") {
        showToast("এই Mission শীঘ্রই চালু হবে।");
        return;
    }

    const requiredLevel = Number(mission.unlockLevel || 1);
    if (state.level < requiredLevel) {
        showToast(`এই Mission-এর জন্য Level ${requiredLevel} প্রয়োজন।`);
        return;
    }

    if (isMissionCompleted(mission.id)) {
        showToast("এই Mission ইতিমধ্যে সম্পন্ন হয়েছে।");
        return;
    }

    const questionList = state.questions[mission.id];
    if (!Array.isArray(questionList) || questionList.length === 0) {
        openSimpleMission(mission);
        return;
    }

    state.currentMission = mission;
    state.questionIndex = 0;
    state.correctAnswers = 0;

    startQuestion();
}

function startQuestion() {
    const mission = state.currentMission;
    if (!mission) return;

    const list = state.questions[mission.id] || [];

    if (state.questionIndex >= list.length) {
        finishMission();
        return;
    }

    const question = list[state.questionIndex];
    state.currentQuestion = question;

    renderQuestion(question, list.length);
    openCityModal();
}

/* =========================================================
   QUESTION RENDERING
========================================================= */

function renderQuestion(question, total) {
    const modal = el.cityModal.querySelector(".modal-box");
    if (!modal) return;

    // Shuffle options to keep challenges fresh
    const rawOptions = Array.isArray(question.options) ? [...question.options] : [];
    const safeOptions = rawOptions.sort(() => Math.random() - 0.5);

    modal.innerHTML = `
        <button class="modal-close" id="questionClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="city-question-progress">প্রশ্ন ${state.questionIndex + 1} / ${total}</div>
        <h2 style="font-size:1.15rem; margin-top:5px;">${escapeHTML(question.question || "প্রশ্ন")}</h2>
        <div class="city-options" id="cityOptions">
            ${safeOptions.map((opt) => `
                <button class="city-option" type="button" data-val="${escapeHTML(opt)}">
                    ${escapeHTML(opt)}
                </button>
            `).join("")}
        </div>
        <div class="city-feedback" id="cityFeedback" style="display:none;"></div>
        <button class="modal-action" id="questionNext" type="button" style="display:none;">
            ${state.questionIndex + 1 >= total ? "ফলাফল দেখুন" : "পরবর্তী প্রশ্ন"}
        </button>
    `;

    $("questionClose").addEventListener("click", () => {
        closeCityModal();
        resetQuestionUI();
    });

    modal.querySelectorAll(".city-option").forEach(btn => {
        btn.addEventListener("click", () => {
            answerQuestion(btn.getAttribute("data-val"));
        });
    });

    $("questionNext").addEventListener("click", () => {
        SoundFX.click();
        state.questionIndex++;
        startQuestion();
    });
}

function answerQuestion(selectedAnswer) {
    const question = state.currentQuestion;
    if (!question) return;

    const buttons = document.querySelectorAll(".city-option");
    buttons.forEach(btn => (btn.disabled = true));

    const correctAnswer = question.answer;
    const isCorrect = normalizeText(selectedAnswer) === normalizeText(correctAnswer);

    if (isCorrect) {
        SoundFX.correct();
        state.correctAnswers++;
    } else {
        SoundFX.wrong();
    }

    buttons.forEach(btn => {
        const val = btn.getAttribute("data-val");
        if (normalizeText(val) === normalizeText(correctAnswer)) {
            btn.classList.add("correct");
        }
        if (normalizeText(val) === normalizeText(selectedAnswer) && !isCorrect) {
            btn.classList.add("wrong");
        }
    });

    const feedback = $("cityFeedback");
    if (feedback) {
        feedback.style.display = "block";
        feedback.className = `city-feedback ${isCorrect ? "success" : "error"}`;
        feedback.innerHTML = isCorrect
            ? `<strong>সঠিক উত্তর!</strong><br>${escapeHTML(question.explanation || "মাশাআল্লাহ, আপনার উত্তর সঠিক।")}`
            : `<strong>সঠিক উত্তর: ${escapeHTML(correctAnswer)}</strong><br>${escapeHTML(question.explanation || "বিশুদ্ধ তথ্যটি মনে রাখুন।")}`;
    }

    const nextBtn = $("questionNext");
    if (nextBtn) nextBtn.style.display = "block";
}

/* =========================================================
   FINISH & RESULTS
========================================================= */

function finishMission() {
    const mission = state.currentMission;
    if (!mission) return;

    const total = (state.questions[mission.id] || []).length;
    const correct = state.correctAnswers;
    const passed = total === 0 || correct >= Math.ceil(total * 0.5);

    let xpGained = 0;
    if (passed && !isMissionCompleted(mission.id)) {
        markMissionCompleted(mission.id);
        xpGained = Number(mission.xp) || 0;
        addXP(xpGained);
        checkAchievements();
        saveProgress();
        updateMissionUI();
        updateBuildingState();
    }

    showResult(mission, correct, total, xpGained, passed);
    state.currentMission = null;
    state.currentQuestion = null;
}

function showResult(mission, correct, total, xp, passed) {
    const modal = el.cityModal.querySelector(".modal-box");
    if (!modal) return;

    modal.innerHTML = `
        <button class="modal-close" id="resultClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">${passed ? "🌟" : "📖"}</div>
        <h2>${passed ? "Mission সম্পন্ন!" : "আবার চেষ্টা করুন"}</h2>
        <p>${escapeHTML(mission.title)}</p>
        <div class="city-result">
            <strong>${correct}</strong>
            <span>/ ${total} সঠিক</span>
        </div>
        ${xp > 0 ? `<div class="city-reward">+${xp} XP অর্জিত</div>` : ""}
        <p style="margin-top:10px;">
            ${passed ? "অভিনন্দন! আপনার ইসলামিক জ্ঞানের ভাণ্ডার সমৃদ্ধ হয়েছে।" : "চেষ্টা চালিয়ে যান, পুনরায় চেষ্টা করে জ্ঞান পোক্ত করুন।"}
        </p>
        <button class="modal-action" id="resultButton" type="button">শহরে ফিরে যান</button>
    `;

    $("resultClose").addEventListener("click", closeCityModal);
    $("resultButton").addEventListener("click", () => {
        SoundFX.click();
        closeCityModal();
    });
}

function openSimpleMission(mission) {
    const modal = el.cityModal.querySelector(".modal-box");
    if (!modal) return;

    modal.innerHTML = `
        <button class="modal-close" id="simpleClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">${mission.icon || "🎯"}</div>
        <h2>${escapeHTML(mission.title)}</h2>
        <p>${escapeHTML(mission.description || "")}</p>
        <p style="color:#00796b;">এই Mission-এর নিয়মিত প্রশ্নাবলি শীঘ্রই যুক্ত করা হচ্ছে।</p>
        <button class="modal-action" id="simpleComplete" type="button">Mission সম্পন্ন করুন</button>
    `;

    $("simpleClose").addEventListener("click", closeCityModal);
    $("simpleComplete").addEventListener("click", () => {
        markMissionCompleted(mission.id);
        const xp = Number(mission.xp) || 0;
        addXP(xp);
        checkAchievements();
        saveProgress();
        updateMissionUI();
        updateBuildingState();
        closeCityModal();
        showToast(`Mission সম্পন্ন! +${xp} XP`);
    });

    openCityModal();
}

/* =========================================================
   XP & LEVEL ENGINE
========================================================= */

function addXP(amount) {
    amount = Number(amount) || 0;
    if (amount <= 0) return;

    const oldLevel = state.level;
    state.xp += amount;
    calculateLevel(true);
    updatePlayerUI();
    saveProgress();
}

function calculateLevel(notify = false) {
    let targetLevel = 1;

    if (Array.isArray(state.levels) && state.levels.length) {
        const sorted = [...state.levels].sort((a, b) => Number(a.requiredXP || 0) - Number(b.requiredXP || 0));
        sorted.forEach(lvl => {
            if (state.xp >= Number(lvl.requiredXP || 0)) {
                targetLevel = Number(lvl.level || 1);
            }
        });
    } else {
        targetLevel = Math.floor(state.xp / 100) + 1;
    }

    const previousLevel = state.level;
    state.level = Math.max(1, targetLevel);

    if (notify && state.level > previousLevel) {
        SoundFX.levelUp();
        showToast(`🎉 অভিনন্দন! আপনি Level ${state.level}-এ উত্তীর্ণ হয়েছেন!`);
        checkAchievements();
    }
}

function updatePlayerUI() {
    if (el.playerLevel) el.playerLevel.textContent = state.level;
    if (el.playerXP) el.playerXP.textContent = state.xp;
    if (!el.xpProgress) return;

    let currentFloor = 0;
    let nextCap = 100;

    const sorted = [...state.levels].sort((a, b) => Number(a.requiredXP || 0) - Number(b.requiredXP || 0));
    const currObj = sorted.find(l => Number(l.level) === state.level);
    const nextObj = sorted.find(l => Number(l.level) === state.level + 1);

    if (currObj) currentFloor = Number(currObj.requiredXP || 0);
    if (nextObj) {
        nextCap = Number(nextObj.requiredXP || currentFloor + 100);
    } else {
        nextCap = currentFloor + 100;
    }

    const range = Math.max(1, nextCap - currentFloor);
    const currentProgress = Math.max(0, state.xp - currentFloor);
    const percentage = Math.min(100, (currentProgress / range) * 100);

    el.xpProgress.style.width = `${percentage}%`;
}

function updateMissionUI() {
    const available = state.missions.filter(m => m && m.status !== "coming-soon");
    const completed = available.filter(m => isMissionCompleted(m.id)).length;

    if (el.missionCompleted) el.missionCompleted.textContent = completed;
    if (el.missionTotal) el.missionTotal.textContent = available.length;

    document.querySelectorAll(".mission-card").forEach(card => {
        const id = card.dataset.mission;
        const mission = getMission(id);
        if (!mission) return;

        const xpEl = card.querySelector(".mission-xp");
        if (isMissionCompleted(id)) {
            card.classList.add("completed");
            card.style.opacity = "0.65";
            if (xpEl) xpEl.textContent = "সম্পন্ন ✓";
        } else {
            card.classList.remove("completed");
            card.style.opacity = "1";
            if (xpEl) xpEl.textContent = `+${Number(mission.xp) || 0} XP`;
        }
    });
}

function updateBuildingState() {
    document.querySelectorAll(".city-building").forEach(btn => {
        const id = btn.dataset.building;
        const building = getBuilding(id);
        if (!building) return;

        const reqLevel = Number(building.unlockLevel || 1);
        if (building.status === "coming-soon" || state.level < reqLevel) {
            btn.classList.add("locked");
        } else {
            btn.classList.remove("locked");
        }

        if (building.mission && isMissionCompleted(building.mission)) {
            btn.classList.add("completed");
        }
    });
}

/* =========================================================
   ACHIEVEMENTS SYSTEM
========================================================= */

function checkAchievements() {
    if (!Array.isArray(state.achievements)) return;

    state.achievements.forEach(ach => {
        if (!ach || !ach.id || state.unlockedAchievements.includes(ach.id)) return;
        const req = ach.requirement;
        if (!req) return;

        let pass = false;
        if (req.type === "xp") pass = state.xp >= Number(req.value || 0);
        if (req.type === "missions") pass = state.completedMissions.length >= Number(req.value || 0);

        if (pass) {
            state.unlockedAchievements.push(ach.id);
            saveProgress();
            showToast(`🏆 Achievement অর্জিত: ${ach.name}`);
        }
    });
}

/* =========================================================
   PROFILE VIEW
========================================================= */

function openProfile() {
    const modal = el.cityModal.querySelector(".modal-box");
    if (!modal) return;

    const total = state.missions.filter(m => m && m.status !== "coming-soon").length;
    const completed = state.completedMissions.length;

    modal.innerHTML = `
        <button class="modal-close" id="profileClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">🏠</div>
        <h2>আমার প্রোফাইল</h2>
        <div class="city-profile">
            <div><strong>লেভেল</strong><span>${state.level}</span></div>
            <div><strong>অর্জিত XP</strong><span>${state.xp}</span></div>
            <div><strong>সম্পন্ন মিশন</strong><span>${completed}/${total}</span></div>
            <div><strong>অর্জনসমূহ</strong><span>${state.unlockedAchievements.length}</span></div>
        </div>
        <button class="modal-action" id="profileCloseBtn" type="button">ফিরে যান</button>
    `;

    $("profileClose").addEventListener("click", closeCityModal);
    $("profileCloseBtn").addEventListener("click", closeCityModal);
    openCityModal();
}

/* =========================================================
   MODAL CONTROLLERS & TOAST
========================================================= */

function openCityModal() {
    if (!el.cityModal) return;
    el.cityModal.classList.add("active");
    el.cityModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeCityModal() {
    if (!el.cityModal) return;
    el.cityModal.classList.remove("active");
    el.cityModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    state.selectedBuilding = null;
}

function resetQuestionUI() {
    state.currentMission = null;
    state.currentQuestion = null;
    state.questionIndex = 0;
    state.correctAnswers = 0;
}

function openHelpModal() {
    if (!el.helpModal) return;
    el.helpModal.classList.add("active");
    el.helpModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeHelpModal() {
    if (!el.helpModal) return;
    el.helpModal.classList.remove("active");
    el.helpModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

let toastTimer = null;
function showToast(message) {
    let toast = $("cityToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "cityToast";
        Object.assign(toast.style, {
            position: "fixed",
            left: "50%",
            bottom: "25px",
            transform: "translateX(-50%)",
            zIndex: "3000",
            background: "#004d40",
            color: "#fff",
            padding: "11px 20px",
            borderRadius: "30px",
            fontSize: "13px",
            maxWidth: "90%",
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            opacity: "0",
            pointerEvents: "none"
        });
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(10px)";
    }, 2800);
                  }

/* =========================================================
   STORAGE HELPERS
========================================================= */

function saveProgress() {
    try {
        const payload = {
            xp: state.xp,
            level: state.level,
            completedMissions: [...state.completedMissions],
            unlockedAchievements: [...state.unlockedAchievements]
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn("Storage save failed:", e);
    }
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (typeof data.xp === "number") state.xp = data.xp;
        if (typeof data.level === "number") state.level = data.level;
        if (Array.isArray(data.completedMissions)) state.completedMissions = data.completedMissions;
        if (Array.isArray(data.unlockedAchievements)) state.unlockedAchievements = data.unlockedAchievements;
    } catch (e) {
        console.warn("Storage load failed:", e);
    }
}

function markMissionCompleted(id) {
    if (id && !state.completedMissions.includes(id)) {
        state.completedMissions.push(id);
    }
}

function isMissionCompleted(id) {
    return state.completedMissions.includes(id);
}

function getBuilding(id) {
    return state.buildings.find(b => b.id === id);
}

function getMission(id) {
    return state.missions.find(m => m.id === id);
}

function normalizeText(val) {
    return String(val || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function escapeHTML(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================================
   EXPOSED CONTROLS
========================================================= */

window.IslamicCity = {
    getProgress: () => ({
        xp: state.xp,
        level: state.level,
        completedMissions: [...state.completedMissions]
    }),
    addXP: (amount) => addXP(amount),
    resetProgress: () => {
        if (confirm("আপনার সকল অগ্রগতি রিসেট করতে চান?")) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    }
};
