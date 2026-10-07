"use strict";

const DATA_URL="data/city-g.json";
const STORAGE_KEY="islamicCityProgress";

const state={
    data:null,
    buildings:[],
    missions:[],
    questions:{},
    levels:[],
    achievements:[],
    xp:0,
    level:1,
    completedMissions:[],
    unlockedAchievements:[],
    currentMission:null,
    currentQuestion:null,
    selectedBuilding:null,
    questionIndex:0,
    correctAnswers:0
};

const $=id=>document.getElementById(id);

const el={
    cityModal:$("cityModal"),
    modalIcon:$("modalIcon"),
    modalTitle:$("modalTitle"),
    modalDescription:$("modalDescription"),
    modalAction:$("modalAction"),
    modalClose:$("modalClose"),
    helpButton:$("helpButton"),
    helpModal:$("helpModal"),
    helpClose:$("helpClose"),
    helpOk:$("helpOk"),
    playerLevel:$("playerLevel"),
    playerXP:$("playerXP"),
    xpProgress:$("xpProgress"),
    missionCompleted:$("missionCompleted"),
    missionTotal:$("missionTotal"),
    cityMap:$("cityMap")
};

const defaultData={
    buildings:[],
    missions:[],
    questions:{},
    levels:[],
    achievements:[]
};

document.addEventListener("DOMContentLoaded",init);

async function init(){
    loadProgress();
    bindEvents();
    await loadGameData();
    calculateLevel(false);
    updatePlayerUI();
    updateMissionUI();
    updateBuildingState();
}


/* =========================================================
   LOAD GAME DATA
========================================================= */

async function loadGameData(){
    try{
        const response=await fetch(DATA_URL,{cache:"no-cache"});

        if(!response.ok) throw new Error("JSON load failed");

        const data=await response.json();

        state.data=data;
        state.buildings=Array.isArray(data.buildings)?data.buildings:defaultData.buildings;
        state.missions=Array.isArray(data.missions)?data.missions:defaultData.missions;
        state.questions=data.questions&&typeof data.questions==="object"?data.questions:defaultData.questions;
        state.levels=Array.isArray(data.levels)?data.levels:defaultData.levels;
        state.achievements=Array.isArray(data.achievements)?data.achievements:defaultData.achievements;

    }catch(error){
        console.warn("Islamic City JSON load failed:",error);

        state.data=defaultData;
        state.buildings=defaultData.buildings;
        state.missions=defaultData.missions;
        state.questions=defaultData.questions;
        state.levels=defaultData.levels;
        state.achievements=defaultData.achievements;
    }

    if(el.missionTotal){
        el.missionTotal.textContent=state.missions.filter(
            m=>m&&m.status!=="coming-soon"
        ).length;
    }
}


/* =========================================================
   EVENTS
========================================================= */

function bindEvents(){

    document.querySelectorAll(".city-building").forEach(button=>{
        button.addEventListener("click",()=>{
            openBuilding(button.dataset.building);
        });
    });

    document.querySelectorAll(".mission-card").forEach(card=>{
        card.addEventListener("click",()=>{
            openMission(card.dataset.mission);
        });
    });

    if(el.modalClose){
        el.modalClose.addEventListener("click",closeCityModal);
    }

    if(el.helpButton){
        el.helpButton.addEventListener("click",openHelpModal);
    }

    if(el.helpClose){
        el.helpClose.addEventListener("click",closeHelpModal);
    }

    if(el.helpOk){
        el.helpOk.addEventListener("click",closeHelpModal);
    }

    const modalOverlay=document.querySelector(".modal-overlay");
    const helpOverlay=document.querySelector(".help-overlay");

    if(modalOverlay){
        modalOverlay.addEventListener("click",closeCityModal);
    }

    if(helpOverlay){
        helpOverlay.addEventListener("click",closeHelpModal);
    }

    if(el.modalAction){
        el.modalAction.addEventListener("click",handleModalAction);
    }

    document.addEventListener("keydown",event=>{
        if(event.key==="Escape"){
            closeCityModal();
            closeHelpModal();
        }
    });
}


/* =========================================================
   BUILDING
========================================================= */

