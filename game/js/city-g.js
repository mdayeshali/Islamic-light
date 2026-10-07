/* =========================================================
   ISLAMIC CITY
   city-g.js
   Islamic Light
========================================================= */

"use strict";

const DATA_URL = "data/city-g.json";
const STORAGE_KEY = "islamicCityProgress";

const state = {
    buildings: [],
    missions: [],
    xp: 0,
    level: 1,
    completedMissions: [],
    selectedBuilding: null
};

const $ = id => document.getElementById(id);

const elements = {
    cityMap: $("cityMap"),
    cityModal: $("cityModal"),
    modalIcon: $("modalIcon"),
    modalTitle: $("modalTitle"),
    modalDescription: $("modalDescription"),
    modalAction: $("modalAction"),
    modalClose: $("modalClose"),
    helpButton: $("helpButton"),
    helpModal: $("helpModal"),
    helpClose: $("helpClose"),
    helpOk: $("helpOk"),
    playerLevel: $("playerLevel"),
    playerXP: $("playerXP"),
    xpProgress: $("xpProgress"),
    missionCompleted: $("missionCompleted"),
    missionTotal: $("missionTotal")
};


/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultData = {
    buildings: [
        {
            id: "mosque",
            name: "মসজিদ",
            icon: "🕌",
            type: "Salah Challenge",
            description: "মসজিদে প্রবেশ করে নামাজ সম্পর্কিত শিক্ষামূলক Mission সম্পন্ন করুন।",
            mission: "mosque"
        },
        {
            id: "quran",
            name: "কুরআন কেন্দ্র",
            icon: "📖",
            type: "Quran Challenge",
            description: "কুরআন সম্পর্কিত প্রশ্নের উত্তর দিয়ে আপনার জ্ঞান যাচাই করুন।",
            mission: "quran"
        },
        {
            id: "library",
            name: "ইসলামিক লাইব্রেরি",
            icon: "📚",
            type: "Hadith Challenge",
            description: "হাদিস সম্পর্কে বিভিন্ন শিক্ষামূলক Challenge সম্পন্ন করুন।",
            mission: "hadith"
        },
        {
            id: "hajj",
            name: "হজ কেন্দ্র",
            icon: "🕋",
            type: "Hajj Challenge",
            description: "হজ ও উমরাহ সম্পর্কে বিভিন্ন বিষয় শিখুন।",
            mission: "hajj"
        },
        {
            id: "home",
            name: "আমার বাড়ি",
            icon: "🏠",
            type: "Profile",
            description: "আপনার Islamic City Profile ও অগ্রগতি দেখুন।",
            mission: null
        }
    ],
    missions: [
        {
            id: "mosque",
            title: "মসজিদ Mission",
            description: "নামাজ সম্পর্কিত একটি Challenge সম্পন্ন করুন।",
            xp: 20
        },
        {
            id: "quran",
            title: "কুরআন Mission",
            description: "কুরআন সম্পর্কিত একটি প্রশ্নের উত্তর দিন।",
            xp: 20
        },
        {
            id: "hadith",
            title: "হাদিস Mission",
            description: "হাদিস সম্পর্কে আপনার জ্ঞান যাচাই করুন।",
            xp: 20
        },
        {
            id: "hajj",
            title: "হজ Mission",
            description: "হজ সম্পর্কে একটি শিক্ষামূলক Challenge সম্পন্ন করুন।",
            xp: 20
        }
    ]
};


/* =========================================================
   INIT
========================================================= */

document.addEventListener("DOMContentLoaded", init);

async function init() {
    loadProgress();
    bindEvents();
    await loadGameData();
    updatePlayerUI();
    updateMissionUI();
}


/* =========================================================
   LOAD JSON DATA
========================================================= */

