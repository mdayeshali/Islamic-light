// ===============================================
// ১. হেডার এবং ফুটার ইনক্লুড ফাংশন
// ===============================================

function includeHTML(callback) {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.querySelector('.surah-footer-placeholder');

    let loadCount = 0;
    const totalLoad = (headerPlaceholder ? 1 : 0) + (footerPlaceholder ? 1 : 0);

    if (totalLoad === 0) {
        if (callback) callback();
        return;
    }

    const checkComplete = () => {
        loadCount++;
        if (loadCount === totalLoad && callback) {
            callback();
        }
    };

    // হেডার লোড করা
    if (headerPlaceholder) {
        fetch('surah-header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                checkComplete();
            })
            .catch(error => console.error('Error loading header:', error));
    }

    // ফুটার লোড করা
    if (footerPlaceholder) {
        fetch('footer-surah.html')
            .then(res => res.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
                // Year update
                const yearEl = footerPlaceholder.querySelector(".footer-year");
                if (yearEl) yearEl.textContent = new Date().getFullYear();
                checkComplete();
            })
            .catch(error => console.error('Error loading footer:', error));
    }
}

// ===============================================
// ২. মেনু এবং UI টগল ফাংশন
// ===============================================

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        return;
    }
    document.querySelectorAll('.dropdown-menu').forEach(openMenu => {
        openMenu.classList.remove('show');
    });
    menu.classList.add('show');
}

document.addEventListener('click', (event) => {
    const headerBar = document.querySelector('.header-bar');
    if (headerBar && !headerBar.contains(event.target)) {
        document.querySelectorAll('.dropdown-menu.show').forEach(openMenu => {
            openMenu.classList.remove('show');
        });
    }
});

function toggleIntro(button) {
    const content = button.nextElementSibling;
    if (content.classList.contains('show')) {
        content.classList.remove('show');
        button.style.borderRadius = '8px';
        button.innerHTML = button.innerHTML.replace('📕 ভূমিকা বন্ধ করুন', '📘 ভূমিকা দেখুন'); 
    } else {
        content.classList.add('show');
        button.style.borderRadius = '8px 8px 0 0';
        button.innerHTML = button.innerHTML.replace('📘 ভূমিকা দেখুন', '📕 ভূমিকা বন্ধ করুন');
    }
}

// ===============================================
// ৩. সেটিংস ম্যানেজমেন্ট ফাংশন
// ===============================================

function toggleFeature(featureName, isChecked, shouldSave = true) {
    const elements = document.querySelectorAll(`.${featureName}`);
    elements.forEach(el => {
        el.style.display = isChecked ? 'block' : 'none';
    });
    if (shouldSave) {
        localStorage.setItem(featureName, isChecked);
    }
}

function changeFontSize(direction) {
    const rootElement = document.documentElement;
    let currentSize = parseInt(localStorage.getItem('fontSize') || '16');
    let newSize = currentSize + direction;
    if (newSize < 14) newSize = 14;
    if (newSize > 24) newSize = 24;

    rootElement.style.setProperty('--base-font-size', newSize + 'px');
    localStorage.setItem('fontSize', newSize.toString());
    const fontSizeDisplay = document.getElementById('current-font-size');
    if (fontSizeDisplay) fontSizeDisplay.innerText = newSize + 'px';
}

function loadSettings() {
    ['transliteration', 'tafsir'].forEach(feature => {
        const isEnabled = localStorage.getItem(feature) === 'true';
        const toggleElement = document.getElementById(`${feature}-toggle`);
        if (toggleElement) {
            toggleElement.checked = isEnabled;
            toggleFeature(feature, isEnabled, false);
        }
    });

    const savedFontSize = localStorage.getItem('fontSize') || '16';
    document.documentElement.style.setProperty('--base-font-size', savedFontSize + 'px');
    const fontSizeDisplay = document.getElementById('current-font-size');
    if (fontSizeDisplay) fontSizeDisplay.innerText = savedFontSize + 'px';
}

// ===============================================
// ৪. আয়াত কপি এবং শেয়ার ফাংশন
// ===============================================

function loadAyatActions() {
    fetch('ayat-actions.html')
        .then(response => response.text())
        .then(data => {
            const placeholders = document.querySelectorAll('.action-placeholder');
            placeholders.forEach(placeholder => {
                placeholder.innerHTML = data;
                const ayatDiv = placeholder.closest('.ayat');
                const ayatId = ayatDiv ? ayatDiv.id : '';
                const match = ayatId.match(/ayat(\d+)/);
                if (match) {
                    const numberDisplay = placeholder.querySelector('.ayat-number-placeholder');
                    if (numberDisplay) numberDisplay.innerText = match[1];
                }
            });
        })
        .catch(error => console.error('Error loading Ayah actions:', error));
}

function copyAyat(buttonElement) {
    const ayatDiv = buttonElement.closest('.ayat');
    if (!ayatDiv) return;
    const translationText = ayatDiv.querySelector('.translation')?.innerText.trim() || 'অনুবাদ নেই';
    const ayatId = ayatDiv.id;
    const shareLink = `${window.location.href.split('#')[0]}#${ayatId}`;
    const textToCopy = `${translationText}\n\n[কুরআন লিঙ্ক] ${shareLink}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        buttonElement.innerText = 'কপি হলো! ✅';
        setTimeout(() => buttonElement.innerText = 'কপি 📑', 1500);
    });
}

function shareAyat(buttonElement) {
    const ayatDiv = buttonElement.closest('.ayat');
    if (!ayatDiv) return;
    const translationText = ayatDiv.querySelector('.translation')?.innerText.trim() || '';
    const shareLink = `${window.location.href.split('#')[0]}#${ayatDiv.id}`;

    if (navigator.share) {
        navigator.share({ title: 'কুরআনের আয়াত', text: translationText, url: shareLink });
    } else {
        alert("শেয়ার অপশন সাপোর্ট করছে না। লিঙ্কটি কপি করুন: " + shareLink);
    }
}

// ===============================================
// ৫. ইনিশিয়াল কল
// ===============================================

document.addEventListener('DOMContentLoaded', () => {
    includeHTML(() => {
        loadSettings();
        loadAyatActions(); 
    });
});


