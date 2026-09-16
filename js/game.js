document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Navigation & Views
  const levelSelectView = document.getElementById('levelSelectView');
  const quizPlayView = document.getElementById('quizPlayView');
  const quizResultView = document.getElementById('quizResultView');
  const homeBtn = document.getElementById('homeBtn');
  const totalCoinsDisplay = document.getElementById('totalCoinsDisplay');
  const levelListContainer = document.getElementById('levelListContainer');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  // DOM Elements - Quiz Play
  const questionStepText = document.getElementById('questionStepText');
  const progressBar = document.getElementById('progressBar');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const explanationBox = document.getElementById('explanationBox');
  const explanationText = document.getElementById('explanationText');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');

  // DOM Elements - Results
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const correctScoreText = document.getElementById('correctScoreText');
  const earnedCoinsText = document.getElementById('earnedCoinsText');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const retryLevelBtn = document.getElementById('retryLevelBtn');
  const backToLevelsBtn = document.getElementById('backToLevelsBtn');

  // Game State
  let gameLevels = [];
  let currentLevelIndex = 0;
  let currentQuestionIndex = 0;
  let correctCountThisLevel = 0;
  let earnedCoinsThisLevel = 0;

  // Local Storage Data Load
  let totalCoins = parseInt(localStorage.getItem('islamic_game_coins')) || 0;
  let unlockedLevels = JSON.parse(localStorage.getItem('islamic_unlocked_levels')) || [1];
  let isSoundEnabled = localStorage.getItem('islamic_game_sound') !== 'false'; // ডিফল্ট অন

  // ================== Web Audio API সাউন্ড সিস্টেম ==================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, delay = 0, gainLevel = 0.12) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // সফট ফেড-আউট (মসৃণ শব্দের জন্য)
        gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        console.error(e);
      }
    }, delay);
  }

  // বিভিন্ন ইভেন্টের অডিও ইফেক্ট
  const Sounds = {
    click: () => playTone(800, 'sine', 0.05, 0, 0.04),
    correct: () => {
      playTone(523.25, 'sine', 0.25, 0, 0.15);   // C5
      playTone(659.25, 'sine', 0.35, 120, 0.15); // E5
      playTone(783.99, 'sine', 0.45, 240, 0.15); // G5
    },
    wrong: () => {
      playTone(220, 'triangle', 0.2, 0, 0.12);
      playTone(185, 'triangle', 0.3, 150, 0.1);
    },
    win: () => {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, idx) => playTone(f, 'sine', 0.3, idx * 130, 0.12));
    }
  };

  // সাউন্ড বাটন আপডেট
  function updateSoundButtonUI() {
    if (isSoundEnabled) {
      soundIcon.className = 'fa-solid fa-volume-high';
      soundToggleBtn.setAttribute('title', 'শব্দ বন্ধ করুন');
    } else {
      soundIcon.className = 'fa-solid fa-volume-xmark';
      soundToggleBtn.setAttribute('title', 'শব্দ চালু করুন');
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('islamic_game_sound', isSoundEnabled);
    updateSoundButtonUI();
    if (isSoundEnabled) Sounds.click();
  });

  // ================== গেম লজিক ==================

  function toBengaliNum(num) {
    return Number(num).toLocaleString('bn-BD');
  }

  function updateCoinDisplay() {
    totalCoinsDisplay.innerText = toBengaliNum(totalCoins);
  }

  function switchView(viewName) {
    levelSelectView.style.display = 'none';
    quizPlayView.style.display = 'none';
    quizResultView.style.display = 'none';

    if (viewName === 'levelSelect') {
      levelSelectView.style.display = 'block';
      homeBtn.style.display = 'none';
      renderLevelList();
    } else if (viewName === 'quizPlay') {
      quizPlayView.style.display = 'block';
      homeBtn.style.display = 'flex';
    } else if (viewName === 'quizResult') {
      quizResultView.style.display = 'block';
      homeBtn.style.display = 'flex';
    }
  }

  async function loadQuizData() {
    try {
      const res = await fetch('../data/quiz-game.json');
      if (!res.ok) throw new Error('Data could not be loaded');
      gameLevels = await res.json();
      renderLevelList();
    } catch (err) {
      console.error(err);
      levelListContainer.innerHTML = '<div class="loading-text">কুইজ ডাটা লোড করা যায়নি। পাথ চেক করুন।</div>';
    }
  }

  function renderLevelList() {
    levelListContainer.innerHTML = '';

    gameLevels.forEach((lvl, idx) => {
      const isUnlocked = unlockedLevels.includes(lvl.level) || totalCoins >= lvl.requiredCoins;

      if (isUnlocked && !unlockedLevels.includes(lvl.level)) {
        unlockedLevels.push(lvl.level);
        localStorage.setItem('islamic_unlocked_levels', JSON.stringify(unlockedLevels));
      }

      const card = document.createElement('div');
      card.className = `level-item-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      card.innerHTML = `
        <div class="level-card-left">
          <div class="level-icon-box">
            <i class="fa-solid ${isUnlocked ? 'fa-book-open' : 'fa-lock'}"></i>
          </div>
          <div class="level-info">
            <strong>ধাপ ${toBengaliNum(lvl.level)}: ${lvl.title}</strong>
            <span>${lvl.description}</span>
          </div>
        </div>
        <div class="level-status-icon">
          <i class="fa-solid ${isUnlocked ? 'fa-circle-chevron-right' : 'fa-lock'}"></i>
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          Sounds.click();
          startLevel(idx);
        });
      }

      levelListContainer.appendChild(card);
    });
  }

  function startLevel(lvlIndex) {
    currentLevelIndex = lvlIndex;
    currentQuestionIndex = 0;
    correctCountThisLevel = 0;
    earnedCoinsThisLevel = 0;

    switchView('quizPlay');
    loadQuestion();
  }

  function loadQuestion() {
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    const qData = currentQuestions[currentQuestionIndex];

    questionStepText.innerText = `প্রশ্ন ${toBengaliNum(currentQuestionIndex + 1)} / ${toBengaliNum(currentQuestions.length)}`;
    const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    questionText.innerText = qData.question;

    optionsContainer.innerHTML = '';
    explanationBox.style.display = 'none';
    nextQuestionBtn.style.display = 'none';

    qData.options.forEach((optText, optIndex) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span>${optText}</span>
        <i class="fa-regular fa-circle"></i>
      `;

      btn.addEventListener('click', () => handleAnswerSelect(optIndex, btn));
      optionsContainer.appendChild(btn);
    });
  }

  function handleAnswerSelect(selectedIndex, clickedBtn) {
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    const qData = currentQuestions[currentQuestionIndex];
    const allOptionBtns = optionsContainer.querySelectorAll('.option-btn');

    allOptionBtns.forEach(b => b.disabled = true);

    if (selectedIndex === qData.answerIndex) {
      // সঠিক উত্তর
      Sounds.correct();
      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-check';

      totalCoins += 5;
      earnedCoinsThisLevel += 5;
      localStorage.setItem('islamic_game_coins', totalCoins);
      updateCoinDisplay();
      correctCountThisLevel++;

      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      // ভুল উত্তর
      Sounds.wrong();
      clickedBtn.classList.add('wrong');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-xmark';

      allOptionBtns[qData.answerIndex].classList.add('correct');
      allOptionBtns[qData.answerIndex].querySelector('i').className = 'fa-solid fa-circle-check';

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    if (qData.explanation) {
      explanationText.innerText = qData.explanation;
      explanationBox.style.display = 'block';
    }

    nextQuestionBtn.style.display = 'flex';
  }

  nextQuestionBtn.addEventListener('click', () => {
    Sounds.click();
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
      loadQuestion();
    } else {
      showLevelResults();
    }
  });

  function showLevelResults() {
    switchView('quizResult');

    const totalQuestions = gameLevels[currentLevelIndex].questions.length;
    correctScoreText.innerText = `${toBengaliNum(correctCountThisLevel)} / ${toBengaliNum(totalQuestions)}`;
    earnedCoinsText.innerText = `+${toBengaliNum(earnedCoinsThisLevel)}`;

    const isPassed = correctCountThisLevel >= 3;

    if (isPassed) {
      Sounds.win();
      resultTitle.innerText = 'মাশাআল্লাহ! অসাধারণ!';
      resultSubtitle.innerText = 'আপনি সফলভাবে এই ধাপটি সম্পন্ন করেছেন।';

      const nextLvlNum = gameLevels[currentLevelIndex].level + 1;
      const hasNextLevel = gameLevels.some(l => l.level === nextLvlNum);

      if (hasNextLevel && !unlockedLevels.includes(nextLvlNum)) {
        unlockedLevels.push(nextLvlNum);
        localStorage.setItem('islamic_unlocked_levels', JSON.stringify(unlockedLevels));
      }

      nextLevelBtn.style.display = hasNextLevel ? 'flex' : 'none';
    } else {
      Sounds.wrong();
      resultTitle.innerText = 'আবার চেষ্টা করুন!';
      resultSubtitle.innerText = 'পরবর্তী ধাপ আনলক করতে কমপক্ষে ৩টি সঠিক উত্তর প্রয়োজন।';
      nextLevelBtn.style.display = 'none';
    }
  }

  // ইভেন্ট লিসেনারস
  homeBtn.addEventListener('click', () => {
    Sounds.click();
    switchView('levelSelect');
  });

  backToLevelsBtn.addEventListener('click', () => {
    Sounds.click();
    switchView('levelSelect');
  });

  retryLevelBtn.addEventListener('click', () => {
    Sounds.click();
    startLevel(currentLevelIndex);
  });

  nextLevelBtn.addEventListener('click', () => {
    Sounds.click();
    if (currentLevelIndex + 1 < gameLevels.length) {
      startLevel(currentLevelIndex + 1);
    }
  });

  // ইনিশিয়ালাইজেশন
  updateSoundButtonUI();
  updateCoinDisplay();
  loadQuizData();
});
      