async function loadGameData() {
    try {
        const response = await fetch(DATA_URL, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error("Data file could not be loaded.");
        }

        const data = await response.json();

        state.buildings = Array.isArray(data.buildings)
            ? data.buildings
            : defaultData.buildings;

        state.missions = Array.isArray(data.missions)
            ? data.missions
            : defaultData.missions;

    } catch (error) {
        console.warn("Using default Islamic City data:", error);

        state.buildings = defaultData.buildings;
        state.missions = defaultData.missions;
    }

    state.missions = state.missions.filter(
        mission => mission && mission.id
    );

    state.buildings = state.buildings.filter(
        building => building && building.id
    );

    elements.missionTotal.textContent = state.missions.length;
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents() {
    document.querySelectorAll(".city-building").forEach(button => {
        button.addEventListener("click", () => {
            const id = button.dataset.building;
            openBuilding(id);
        });
    });

    document.querySelectorAll(".mission-card").forEach(card => {
        card.addEventListener("click", () => {
            const id = card.dataset.mission;
            openMission(id);
        });
    });

    elements.modalClose.addEventListener("click", closeCityModal);

    elements.helpButton.addEventListener("click", openHelpModal);

    elements.helpClose.addEventListener("click", closeHelpModal);

    elements.helpOk.addEventListener("click", closeHelpModal);

    document.querySelector(".modal-overlay").addEventListener(
        "click",
        closeCityModal
    );

    document.querySelector(".help-overlay").addEventListener(
        "click",
        closeHelpModal
    );

    elements.modalAction.addEventListener(
        "click",
        handleModalAction
    );

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCityModal();
            closeHelpModal();
        }
    });
}


/* =========================================================
   BUILDING
========================================================= */

function openBuilding(buildingId) {
    const building = state.buildings.find(
        item => item.id === buildingId
    );

    if (!building) return;

    state.selectedBuilding = building;

    elements.modalIcon.textContent =
        building.icon || "🏠";

    elements.modalTitle.textContent =
        building.name || "Islamic City";

    elements.modalDescription.textContent =
        building.description || "এই জায়গাটি সম্পর্কে শিখুন।";

    if (building.mission) {
        const mission = getMission(building.mission);

        if (mission && isMissionCompleted(mission.id)) {
            elements.modalAction.textContent =
                "Mission সম্পন্ন হয়েছে";

            elements.modalAction.disabled = true;
        } else {
            elements.modalAction.textContent =
                "Mission শুরু করুন";

            elements.modalAction.disabled = false;
        }

    } else {
        elements.modalAction.textContent =
            "Profile দেখুন";

        elements.modalAction.disabled = false;
    }

    openCityModal();
}


/* =========================================================
   MODAL ACTION
========================================================= */

function handleModalAction() {
    const building = state.selectedBuilding;

    if (!building) return;

    if (building.id === "home") {
        closeCityModal();
        showProfileMessage();
        return;
    }

    if (building.mission) {
        closeCityModal();
        openMission(building.mission);
    }
}


/* =========================================================
   MISSION
========================================================= */

function openMission(missionId) {
    const mission = getMission(missionId);

    if (!mission) {
        showToast("Mission পাওয়া যায়নি।");
        return;
    }

    if (isMissionCompleted(mission.id)) {
        showToast("এই Mission ইতিমধ্যে সম্পন্ন হয়েছে।");
        return;
    }

    state.selectedBuilding = {
        id: "mission",
        name: mission.title,
        icon: "🎯",
        description: mission.description,
        mission: mission.id
    };

    elements.modalIcon.textContent = "🎯";
    elements.modalTitle.textContent = mission.title;

    elements.modalDescription.textContent =
        mission.description +
        " সঠিকভাবে সম্পন্ন করলে " +
        mission.xp +
        " XP অর্জন করবেন।";

    elements.modalAction.textContent =
        "Mission সম্পন্ন করুন";

    elements.modalAction.disabled = false;

    openCityModal();
}


/* =========================================================
   COMPLETE MISSION
========================================================= */

function completeMission(missionId) {
    const mission = getMission(missionId);

    if (!mission) return;

    if (isMissionCompleted(mission.id)) {
        showToast("এই Mission ইতিমধ্যে সম্পন্ন হয়েছে।");
        return;
    }

    state.completedMissions.push(mission.id);

    addXP(Number(mission.xp) || 0);

    saveProgress();

    updateMissionUI();

    closeCityModal();

    showToast(
        "Mission সম্পন্ন! +" +
        (Number(mission.xp) || 0) +
        " XP"
    );
}


/* =========================================================
   XP SYSTEM
========================================================= */

function addXP(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
        return;
    }

    state.xp += amount;

    calculateLevel();

    updatePlayerUI();

    saveProgress();
}


function calculateLevel() {
    const xpPerLevel = 100;

    const newLevel =
        Math.floor(state.xp / xpPerLevel) + 1;

    if (newLevel > state.level) {
        state.level = newLevel;

        showToast(
            "অভিনন্দন! আপনি Level " +
            state.level +
            " এ পৌঁছেছেন।"
        );
    } else {
        state.level = newLevel;
    }
}


/* =========================================================
   PLAYER UI
========================================================= */