function openBuilding(buildingId){

    const building=getBuilding(buildingId);

    if(!building){
        showToast("এই স্থানটি পাওয়া যায়নি।");
        return;
    }

    if(building.status==="coming-soon"){
        showToast("এই স্থানটি শীঘ্রই চালু হবে।");
        return;
    }

    const requiredLevel=Number(building.unlockLevel||1);

    if(state.level<requiredLevel){
        showToast(
            "এই স্থানটি খুলতে Level "+requiredLevel+
            " প্রয়োজন।"
        );
        return;
    }

    state.selectedBuilding=building;

    if(buildingId==="home"){
        openProfile();
        return;
    }

    el.modalIcon.textContent=building.icon||"🏠";
    el.modalTitle.textContent=building.name||"Islamic City";
    el.modalDescription.textContent=building.description||"এখানে প্রবেশ করুন।";

    const mission=getMission(building.mission);

    if(mission&&isMissionCompleted(mission.id)){
        el.modalAction.textContent="Mission সম্পন্ন হয়েছে";
        el.modalAction.disabled=true;
    }else if(mission){
        el.modalAction.textContent="Mission শুরু করুন";
        el.modalAction.disabled=false;
    }else{
        el.modalAction.textContent="বন্ধ করুন";
        el.modalAction.disabled=false;
    }

    openCityModal();
}


/* =========================================================
   MODAL ACTION
========================================================= */

function handleModalAction(){

    const building=state.selectedBuilding;

    if(!building){
        closeCityModal();
        return;
    }

    if(building.mission){
        closeCityModal();
        openMission(building.mission);
    }else{
        closeCityModal();
    }
}


/* =========================================================
   OPEN MISSION
========================================================= */

function openMission(missionId){

    const mission=getMission(missionId);

    if(!mission){
        showToast("Mission পাওয়া যায়নি।");
        return;
    }

    if(mission.status==="coming-soon"){
        showToast("এই Mission শীঘ্রই আসবে।");
        return;
    }

    const requiredLevel=Number(mission.unlockLevel||1);

    if(state.level<requiredLevel){
        showToast(
            "এই Mission-এর জন্য Level "+
            requiredLevel+" প্রয়োজন।"
        );
        return;
    }

    if(isMissionCompleted(mission.id)){
        showToast("এই Mission ইতিমধ্যে সম্পন্ন হয়েছে।");
        return;
    }

    const questionList=state.questions[mission.id];

    if(!Array.isArray(questionList)||questionList.length===0){
        openSimpleMission(mission);
        return;
    }

    state.currentMission=mission;
    state.questionIndex=0;
    state.correctAnswers=0;

    startQuestion();
}


/* =========================================================
   START QUESTION
========================================================= */

function startQuestion(){

    const mission=state.currentMission;

    if(!mission){
        closeCityModal();
        return;
    }

    const list=state.questions[mission.id]||[];

    if(state.questionIndex>=list.length){
        finishMission();
        return;
    }

    const question=list[state.questionIndex];

    if(!question){
        finishMission();
        return;
    }

    state.currentQuestion=question;

    renderQuestion(question,list.length);

    openCityModal();
}


/* =========================================================
   QUESTION UI
========================================================= */

function renderQuestion(question,total){

    const modal=el.cityModal.querySelector(".modal-box");

    if(!modal) return;

    const safeOptions=Array.isArray(question.options)
        ?question.options:[ ];

    modal.innerHTML=`
        <button class="modal-close" id="questionClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">🎯</div>
        <div class="city-question-progress">
            প্রশ্ন ${state.questionIndex+1} / ${total}
        </div>
        <h2>${escapeHTML(question.question||"প্রশ্ন")}</h2>
        <div class="city-options" id="cityOptions">
            ${safeOptions.map((option,index)=>`
                <button class="city-option" type="button" data-index="${index}">
                    ${escapeHTML(option)}
                </button>
            `).join("")}
        </div>
        <div class="city-feedback" id="cityFeedback"></div>
        <button class="modal-action" id="questionNext" type="button" disabled>
            পরবর্তী
        </button>
    `;

    const closeButton=$("questionClose");
    const nextButton=$("questionNext");

    if(closeButton){
        closeButton.addEventListener("click",()=>{
            closeCityModal();
            resetQuestionUI();
        });
    }

    document.querySelectorAll(".city-option").forEach(button=>{
        button.addEventListener("click",()=>{
            answerQuestion(Number(button.dataset.index));
        });
    });

    if(nextButton){
        nextButton.addEventListener("click",()=>{
            state.questionIndex++;
            startQuestion();
        });
    }
}


