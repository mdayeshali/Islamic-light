// এই ফাংশনটি মোবাইল ভিউতে সাইডবার টগল (বন্ধ-খোলা) করবে।
function toggleMenu() {
    document.getElementById("sidebar").classList.toggle("active");
}

/* অতিরিক্ত ভালো করার জন্য (ঐচ্ছিক) — content এ ক্লিক করলে sidebar বন্ধ হবে */
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const btn = document.querySelector('.menu-btn');
    if (!sidebar) return;
    
    // যদি sidebar visible থাকে এবং ক্লিক sidebar বা বাটনের বাইরে হয়, sidebar বন্ধ করো
    if (sidebar.classList.contains('active') && !sidebar.contains(e.target) && !btn.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

// নতুন ফাংশন: সাইডবার কন্টেন্ট লোড করার জন্য
function loadSidebar() {
    const sidebarHtml = `
        <h2>📖 সূচীপত্র</h2>
        <a href="surah_1.html">001 সূরা আল-ফাতিহা</a>
        <a href="surah_2.html">002 সূরা আল-বাকারা</a>
        <a href="surah_3.html">003 সূরা আলে ইমরান</a>
        <a href="surah_4.html">004 সূরা আন-নিসা</a>
        <a href="surah_5.html">005 সূরা আল-মায়েদা</a>
        <a href="surah_6.html">006 সূরা আল-আনআম</a>
        <a href="surah_7.html">007 সূরা আল-আআরাফ</a>
        <a href="surah_8.html">008 সূরা আল-আনফাল</a>
        <a href="surah_9.html">009 সূরা আত-তাওবাহ</a>
        <a href="surah_10.html">010 সূরা ইউনুস</a>
        <a href="surah_11.html">011 সূরা হুদ</a>
        <a href="surah_12.html">012 সূরা ইউসুফ</a>
        <a href="surah_13.html">013 সূরা রাদ</a>
        <a href="surah_14.html">014 সূরা ইবরাহীম</a>
        <a href="surah_15.html">015 সূরা হিজর</a>
        <a href="surah_16.html">016 সূরা নাহল</a>
        <a href="surah_17.html">017 সূরা বনী ইসরাঈল</a>
        <a href="surah_18.html">018 সূরা কাহফ</a>
        <a href="surah_19.html">019 সূরা মারইয়াম</a>
        <a href="surah_20.html">020 সূরা ত্বোহা</a>
        <a href="surah_21.html">021 সূরা আম্বিয়া</a>
        <a href="surah_22.html">022 সূরা হাজ্জ</a>
        <a href="surah_23.html">023 সূরা মু'মিনূন</a>
        <a href="surah_24.html">024 সূরা নূর</a>
        <a href="surah_25.html">025 সূরা ফুরকান</a>
        <a href="surah_26.html">026 সূরা আশ-শু'আরা</a>
        <a href="surah_27.html">027 সূরা নামল</a>
        <a href="surah_28.html">028 সূরা কাসাস</a>
        <a href="surah_29.html">029 সূরা আনকাবুত</a>
        <a href="surah_30.html">030 সূরা রূম</a>
        <a href="surah_31.html">031 সূরা লোকমান</a>
        <a href="surah_32.html">032 সূরা সেজদা</a>
        <a href="surah_33.html">033 সূরা আহযাব</a>
        <a href="surah_34.html">034 সূরা সাবা</a>
        <a href="surah_35.html">035 সূরা ফাতির</a>
        <a href="surah_36.html">036 সূরা ইয়াসীন</a>
        <a href="surah_37.html">037 সূরা সফফাত</a>
        <a href="surah_38.html">038 সূরা সাদ</a>
        <a href="surah_39.html">039 সূরা যুমার</a>
        <a href="surah_40.html">040 সূরা গাফির</a>
        <a href="surah_41.html">041 সূরা ফুসসিলাত</a>
        <a href="surah_42.html">042 সূরা আশ-শুরা</a>
        <a href="surah_43.html">043 সূরা যুখরুফ</a>
        <a href="surah_44.html">044 সূরা দুখান</a>
        <a href="surah_45.html">045 সূরা জাসিয়া</a>
        <a href="surah_46.html">046 সূরা আহকাফ</a>
        <a href="surah_47.html">047 সূরা মুহাম্মাদ</a>
        <a href="surah_48.html">048 সূরা ফাতহ</a>
        <a href="surah_49.html">049 সূরা হুজুরাত</a>
        <a href="surah_50.html">050 সূরা কাফ</a>
        <a href="surah_51.html">051 সূরা যারিয়াত</a>
        <a href="surah_52.html">052 সূরা তূর</a>
        <a href="surah_53.html">053 সূরা নাজম</a>
        <a href="surah_54.html">054 সূরা কামার</a>
        <a href="surah_55.html">055 সূরা রহমান</a>
        <a href="surah_56.html">056 সূরা ওয়াক্বিয়া</a>
        <a href="surah_57.html">057 সূরা হাদীদ</a>
        <a href="surah_58.html">058 সূরা মুজাদিলা</a>
        <a href="surah_59.html">059 সূরা হাশর</a>
        <a href="surah_60.html">060 সূরা মুমতাহিনা</a>
        <a href="surah_61.html">061 সূরা সফ</a>
        <a href="surah_62.html">062 সূরা জুমুআ</a>
        <a href="surah_63.html">063 সূরা মুনাফিকুন</a>
        <a href="surah_64.html">064 সূরা তাগাবুন</a>
        <a href="surah_65.html">065 সূরা তালাক</a>
        <a href="surah_66.html">066 সূরা তাহরীম</a>
        <a href="surah_67.html">067 সূরা মুলক</a>
        <a href="surah_68.html">068 সূরা কলম</a>
        <a href="surah_69.html">069 সূরা হাক্কাহ</a>
        <a href="surah_70.html">070 সূরা মা'আরিজ</a>
        <a href="surah_71.html">071 সূরা নূহ</a>
        <a href="surah_72.html">072 সূরা জ্বিন</a>
        <a href="surah_73.html">073 সূরা মুজ্জাম্মিল</a>
        <a href="surah_74.html">074 সূরা মুদ্দাসসির</a>
        <a href="surah_75.html">075 সূরা কিয়ামাহ</a>
        <a href="surah_76.html">076 সূরা ইনসান</a>
        <a href="surah_77.html">077 সূরা মুরসালাত</a>
        <a href="surah_78.html">078 সূরা নাবা</a>
        <a href="surah_79.html">079 সূরা নাযিআত</a>
        <a href="surah_80.html">080 সূরা আবাসা</a>
        <a href="surah_81.html">081 সূরা তাকভীর</a>
        <a href="surah_82.html">082 সূরা ইনফিতার</a>
        <a href="surah_83.html">083 সূরা মুতাফফিফিন</a>
        <a href="surah_84.html">084 সূরা ইনশিকাক</a>
        <a href="surah_85.html">085 সূরা বুরুজ</a>
        <a href="surah_86.html">086 সূরা তারিক</a>
        <a href="surah_87.html">087 সূরা আ'লা</a>
        <a href="surah_88.html">088 সূরা গাশিয়াহ</a>
        <a href="surah_89.html">089 সূরা ফজর</a>
        <a href="surah_90.html">090 সূরা বালাদ</a>
        <a href="surah_91.html">091 সূরা শামস</a>
        <a href="surah_92.html">092 সূরা লাইল</a>
        <a href="surah_93.html">093 সূরা দুহা</a>
        <a href="surah_94.html">094 সূরা ইনশিরাহ</a>
        <a href="surah_95.html">095 সূরা ত্বীন</a>
        <a href="surah_96.html">096 সূরা আলাক</a>
        <a href="surah_97.html">097 সূরা কদর</a>
        <a href="surah_98.html">098 সূরা বাইয়্যিনাহ</a>
        <a href="surah_99.html">099 সূরা যিলযাল</a>
        <a href="surah_100.html">100 সূরা আদিয়াত</a>
        <a href="surah_101.html">101 সূরা কারিয়া</a>
        <a href="surah_102.html">102 সূরা তাকাসুর</a>
        <a href="surah_103.html">103 সূরা আসর</a>
        <a href="surah_104.html">104 সূরা হুমাযাহ</a>
        <a href="surah_105.html">105 সূরা ফীল</a>
        <a href="surah_106.html">106 সূরা কুরাইশ</a>
        <a href="surah_107.html">107 সূরা মাউন</a>
        <a href="surah_108.html">108 সূরা কাউসার</a>
        <a href="surah_109.html">109 সূরা কাফিরুন</a>
        <a href="surah_110.html">110 সূরা নাসর</a>
        <a href="surah_111.html">111 সূরা লাহাব</a>
        <a href="surah_112.html">112 সূরা ইখলাস</a>
        <a href="surah_113.html">113 সূরা ফালাক</a>
        <a href="surah_114.html">114 সূরা নাস</a>
    `;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.innerHTML = sidebarHtml;
        
        // বর্তমান সূরার লিংকে 'active' ক্লাস যুক্ত করার লজিক 
        const currentUrl = window.location.href;
        const links = document.querySelectorAll('.sidebar a');
        links.forEach(link => {
            if (currentUrl.includes(link.getAttribute('href'))) {
                links.forEach(l => l.classList.remove('active')); 
                link.classList.add('active');
            }
        });
    }
}

