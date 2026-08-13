let islamicNames = [];
let selectedLetter = 'all';

// ১. জেসন (JSON) ফাইল থেকে ডাটা লোড করা
async function fetchNamesData() {
  try {
    const response = await fetch('../data/child-name.json');
    if (!response.ok) {
      throw new Error('JSON ডাটা লোড করতে সমস্যা হয়েছে');
    }
    islamicNames = await response.json();
    
    // নামগুলো বাংলা বর্ণানুক্রমিকভাবে (অ-হ) সাজিয়ে নেওয়া
    sortNamesAlphabetically();
    
    // টেবিলে ডাটা প্রদর্শন
    displayNames(islamicNames);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('namesTableBody').innerHTML = 
      `<tr><td colspan="6" class="no-data">ডাটা লোড করতে সমস্যা হয়েছে। ফাইল পাথ চেক করুন।</td></tr>`;
  }
}

// ২. বাংলা বর্ণানুক্রমিক (Alphabetical Sort) সাজানোর ফাংশন
function sortNamesAlphabetically() {
  islamicNames.sort((a, b) => a.name_bn.localeCompare(b.name_bn, 'bn'));
}

// ৩. টেবিলে ডাটা ডায়নামিকালি দেখানোর ফাংশন
function displayNames(data) {
  const tableBody = document.getElementById('namesTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="no-data">কোনো কাঙ্ক্ষিত নাম পাওয়া যায়নি।</td></tr>`;
    return;
  }

  data.forEach(item => {
    const row = document.createElement('tr');
    
    // ছেলেদের ও মেয়েদের ব্যাজ
    const genderBadge = item.gender === 'boy' 
      ? '<span class="badge-boy">ছেলে</span>' 
      : '<span class="badge-girl">মেয়ে</span>';

    row.innerHTML = `
      <td><strong>${item.name_bn}</strong></td>
      <td>${item.name_en}</td>
      <td class="arabic-text">${item.name_ar}</td>
      <td>${item.meaning}</td>
      <td>${genderBadge}</td>
      <td style="text-align: center;">
        <button class="share-btn" onclick="shareName('${item.name_bn}', '${item.name_en}', '${item.meaning}')" title="শেয়ার করুন">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          শেয়ার
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ৪. সার্চ, জেন্ডার এবং অক্ষর ফিল্টারিং লজিক
function filterNames() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const selectedGender = document.getElementById('genderFilter').value;

  const filtered = islamicNames.filter(item => {
    // সার্চ ম্যাচ (বাংলা বা ইংরেজি নাম)
    const matchesSearch = item.name_bn.toLowerCase().includes(query) || 
                          item.name_en.toLowerCase().includes(query);
    
    // জেন্ডার ম্যাচ (ছেলে / মেয়ে / সব)
    const matchesGender = selectedGender === 'all' || item.gender === selectedGender;

    // অক্ষরের প্রথম বর্ণ ম্যাচ (বাংলা বা ইংরেজি)
    const startsWithBn = item.name_bn.startsWith(selectedLetter);
    const startsWithEn = item.name_en.toUpperCase().startsWith(selectedLetter.toUpperCase());
    const matchesLetter = selectedLetter === 'all' || startsWithBn || startsWithEn;

    return matchesSearch && matchesGender && matchesLetter;
  });

  displayNames(filtered);
}

// ৫. নির্দিষ্ট একক নাম ও লিঙ্ক শেয়ার করার ফাংশন
function shareName(nameBn, nameEn, meaning) {
  const currentUrl = window.location.href;
  const shareText = `শিশুর সুন্দর ইসলামিক নাম:\nনাম: ${nameBn} (${nameEn})\nঅর্থ: ${meaning}\n\nবিস্তারিত দেখুন: ${currentUrl}`;

  if (navigator.share) {
    navigator.share({
      title: `${nameBn} - ইসলামিক নাম`,
      text: shareText,
      url: currentUrl
    }).catch((err) => {
      console.log('শেয়ার বাতিল করা হয়েছে:', err);
    });
  } else {
    navigator.clipboard.writeText(shareText).then(() => {
      alert('নামের বিস্তারিত এবং লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!');
    }).catch(err => {
      console.error('কপি করতে সমস্যা হয়েছে:', err);
    });
  }
}

// ৬. [নতুন ফিচার] সোশ্যাল শেয়ার এবং পুরো পেজের লিঙ্ক কপি করার সুবিধা
function setupShareBox() {
  const currentUrl = window.location.href;
  const shareTitle = "শিশুদের সুন্দর ১০০০টি ইসলামিক নাম ও অর্থ | Islamic Light";

  // লিঙ্ক কপি বাটন
  const copyBtn = document.getElementById('copyLinkBtn');
  const copyText = document.getElementById('copyText');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(currentUrl).then(() => {
        copyText.textContent = "লিংক কপি হয়েছে!";
        copyBtn.style.backgroundColor = "#e8f5e9";
        copyBtn.style.color = "#2e7d32";

        setTimeout(() => {
          copyText.textContent = "লিংক কপি করুন";
          copyBtn.style.backgroundColor = "";
          copyBtn.style.color = "";
        }, 2000);
      }).catch(err => {
        console.error("কপি করতে সমস্যা হয়েছে: ", err);
      });
    });
  }

  // হোয়াটসঅ্যাপ শেয়ার
  const whatsappBtn = document.getElementById('whatsappShareBtn');
  if (whatsappBtn) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " - " + currentUrl)}`;
    whatsappBtn.setAttribute('href', whatsappUrl);
  }

  // ফেসবুক শেয়ার
  const facebookBtn = document.getElementById('facebookShareBtn');
  if (facebookBtn) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    facebookBtn.setAttribute('href', facebookUrl);
  }
}

