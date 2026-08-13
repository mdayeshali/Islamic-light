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
    sortNamesAlphabetically();
    displayNames(islamicNames);
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('namesTableBody').innerHTML = 
      `<tr><td colspan="6" class="no-data">ডাটা লোড করতে সমস্যা হয়েছে। ফাইল পাথ চেক করুন।</td></tr>`;
  }
}

// ২. বাংলা বর্ণানুক্রমিক সাজানোর ফাংশন
function sortNamesAlphabetically() {
  islamicNames.sort((a, b) => a.name_bn.localeCompare(b.name_bn, 'bn'));
}

// ৩. টেবিলে ডাটা প্রদর্শন
function displayNames(data) {
  const tableBody = document.getElementById('namesTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="no-data">কোনো কাঙ্ক্ষিত নাম পাওয়া যায়নি।</td></tr>`;
    return;
  }

  data.forEach(item => {
    const row = document.createElement('tr');
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

// ৪. ফিল্টারিং লজিক (সার্চ, জেন্ডার, অক্ষর)
function filterNames() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  const selectedGender = document.getElementById('genderFilter').value;

  const filtered = islamicNames.filter(item => {
    const matchesSearch = item.name_bn.toLowerCase().includes(query) || 
                          item.name_en.toLowerCase().includes(query);
    const matchesGender = selectedGender === 'all' || item.gender === selectedGender;
    
    // অক্ষরের ফিল্টার
    const startsWithBn = item.name_bn.startsWith(selectedLetter);
    const startsWithEn = item.name_en.toUpperCase().startsWith(selectedLetter.toUpperCase());
    const matchesLetter = selectedLetter === 'all' || startsWithBn || startsWithEn;

    return matchesSearch && matchesGender && matchesLetter;
  });

  displayNames(filtered);
}

// ৫. শেয়ার ও কপি ফাংশনালিটি
function shareName(nameBn, nameEn, meaning) {
  const currentUrl = window.location.href;
  const shareText = `শিশুর সুন্দর ইসলামিক নাম:\nনাম: ${nameBn} (${nameEn})\nঅর্থ: ${meaning}\n\nবিস্তারিত দেখুন: ${currentUrl}`;

  if (navigator.share) {
    navigator.share({ title: `${nameBn} - ইসলামিক নাম`, text: shareText, url: currentUrl }).catch(console.error);
  } else {
    navigator.clipboard.writeText(shareText).then(() => alert('কপি হয়েছে!'));
  }
}

// ৬. সোশ্যাল মিডিয়া শেয়ার ও পেজ লিংক কপি
function setupShareBox() {
  const currentUrl = window.location.href;
  const shareTitle = "শিশুদের সুন্দর ১০০০টি ইসলামিক নাম ও অর্থ | Islamic Light";
  
  const copyBtn = document.getElementById('copyLinkBtn');
  const copyText = document.getElementById('copyText');
  
  copyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      copyText.textContent = "লিংক কপি হয়েছে!";
      setTimeout(() => copyText.textContent = "লিংক কপি করুন", 2000);
    });
  });

  document.getElementById('whatsappShareBtn')?.setAttribute('href', `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " - " + currentUrl)}`);
  document.getElementById('facebookShareBtn')?.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`);
}

// ৭. টগল বাটন ও অক্ষর ফিল্টার
function setupAlphabetToggle() {
  const lettersContainer = document.getElementById('lettersContainer');
  const toggleBtn = document.getElementById('toggleLettersBtn');
  const btnText = toggleBtn?.querySelector('.btn-text');
  
  if (!lettersContainer || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = lettersContainer.classList.toggle('expanded');
    toggleBtn.classList.toggle('active', isExpanded);
    btnText.textContent = isExpanded ? 'সংকুচিত করুন' : 'সব অক্ষর দেখুন';
  });

  lettersContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('letter-btn')) {
      document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      selectedLetter = e.target.getAttribute('data-letter');
      filterNames();
      
      // অক্ষর ক্লিক করলে অটো গুটিয়ে নেওয়া
      if (lettersContainer.classList.contains('expanded')) {
        lettersContainer.classList.remove('expanded');
        toggleBtn.classList.remove('active');
        btnText.textContent = 'সব অক্ষর দেখুন';
      }
    }
  });
}

// ইভেন্ট লিসেনার
document.getElementById('searchInput').addEventListener('input', filterNames);
document.getElementById('genderFilter').addEventListener('change', filterNames);
window.addEventListener('DOMContentLoaded', () => {
  fetchNamesData();
  setupShareBox();
  setupAlphabetToggle();
});