// সেটিং বক্স খোলা বা বন্ধ করার ফাংশন
function toggleSettings() {
    document.getElementById("font-sizer").classList.toggle("font-sizer-visible");
}

// ফন্ট সাইজ পরিবর্তন করার ফাংশন
function changeFontSize(direction) {
    const arabicTexts = document.querySelectorAll('.arabic');
    const translationTexts = document.querySelectorAll('.translation');
    
    // ফন্ট সাইজ পিক্সেল (px) এ পাওয়ার জন্য এই পদ্ধতি ব্যবহার করা হয়েছে
    const currentArabicSize = arabicTexts.length > 0 ? parseFloat(window.getComputedStyle(arabicTexts[0]).fontSize) : 30; // 30px is default
    const currentTranslationSize = translationTexts.length > 0 ? parseFloat(window.getComputedStyle(translationTexts[0]).fontSize) : 24; // 24px is default
    
    if (direction === 1) { // ফন্ট বড় করা
        if (currentArabicSize < 48) { // সর্বোচ্চ সীমা
            arabicTexts.forEach(el => el.style.fontSize = (currentArabicSize + 2) + 'px');
        }
        if (currentTranslationSize < 40) { // সর্বোচ্চ সীমা
            translationTexts.forEach(el => el.style.fontSize = (currentTranslationSize + 2) + 'px');
        }
    } else if (direction === -1) { // ফন্ট ছোট করা
        if (currentArabicSize > 24) { // সর্বনিম্ন সীমা (CSS default 30px, so 24px is min)
            arabicTexts.forEach(el => el.style.fontSize = (currentArabicSize - 2) + 'px');
        }
        if (currentTranslationSize > 16) { // সর্বনিম্ন সীমা (CSS default 24px, so 16px is min)
            translationTexts.forEach(el => el.style.fontSize = (currentTranslationSize - 2) + 'px');
        }
    }
}

// উচ্চারণ show/hide করার জন্য
function toggleTransliteration(btn){
    const ayatDiv = btn.closest('.ayat');
    if (!ayatDiv) return;

    // এটি `.transliteration` ক্লাসের div খুঁজবে
    const transliteration = ayatDiv.querySelector('.transliteration'); 
    
    if(!transliteration) return;

    if(transliteration.style.display === "none" || transliteration.style.display === ""){
        transliteration.style.display = "block";
        btn.textContent = "উচ্চারণ বন্ধ করুন";
    } else {
        transliteration.style.display = "none";
        btn.textContent = "উচ্চারণ";
    }
}

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.intro-toggle');
  buttons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const content = btn.nextElementSibling;
      if (content && content.classList.contains('intro-content')) {
        content.classList.toggle('open');
      }
    });
  });
});




// যখন সম্পূর্ণ পেজ লোড হবে, তখন এই ফাংশনটি কল করা হবে
window.onload = loadSidebar;