// ৭. [নতুন ফিচার] অক্ষর ফিল্টার প্রসারিত/সংকুচিত (Accordion) করার সুবিধা
function setupAlphabetToggle() {
  const lettersContainer = document.getElementById('lettersContainer');
  const toggleBtn = document.getElementById('toggleLettersBtn');
  
  if (!lettersContainer || !toggleBtn) return;
  
  const btnText = toggleBtn.querySelector('.btn-text');

  // টগল বাটনে ক্লিকে কন্টেইনার খোলা/বন্ধ হওয়া
  toggleBtn.addEventListener('click', () => {
    const isExpanded = lettersContainer.classList.toggle('expanded');
    toggleBtn.classList.toggle('active', isExpanded);

    if (isExpanded) {
      btnText.textContent = 'সংকুচিত করুন';
    } else {
      btnText.textContent = 'সব অক্ষর দেখুন';
    }
  });

  // যেকোনো অক্ষরে ক্লিক করলে ফিল্টার হওয়ার সাথে সাথে কন্টেইনার গুটিয়ে যাওয়া
  lettersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('letter-btn')) {
      // আগের এক্টিভ ক্লাসের স্টাইল সরানো
      document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
      
      // নতুন সিলেক্ট করা বোতামে এক্টিভ ক্লাস যুক্ত করা
      e.target.classList.add('active');
      
      // সিলেক্ট করা অক্ষর আপডেট করে ফিল্টার চালু করা
      selectedLetter = e.target.getAttribute('data-letter');
      filterNames();

      // যদি কন্টেইনার খোলা থাকে তবে অটো গুটিয়ে নেওয়া
      if (lettersContainer.classList.contains('expanded')) {
        lettersContainer.classList.remove('expanded');
        toggleBtn.classList.remove('active');
        btnText.textContent = 'সব অক্ষর দেখুন';
      }
    }
  });
}

// ৮. ইনপুট ও ড্রপডাউন ইভেন্ট লিসেনার
document.getElementById('searchInput').addEventListener('input', filterNames);
document.getElementById('genderFilter').addEventListener('change', filterNames);

// ৯. পেজ লোড সম্পন্ন হলে সব সুবিধাগুলো সক্রিয় করা
window.addEventListener('DOMContentLoaded', () => {
  fetchNamesData();
  setupShareBox();
  setupAlphabetToggle();
});