/* =========================================================
   ANSWER QUESTION
========================================================= */

function answerQuestion(selectedIndex){

    const question=state.currentQuestion;

    if(!question) return;

    const options=Array.isArray(question.options)
        ?question.options:[];

    if(selectedIndex<0||selectedIndex>=options.length) return;

    const buttons=document.querySelectorAll(".city-option");

    buttons.forEach(button=>{
        button.disabled=true;
    });

    const selectedAnswer=options[selectedIndex];
    const correctAnswer=question.answer;

    const isCorrect=normalizeText(selectedAnswer)===
        normalizeText(correctAnswer);

    buttons.forEach((button,index)=>{
        const option=options[index];

        if(normalizeText(option)===
            normalizeText(correctAnswer)){
            button.classList.add("correct");
        }

        if(index===selectedIndex&&!isCorrect){
            button.classList.add("wrong");
        }
    });

    const feedback=$("cityFeedback");

    if(feedback){

        feedback.className=
            "city-feedback "+(isCorrect?"success":"error");

        if(isCorrect){
            state.correctAnswers++;

            feedback.innerHTML=
                "<strong>সঠিক উত্তর</strong><br>"+
                escapeHTML(
                    question.explanation||
                    "আপনার উত্তর সঠিক।"
                );
        }else{
            feedback.innerHTML=
                "<strong>সঠিক উত্তর: "+
                escapeHTML(correctAnswer)+
                "</strong><br>"+
                escapeHTML(
                    question.explanation||
                    "এই প্রশ্নের সঠিক উত্তরটি উপরে দেখানো হয়েছে।"
                );
        }
    }

    const nextButton=$("questionNext");

    if(nextButton){
        nextButton.disabled=false;

        nextButton.textContent=
            state.questionIndex+1>=
            (state.questions[state.currentMission.id]||[]).length
            ?"ফলাফল দেখুন"
            :"পরবর্তী প্রশ্ন";
    }
}


/* =========================================================
   FINISH MISSION
========================================================= */

function finishMission(){

    const mission=state.currentMission;

    if(!mission){
        closeCityModal();
        return;
    }

    const total=
        (state.questions[mission.id]||[]).length;

    const correct=state.correctAnswers;

    const passed=
        total===0||
        correct>0;

    if(passed&&!isMissionCompleted(mission.id)){

        markMissionCompleted(mission.id);

        const xp=Number(mission.xp)||0;

        addXP(xp);

        checkAchievements();

        saveProgress();

        updateMissionUI();
        updateBuildingState();

        showResult(
            mission,
            correct,
            total,
            xp
        );

    }else{

        showResult(
            mission,
            correct,
            total,
            0
        );
    }

    state.currentMission=null;
    state.currentQuestion=null;
}


/* =========================================================
   RESULT
========================================================= */

function showResult(mission,correct,total,xp){

    const modal=el.cityModal.querySelector(".modal-box");

    if(!modal) return;

    const passed=total===0||correct>0;

    modal.innerHTML=`
        <button class="modal-close" id="resultClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">${passed?"🏆":"📚"}</div>
        <h2>${passed?"Mission সম্পন্ন":"আবার চেষ্টা করুন"}</h2>
        <p>
            ${escapeHTML(mission.title)}
        </p>
        <div class="city-result">
            <strong>${correct}</strong>
            <span>/ ${total} সঠিক</span>
        </div>
        ${xp>0?`
            <div class="city-reward">
                +${xp} XP
            </div>
        `:""}
        <p>
            ${passed
                ?"আপনি এই Mission সম্পন্ন করেছেন।"
                :"আরও একবার চেষ্টা করে দেখুন।"}
        </p>
        <button class="modal-action" id="resultButton" type="button">
            শহরে ফিরে যান
        </button>
    `;

    const close=$("resultClose");
    const button=$("resultButton");

    if(close){
        close.addEventListener("click",closeCityModal);
    }

    if(button){
        button.addEventListener("click",closeCityModal);
    }
}