function updatePlayerUI() {
    elements.playerLevel.textContent =
        state.level;

    elements.playerXP.textContent =
        state.xp;

    const xpPerLevel = 100;

    const currentLevelXP =
        state.xp % xpPerLevel;

    const percentage =
        (currentLevelXP / xpPerLevel) * 100;

    elements.xpProgress.style.width =
        percentage + "%";
}


/* =========================================================
   MISSION UI
========================================================= */

function updateMissionUI() {
    const completed =
        state.completedMissions.length;

    elements.missionCompleted.textContent =
        completed;

    document.querySelectorAll(".mission-card").forEach(
        card => {
            const missionId =
                card.dataset.mission;

            if (isMissionCompleted(missionId)) {
                card.classList.add("completed");

                card.style.opacity = "0.60";

                const xp = card.querySelector(".mission-xp");

                if (xp) {
                    xp.textContent = "সম্পন্ন";
                }
            }
        }
    );
}


/* =========================================================
   HELPERS
========================================================= */

function getMission(id) {
    return state.missions.find(
        mission => mission.id === id
    );
}


function isMissionCompleted(id) {
    return state.completedMissions.includes(id);
}


/* =========================================================
   CITY MODAL
========================================================= */

function openCityModal() {
    elements.cityModal.classList.add("active");
    elements.cityModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


function closeCityModal() {
    elements.cityModal.classList.remove("active");
    elements.cityModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================================
   HELP MODAL
========================================================= */

function openHelpModal() {
    elements.helpModal.classList.add("active");
    elements.helpModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";
}


function closeHelpModal() {
    elements.helpModal.classList.remove("active");
    elements.helpModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";
}


/* =========================================================
   PROFILE
========================================================= */

function showProfileMessage() {
    const total =
        state.missions.length;

    const completed =
        state.completedMissions.length;

    showToast(
        "Level " +
        state.level +
        " | XP " +
        state.xp +
        " | Mission " +
        completed +
        "/" +
        total
    );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;

function showToast(message) {
    let toast =
        document.getElementById("cityToast");

    if (!toast) {
        toast = document.createElement("div");

        toast.id = "cityToast";

        toast.style.position = "fixed";
        toast.style.left = "50%";
        toast.style.bottom = "25px";
        toast.style.transform = "translateX(-50%)";
        toast.style.zIndex = "2000";
        toast.style.background = "#004d40";
        toast.style.color = "#ffffff";
        toast.style.padding = "11px 18px";
        toast.style.borderRadius = "10px";
        toast.style.fontSize = "13px";
        toast.style.maxWidth = "90%";
        toast.style.textAlign = "center";
        toast.style.boxShadow =
            "0 5px 18px rgba(0,0,0,0.25)";

        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
    }, 2500);
}


/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveProgress() {
    try {
        const data = {
            xp: state.xp,
            level: state.level,
            completedMissions:
                state.completedMissions
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    } catch (error) {
        console.warn(
            "Progress could not be saved:",
            error
        );
    }
}


function loadProgress() {
    try {
        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        const data =
            JSON.parse(saved);

        if (
            typeof data.xp === "number" &&
            data.xp >= 0
        ) {
            state.xp = data.xp;
        }

        if (
            typeof data.level === "number" &&
            data.level >= 1
        ) {
            state.level = data.level;
        }

        if (
            Array.isArray(
                data.completedMissions
            )
        ) {
            state.completedMissions =
                data.completedMissions;
        }

        calculateLevel();

    } catch (error) {
        console.warn(
            "Saved progress could not be loaded:",
            error
        );
    }
}


/* =========================================================
   RESET PROGRESS
   ভবিষ্যতে Profile থেকে ব্যবহার করা যাবে
========================================================= */

function resetProgress() {
    const confirmed = confirm(
        "আপনার Islamic City-এর সব অগ্রগতি মুছে ফেলতে চান?"
    );

    if (!confirmed) return;

    state.xp = 0;
    state.level = 1;
    state.completedMissions = [];

    localStorage.removeItem(STORAGE_KEY);

    updatePlayerUI();
    updateMissionUI();

    showToast(
        "আপনার অগ্রগতি পুনরায় শুরু হয়েছে।"
    );
}


/* =========================================================
   GLOBAL ACCESS
   ভবিষ্যতে Profile / Settings থেকে ব্যবহারযোগ্য
========================================================= */

window.IslamicCity = {
    getProgress() {
        return {
            xp: state.xp,
            level: state.level,
            completedMissions:
                [...state.completedMissions]
        };
    },

    resetProgress
};
