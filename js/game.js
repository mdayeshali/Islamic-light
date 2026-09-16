document.addEventListener('DOMContentLoaded', () => {
  // DOM Navigation & Containers
  const body = document.body;
  const levelSelectView = document.getElementById('levelSelectView');
  const quizPlayView = document.getElementById('quizPlayView');
  const quizResultView = document.getElementById('quizResultView');
  const homeBtn = document.getElementById('homeBtn');
  const worldBadge = document.getElementById('worldBadge');
  const totalCoinsDisplay = document.getElementById('totalCoinsDisplay');
  const levelListContainer = document.getElementById('levelListContainer');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // Gameplay DOM
  const questionStepText = document.getElementById('questionStepText');
  const progressBar = document.getElementById('progressBar');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('optionsContainer');
  const explanationBox = document.getElementById('explanationBox');
  const explanationText = document.getElementById('explanationText');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');

  // Results DOM
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const correctScoreText = document.getElementById('correctScoreText');
  const earnedCoinsText = document.getElementById('earnedCoinsText');
  const nextLevelBtn = document.getElementById('nextLevelBtn');
  const retryLevelBtn = document.getElementById('retryLevelBtn');
  const backToLevelsBtn = document.getElementById('backToLevelsBtn');

  // State Management
  let gameLevels = [];
  let currentLevelIndex = 0;
  let currentQuestionIndex = 0;
  let correctCountThisLevel = 0;
  let earnedCoinsThisLevel = 0;
  let activeTabWorld = 1;

  // Persistent User Progress
  let totalCoins = parseInt(localStorage.getItem('islamic_game_coins')) || 0;
  let unlockedLevels = JSON.parse(localStorage.getItem('islamic_unlocked_levels')) || [1];
  let isSoundEnabled = localStorage.getItem('islamic_game_sound') !== 'false';

  // ==========================================
  // STUDIO-GRADE WEB AUDIO SYNTHESIZER (NO MP3)
  // ==========================================
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) audioCtx = new AudioCtxClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // স্ক্রিনের যেকোনো প্রথম স্পর্শে অডিও আনলক
  ['click', 'touchstart'].forEach(evt => {
    document.addEventListener(evt, () => initAudio(), { once: true, passive: true });
  });

  // হারমোনিক রেজোন্যান্ট চিম প্লেয়ার
  function playHarmonicChime(freqArray, decay = 0.4, gainLvl = 0.1) {
    if (!isSoundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      freqArray.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.08));

        gain.gain.setValueAtTime(gainLvl, now + (idx * 0.08));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + (idx * 0.08) + decay);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + (idx * 0.08));
        osc.stop(now + (idx * 0.08) + decay);
      });
    } catch (e) {
      console.warn("Audio Synthesizer:", e);
    }
  }

  const SoundEngine = {
    click: () => playHarmonicChime([520], 0.05, 0.03),
    correct: () => playHarmonicChime([523.25, 659.25, 783.99, 1046.50], 0.5, 0.12), // সুমধুর ফ্যানফেয়ার
    wrong: () => playHarmonicChime([220, 185], 0.25, 0.08), // মৃদু উড-টোন
    levelComplete: () => {
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
        setTimeout(() => playHarmonicChime([f], 0.6, 0.15), i * 110);
      });
    }
  };

  // Sound Button UI
  function updateSoundUI() {
    soundIcon.className = isSoundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  }

  soundToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem('islamic_game_sound', isSoundEnabled);
    updateSoundUI();
    if (isSoundEnabled) SoundEngine.click();
  });

  // ==========================================
  // DYNAMIC THEME & WORLD CONTROLLER
  // ==========================================
  function applyWorldTheme(levelNumber) {
    if (levelNumber >= 6) {
      // World 2 (লেভেল ৬ - ১০)
      body.classList.remove('theme-oasis');
      body.classList.add('theme-midnight');
      worldBadge.innerHTML = `<i class="fa-solid fa-moon"></i> <span>অধ্যায় ২: নক্ষত্রমণ্ডল</span>`;
    } else {
      // World 1 (লেভেল ১ - ৫)
      body.classList.remove('theme-midnight');
      body.classList.add('theme-oasis');
      worldBadge.innerHTML = `<i class="fa-solid fa-seedling"></i> <span>অধ্যায় ১: মরূদ্যান</span>`;
    }
  }

  function toBengali(num) {
    return Number(num).toLocaleString('bn-BD');
  }

  function updateCoinDisplay() {
    totalCoinsDisplay.innerText = toBengali(totalCoins);
  }

  // ==========================================
  // LEVEL SELECTION & DATA LOAD
  // ==========================================
  async function loadQuizDatabase() {
    try {
      const res = await fetch('../data/quiz-game.json');
      if (!res.ok) throw new Error('Data file not found');
      gameLevels = await res.json();
      renderLevels();
    } catch (err) {
      console.error(err);
      levelListContainer.innerHTML = '<p style="text-align:center; padding:20px;">ডাটা লোড হচ্ছে না। অনুগ্রহ করে পাথ চেক করুন।</p>';
    }
  }

  // Tab switcher (পর্ব ১ ও পর্ব ২)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      SoundEngine.click();
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTabWorld = parseInt(btn.getAttribute('data-world'));
      applyWorldTheme(activeTabWorld === 1 ? 1 : 6);
      renderLevels();
    });
  });

  function renderLevels() {
    levelListContainer.innerHTML = '';
    
    // ফিল্টারিং: পর্ব ১ (১-৫) এবং পর্ব ২ (৬-১০)
    const filtered = gameLevels.filter(lvl => {
      return activeTabWorld === 1 ? lvl.level <= 5 : lvl.level > 5;
    });

    filtered.forEach((lvl) => {
      const realIndex = gameLevels.findIndex(l => l.level === lvl.level);
      const isUnlocked = unlockedLevels.includes(lvl.level) || totalCoins >= lvl.requiredCoins;

      if (isUnlocked && !unlockedLevels.includes(lvl.level)) {
        unlockedLevels.push(lvl.level);
        localStorage.setItem('islamic_unlocked_levels', JSON.stringify(unlockedLevels));
      }

      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      card.innerHTML = `
        <div class="lvl-card-left">
          <div class="lvl-icon-circle">
            <i class="fa-solid ${isUnlocked ? (lvl.level > 5 ? 'fa-star-and-crescent' : 'fa-quran') : 'fa-lock'}"></i>
          </div>
          <div class="lvl-details">
            <strong>ধাপ ${toBengali(lvl.level)}: ${lvl.title}</strong>
            <span>${lvl.description}</span>
          </div>
        </div>
        <div class="lvl-status-arrow">
          <i class="fa-solid ${isUnlocked ? 'fa-chevron-right' : 'fa-lock'}"></i>
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          SoundEngine.click();
          startLevel(realIndex);
        });
      }

      levelListContainer.appendChild(card);
    });
  }

  // ==========================================
  // GAMEPLAY CONTROLLER
  // ==========================================
  function switchView(viewName) {
    levelSelectView.style.display = 'none';
    quizPlayView.style.display = 'none';
    quizResultView.style.display = 'none';

    if (viewName === 'levels') {
      levelSelectView.style.display = 'block';
      homeBtn.style.display = 'none';
      renderLevels();
    } else if (viewName === 'play') {
      quizPlayView.style.display = 'block';
      homeBtn.style.display = 'flex';
    } else if (viewName === 'result') {
      quizResultView.style.display = 'block';
      homeBtn.style.display = 'flex';
    }
  }

  function startLevel(index) {
    currentLevelIndex = index;
    currentQuestionIndex = 0;
    correctCountThisLevel = 0;
    earnedCoinsThisLevel = 0;

    applyWorldTheme(gameLevels[currentLevelIndex].level);
    switchView('play');
    renderQuestion();
  }

  function renderQuestion() {
    const questions = gameLevels[currentLevelIndex].questions;
    const currentQ = questions[currentQuestionIndex];

    questionStepText.innerText = `প্রশ্ন ${toBengali(currentQuestionIndex + 1)} / ${toBengali(questions.length)}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    questionText.innerText = currentQ.question;
    optionsContainer.innerHTML = '';
    explanationBox.style.display = 'none';
    nextQuestionBtn.style.display = 'none';

    currentQ.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span>${optText}</span>
        <i class="fa-regular fa-circle"></i>
      `;

      btn.addEventListener('click', () => handleAnswer(optIdx, btn));
      optionsContainer.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex, clickedBtn) {
    const currentQ = gameLevels[currentLevelIndex].questions[currentQuestionIndex];
    const allBtns = optionsContainer.querySelectorAll('.option-btn');

    allBtns.forEach(b => b.disabled = true);

    if (selectedIndex === currentQ.answerIndex) {
      SoundEngine.correct();
      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-check';

      totalCoins += 5;
      earnedCoinsThisLevel += 5;
      localStorage.setItem('islamic_game_coins', totalCoins);
      updateCoinDisplay();
      correctCountThisLevel++;

      if (navigator.vibrate) navigator.vibrate(40);
    } else {
      SoundEngine.wrong();
      clickedBtn.classList.add('wrong');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-xmark';

      allBtns[currentQ.answerIndex].classList.add('correct');
      allBtns[currentQ.answerIndex].querySelector('i').className = 'fa-solid fa-circle-check';

      if (navigator.vibrate) navigator.vibrate([80, 40, 80]);
    }

    if (currentQ.explanation) {
      explanationText.innerText = currentQ.explanation;
      explanationBox.style.display = 'block';
    }

    nextQuestionBtn.style.display = 'flex';
  }

  nextQuestionBtn.addEventListener('click', () => {
    SoundEngine.click();
    const questions = gameLevels[currentLevelIndex].questions;
    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
      renderQuestion();
    } else {
      showSummary();
    }
  });

  function showSummary() {
    switchView('result');
    const totalQ = gameLevels[currentLevelIndex].questions.length;
    correctScoreText.innerText = `${toBengali(correctCountThisLevel)} / ${toBengali(totalQ)}`;
    earnedCoinsText.innerText = `+${toBengali(earnedCoinsThisLevel)}`;

    const passed = correctCountThisLevel >= 3;

    if (passed) {
      SoundEngine.levelComplete();
      resultTitle.innerText = 'মাশাআল্লাহ! দুর্দান্ত সাফল্য!';
      resultSubtitle.innerText = 'আপনি এই ধাপটি সফলভাবে উত্তীর্ণ হয়েছেন।';

      const nextLevelNumber = gameLevels[currentLevelIndex].level + 1;
      const nextExists = gameLevels.some(l => l.level === nextLevelNumber);

      if (nextExists && !unlockedLevels.includes(nextLevelNumber)) {
        unlockedLevels.push(nextLevelNumber);
        localStorage.setItem('islamic_unlocked_levels', JSON.stringify(unlockedLevels));
      }

      nextLevelBtn.style.display = nextExists ? 'flex' : 'none';
    } else {
      SoundEngine.wrong();
      resultTitle.innerText = 'আবার চেষ্টা করুন!';
      resultSubtitle.innerText = 'পরের ধাপে যেতে কমপক্ষে ৩টি সঠিক উত্তর দিতে হবে।';
      nextLevelBtn.style.display = 'none';
    }
  }

  // Listeners
  homeBtn.addEventListener('click', () => {
    SoundEngine.click();
    applyWorldTheme(activeTabWorld === 1 ? 1 : 6);
    switchView('levels');
  });

  backToLevelsBtn.addEventListener('click', () => {
    SoundEngine.click();
    applyWorldTheme(activeTabWorld === 1 ? 1 : 6);
    switchView('levels');
  });

  retryLevelBtn.addEventListener('click', () => {
    SoundEngine.click();
    startLevel(currentLevelIndex);
  });

  nextLevelBtn.addEventListener('click', () => {
    SoundEngine.click();
    if (currentLevelIndex + 1 < gameLevels.length) {
      startLevel(currentLevelIndex + 1);
    }
  });

  // Init
  updateSoundUI();
  updateCoinDisplay();
  loadQuizDatabase();
});
  