/* =========================================================
   SIMPLE MISSION
========================================================= */

function openSimpleMission(mission){

    const modal=el.cityModal.querySelector(".modal-box");

    if(!modal) return;

    modal.innerHTML=`
        <button class="modal-close" id="simpleClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">${mission.icon||"🎯"}</div>
        <h2>${escapeHTML(mission.title)}</h2>
        <p>${escapeHTML(mission.description||"")}</p>
        <p>
            এই Mission-এর প্রশ্নগুলো শীঘ্রই যুক্ত করা হবে।
        </p>
        <button class="modal-action" id="simpleComplete" type="button">
            Demo Mission সম্পন্ন করুন
        </button>
    `;

    const close=$("simpleClose");
    const complete=$("simpleComplete");

    if(close){
        close.addEventListener("click",closeCityModal);
    }

    if(complete){
        complete.addEventListener("click",()=>{
            markMissionCompleted(mission.id);

            const xp=Number(mission.xp)||0;

            addXP(xp);
            checkAchievements();
            saveProgress();
            updateMissionUI();
            updateBuildingState();

            closeCityModal();

            showToast(
                "Mission সম্পন্ন! +"+xp+" XP"
            );
        });
    }

    openCityModal();
}


/* =========================================================
   MISSION COMPLETE
========================================================= */

function markMissionCompleted(id){

    if(!id) return;

    if(!state.completedMissions.includes(id)){
        state.completedMissions.push(id);
    }
}


function isMissionCompleted(id){
    return state.completedMissions.includes(id);
}


/* =========================================================
   XP SYSTEM
========================================================= */

function addXP(amount){

    amount=Number(amount)||0;

    if(amount<=0) return;

    const oldLevel=state.level;

    state.xp+=amount;

    calculateLevel(false);

    updatePlayerUI();

    if(state.level>oldLevel){

        showToast(
            "অভিনন্দন! আপনি Level "+
            state.level+
            " এ পৌঁছেছেন।"
        );

        checkAchievements();
    }

    saveProgress();
}


function calculateLevel(showMessage=true){

    let calculatedLevel=1;

    if(Array.isArray(state.levels)&&state.levels.length){

        const sorted=[...state.levels].sort(
            (a,b)=>
                Number(a.requiredXP||0)-
                Number(b.requiredXP||0)
        );

        sorted.forEach(level=>{
            if(
                state.xp>=Number(level.requiredXP||0)
            ){
                calculatedLevel=
                    Number(level.level||1);
            }
        });

    }else{

        calculatedLevel=
            Math.floor(state.xp/100)+1;
    }

    const oldLevel=state.level;

    state.level=Math.max(
        1,
        calculatedLevel
    );

    if(showMessage&&state.level>oldLevel){
        showToast(
            "নতুন Level: "+
            state.level
        );
    }
}


/* =========================================================
   PLAYER UI
========================================================= */

function updatePlayerUI(){

    if(el.playerLevel){
        el.playerLevel.textContent=state.level;
    }

    if(el.playerXP){
        el.playerXP.textContent=state.xp;
    }

    if(!el.xpProgress) return;

    let currentRequired=100;
    let previousRequired=0;

    const sorted=Array.isArray(state.levels)
        ?[...state.levels].sort(
            (a,b)=>
                Number(a.requiredXP||0)-
                Number(b.requiredXP||0)
        )
        :[];

    if(sorted.length){

        const current=sorted.find(
            item=>Number(item.level)===state.level
        );

        const next=sorted.find(
            item=>Number(item.level)===state.level+1
        );

        if(current){
            previousRequired=
                Number(current.requiredXP||0);
        }

        if(next){
            currentRequired=
                Number(next.requiredXP||100);
        }else{
            currentRequired=
                previousRequired+100;
        }

    }else{
        previousRequired=
            (state.level-1)*100;

        currentRequired=
            state.level*100;
    }

    const range=
        Math.max(
            1,
            currentRequired-previousRequired
        );

    const currentXP=
        Math.max(
            0,
            state.xp-previousRequired
        );

    const percentage=
        Math.min(
            100,
            (currentXP/range)*100
        );

    el.xpProgress.style.width=
        percentage+"%";
}


