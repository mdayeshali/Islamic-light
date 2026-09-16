document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Navigation & Views
  const levelSelectView = document.getElementById('levelSelectView');
  const quizPlayView = document.getElementById('quizPlayView');
  const quizResultView = document.getElementById('quizResultView');
  const homeBtn = document.getElementById('homeBtn');
  const totalCoinsDisplay = document.getElementById('totalCoinsDisplay');
  const levelListContainer = document.getElementById('levelListContainer');

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

  // বাংলা সংখ্যায় রূপান্তর
  function toBengaliNum(num) {
    return Number(num).toLocaleString('bn-BD');
  }

  // কয়েন ডিসপ্লে আপডেট
  function updateCoinDisplay() {
    totalCoinsDisplay.innerText = toBengaliNum(totalCoins);
  }

  // স্ক্রিন পরিবর্তনের কমন ফাংশন
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

  // ১. JSON থেকে ডেটা লোড
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

  // ২. লেভেল তালিকা রেন্ডার করা
  function renderLevelList() {
    levelListContainer.innerHTML = '';

    gameLevels.forEach((lvl, idx) => {
      const isUnlocked = unlockedLevels.includes(lvl.level) || totalCoins >= lvl.requiredCoins;

      // যদি শর্ত পূরণ হয় তবে অটো আনলক লিস্টে যুক্ত করা
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
        card.addEventListener('click', () => startLevel(idx));
      }

      levelListContainer.appendChild(card);
    });
  }

  // ৩. একটি নির্দিষ্ট লেভেল শুরু করা
  function startLevel(lvlIndex) {
    currentLevelIndex = lvlIndex;
    currentQuestionIndex = 0;
    correctCountThisLevel = 0;
    earnedCoinsThisLevel = 0;

    switchView('quizPlay');
    loadQuestion();
  }

  // ৪. প্রশ্ন ও অপশন লোড করা
  function loadQuestion() {
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    const qData = currentQuestions[currentQuestionIndex];

    // হেডার ও প্রগ্রেস বার
    questionStepText.innerText = `প্রশ্ন ${toBengaliNum(currentQuestionIndex + 1)} / ${toBengaliNum(currentQuestions.length)}`;
    const progressPercent = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // প্রশ্ন টেক্সট
    questionText.innerText = qData.question;

    // অপশন বাটন ও রেফারেন্স বক্স রিসেট
    optionsContainer.innerHTML = '';
    explanationBox.style.display = 'none';
    nextQuestionBtn.style.display = 'none';

    // অপশন তৈরি
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

  // ৫. ব্যবহারকারীর উত্তর যাচাই করা
  function handleAnswerSelect(selectedIndex, clickedBtn) {
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    const qData = currentQuestions[currentQuestionIndex];
    const allOptionBtns = optionsContainer.querySelectorAll('.option-btn');

    // সব অপশন লক করে দেওয়া
    allOptionBtns.forEach(b => b.disabled = true);

    if (selectedIndex === qData.answerIndex) {
      // সঠিক উত্তর
      clickedBtn.classList.add('correct');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-check';

      // ৫ কয়েন যোগ
      totalCoins += 5;
      earnedCoinsThisLevel += 5;
      localStorage.setItem('islamic_game_coins', totalCoins);
      updateCoinDisplay();
      correctCountThisLevel++;

      if (navigator.vibrate) navigator.vibrate(50); // হালকা ভাইব্রেশন
    } else {
      // ভুল উত্তর
      clickedBtn.classList.add('wrong');
      clickedBtn.querySelector('i').className = 'fa-solid fa-circle-xmark';

      // সঠিক অপশনটি হাইলাইট করা
      allOptionBtns[qData.answerIndex].classList.add('correct');
      allOptionBtns[qData.answerIndex].querySelector('i').className = 'fa-solid fa-circle-check';

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    }

    // রেফারেন্স ও ব্যাখ্যা প্রদর্শন
    if (qData.explanation) {
      explanationText.innerText = qData.explanation;
      explanationBox.style.display = 'block';
    }

    // পরবর্তী প্রশ্নের বাটন দেখানো
    nextQuestionBtn.style.display = 'flex';
  }

  // ৬. পরবর্তী প্রশ্ন বা লেভেল শেষ করা
  nextQuestionBtn.addEventListener('click', () => {
    const currentQuestions = gameLevels[currentLevelIndex].questions;
    currentQuestionIndex++;

    if (currentQuestionIndex < currentQuestions.length) {
      loadQuestion();
    } else {
      showLevelResults();
    }
  });

  // ৭. ফলাফল স্ক্রিন দেখানো
  function showLevelResults() {
    switchView('quizResult');

    const totalQuestions = gameLevels[currentLevelIndex].questions.length;
    correctScoreText.innerText = `${toBengaliNum(correctCountThisLevel)} / ${toBengaliNum(totalQuestions)}`;
    earnedCoinsText.innerText = `+${toBengaliNum(earnedCoinsThisLevel)}`;

    // অন্তত ৩টি সঠিক হলে সফল হিসেবে গণ্য
    const isPassed = correctCountThisLevel >= 3;

    if (isPassed) {
      resultTitle.innerText = 'মাশাআল্লাহ! অসাধারণ!';
      resultSubtitle.innerText = 'আপনি সফলভাবে এই ধাপটি সম্পন্ন করেছেন।';

      // পরবর্তী লেভেল আনলক করা (যদি থাকে)
      const nextLvlNum = gameLevels[currentLevelIndex].level + 1;
      const hasNextLevel = gameLevels.some(l => l.level === nextLvlNum);

      if (hasNextLevel && !unlockedLevels.includes(nextLvlNum)) {
        unlockedLevels.push(nextLvlNum);
        localStorage.setItem('islamic_unlocked_levels', JSON.stringify(unlockedLevels));
      }

      nextLevelBtn.style.display = hasNextLevel ? 'flex' : 'none';
    } else {
      resultTitle.innerText = 'আবার চেষ্টা করুন!';
      resultSubtitle.innerText = 'পরবর্তী ধাপ আনলক করতে কমপক্ষে ৩টি সঠিক উত্তর প্রয়োজন।';
      nextLevelBtn.style.display = 'none';
    }
  }

  // ইভেন্ট লিসেনারস (নেভিগেশন)
  homeBtn.addEventListener('click', () => switchView('levelSelect'));
  backToLevelsBtn.addEventListener('click', () => switchView('levelSelect'));
  retryLevelBtn.addEventListener('click', () => startLevel(currentLevelIndex));

  nextLevelBtn.addEventListener('click', () => {
    if (currentLevelIndex + 1 < gameLevels.length) {
      startLevel(currentLevelIndex + 1);
    }
  });

  // ইনিশিয়ালাইজেশন
  updateCoinDisplay();
  loadQuizData();
});