/* =========================================================
   MISSION UI
========================================================= */

function updateMissionUI(){

    const available=state.missions.filter(
        mission=>
            mission&&
            mission.status!=="coming-soon"
    );

    const completed=available.filter(
        mission=>
            isMissionCompleted(mission.id)
    ).length;

    if(el.missionCompleted){
        el.missionCompleted.textContent=
            completed;
    }

    if(el.missionTotal){
        el.missionTotal.textContent=
            available.length;
    }

    document.querySelectorAll(".mission-card").forEach(card=>{

        const id=card.dataset.mission;

        const mission=getMission(id);

        if(!mission) return;

        if(isMissionCompleted(id)){

            card.classList.add("completed");

            card.style.opacity="0.60";

            const xp=card.querySelector(".mission-xp");

            if(xp){
                xp.textContent="সম্পন্ন";
            }

        }else{

            card.classList.remove("completed");

            card.style.opacity="1";

            const xp=card.querySelector(".mission-xp");

            if(xp){
                xp.textContent=
                    "+"+(Number(mission.xp)||0)+" XP";
            }
        }
    });
}


/* =========================================================
   BUILDING STATE
========================================================= */

function updateBuildingState(){

    document.querySelectorAll(".city-building").forEach(button=>{

        const id=button.dataset.building;

        const building=getBuilding(id);

        if(!building) return;

        const requiredLevel=
            Number(building.unlockLevel||1);

        if(
            building.status==="coming-soon"||
            state.level<requiredLevel
        ){
            button.classList.add("locked");
        }else{
            button.classList.remove("locked");
        }

        if(
            building.mission&&
            isMissionCompleted(building.mission)
        ){
            button.classList.add("completed");
        }
    });
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function checkAchievements(){

    if(!Array.isArray(state.achievements)) return;

    state.achievements.forEach(achievement=>{

        if(
            !achievement||
            !achievement.id||
            state.unlockedAchievements.includes(
                achievement.id
            )
        ) return;

        const requirement=
            achievement.requirement;

        if(!requirement) return;

        let unlocked=false;

        if(requirement.type==="xp"){

            unlocked=
                state.xp>=Number(
                    requirement.value||0
                );

        }else if(requirement.type==="missions"){

            unlocked=
                state.completedMissions.length>=
                Number(requirement.value||0);
        }

        if(unlocked){

            state.unlockedAchievements.push(
                achievement.id
            );

            saveProgress();

            showToast(
                "Achievement unlocked: "+
                achievement.name
            );
        }
    });
}


/* =========================================================
   PROFILE
========================================================= */

function openProfile(){

    const modal=el.cityModal.querySelector(".modal-box");

    if(!modal) return;

    const total=state.missions.filter(
        m=>m&&m.status!=="coming-soon"
    ).length;

    const completed=state.completedMissions.length;

    const achievements=
        state.unlockedAchievements.length;

    modal.innerHTML=`
        <button class="modal-close" id="profileClose" type="button" aria-label="বন্ধ করুন">×</button>
        <div class="modal-icon">🏠</div>
        <h2>আমার Profile</h2>
        <div class="city-profile">
            <div>
                <strong>Level</strong>
                <span>${state.level}</span>
            </div>
            <div>
                <strong>XP</strong>
                <span>${state.xp}</span>
            </div>
            <div>
                <strong>Mission</strong>
                <span>${completed}/${total}</span>
            </div>
            <div>
                <strong>Achievement</strong>
                <span>${achievements}</span>
            </div>
        </div>
        <button class="modal-action" id="profileButton" type="button">
            ফিরে যান
        </button>
    `;

    const close=$("profileClose");
    const button=$("profileButton");

    if(close){
        close.addEventListener("click",closeCityModal);
    }

    if(button){
        button.addEventListener("click",closeCityModal);
    }

    openCityModal();
}


/* =========================================================
   HELP
========================================================= */

function openHelpModal(){

    if(!el.helpModal) return;

    el.helpModal.classList.add("active");

    el.helpModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow="hidden";
}


function closeHelpModal(){

    if(!el.helpModal) return;

    el.helpModal.classList.remove("active");

    el.helpModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow="";
}


/* =========================================================
   CITY MODAL
========================================================= */

function openCityModal(){

    if(!el.cityModal) return;

    el.cityModal.classList.add("active");

    el.cityModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow="hidden";
}


function closeCityModal(){

    if(!el.cityModal) return;

    el.cityModal.classList.remove("active");

    el.cityModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow="";

    state.currentQuestion=null;
    state.selectedBuilding=null;
}

/* =========================================================
   RESET QUESTION UI
========================================================= */

function resetQuestionUI(){
    state.currentMission=null;
    state.currentQuestion=null;
    state.questionIndex=0;
    state.correctAnswers=0;
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer=null;

function showToast(message){

    let toast=document.getElementById("cityToast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="cityToast";

        Object.assign(
            toast.style,
            {
                position:"fixed",
                left:"50%",
                bottom:"25px",
                transform:"translateX(-50%)",
                zIndex:"3000",
                background:"#004d40",
                color:"#fff",
                padding:"11px 18px",
                borderRadius:"10px",
                fontSize:"13px",
                maxWidth:"90%",
                textAlign:"center",
                boxShadow:"0 5px 18px rgba(0,0,0,.25)",
                transition:"opacity .3s ease"
            }
        );

        document.body.appendChild(toast);
    }

    toast.textContent=message;
    toast.style.opacity="1";

    clearTimeout(toastTimer);

    toastTimer=setTimeout(()=>{
        toast.style.opacity="0";
    },2800);
}


/* =========================================================
   STORAGE
========================================================= */

function saveProgress(){

    try{

        const data={
            xp:state.xp,
            level:state.level,
            completedMissions:
                [...state.completedMissions],
            unlockedAchievements:
                [...state.unlockedAchievements]
        };

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );

    }catch(error){

        console.warn(
            "Progress save failed:",
            error
        );
    }
}


function loadProgress(){

    try{

        const saved=
            localStorage.getItem(STORAGE_KEY);

        if(!saved) return;

        const data=
            JSON.parse(saved);

        if(
            typeof data.xp==="number"&&
            data.xp>=0
        ){
            state.xp=data.xp;
        }

        if(
            typeof data.level==="number"&&
            data.level>=1
        ){
            state.level=data.level;
        }

        if(
            Array.isArray(
                data.completedMissions
            )
        ){
            state.completedMissions=
                data.completedMissions;
        }

        if(
            Array.isArray(
                data.unlockedAchievements
            )
        ){
            state.unlockedAchievements=
                data.unlockedAchievements;
        }

    }catch(error){

        console.warn(
            "Progress load failed:",
            error
        );
    }
}


/* =========================================================
   GETTERS
========================================================= */

function getBuilding(id){

    return state.buildings.find(
        building=>building.id===id
    );
}


function getMission(id){

    if(!id) return null;

    return state.missions.find(
        mission=>mission.id===id
    );
}


/* =========================================================
   TEXT HELPERS
========================================================= */

function normalizeText(value){

    return String(value||"")
        .trim()
        .replace(/\s+/g," ")
        .toLowerCase();
}


function escapeHTML(value){

    return String(value??"")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");
}


/* =========================================================
   RESET PROGRESS
========================================================= */

function resetProgress(){

    const confirmed=confirm(
        "আপনার Islamic City-এর সব অগ্রগতি মুছে ফেলতে চান?"
    );

    if(!confirmed) return;

    state.xp=0;
    state.level=1;
    state.completedMissions=[];
    state.unlockedAchievements=[];

    localStorage.removeItem(STORAGE_KEY);

    updatePlayerUI();
    updateMissionUI();
    updateBuildingState();

    showToast(
        "আপনার অগ্রগতি মুছে ফেলা হয়েছে।"
    );
}


/* =========================================================
   GLOBAL API
========================================================= */

window.IslamicCity={

    getProgress(){
        return{
            xp:state.xp,
            level:state.level,
            completedMissions:[
                ...state.completedMissions
            ],
            unlockedAchievements:[
                ...state.unlockedAchievements
            ]
        };
    },

    resetProgress,

    addXP(amount){
        addXP(amount);
    }
};











