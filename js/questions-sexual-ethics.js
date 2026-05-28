document.addEventListener('DOMContentLoaded', () => {
    const faqWrapper = document.getElementById('faq-wrapper');
    const searchInput = document.getElementById('faqSearch');
    let allData = [];

    // JSON ডাটা লোড করা
    fetch('../data/questions-sexual-ethics.json')
        .then(response => {
            if (!response.ok) throw new Error('JSON ফাইল পাওয়া যায়নি। পাথ ঠিক আছে কি না নিশ্চিত করুন।');
            return response.json();
        })
        .then(data => {
            allData = data;
            renderFAQ(allData);
        })
        .catch(err => {
            faqWrapper.innerHTML = `<p style="color:red; text-align:center; padding:20px;">ডাটা লোড হতে সমস্যা হয়েছে।</p>`;
            console.error(err);
        });

    // সাহায্যকারী ফাংশন: রেফারেন্স টেক্সট বা অ্যারে হলে তা হ্যান্ডেল করার জন্য
    function formatReference(ref) {
        if (!ref) return '';
        if (Array.isArray(ref)) {
            return ref.join(', ');
        }
        return ref;
    }

    // ডাটা রেন্ডার করার মূল ফাংশন (২১টি আইটেমের কম্বিনেশন)
    function renderFAQ(items) {
        if (items.length === 0) {
            faqWrapper.innerHTML = '<p style="text-align:center; padding:20px;">দুঃখিত, কোনো ফলাফল পাওয়া যায়নি।</p>';
            return;
        }

        faqWrapper.innerHTML = items.map(item => {
            // ১-৫. আইডি, প্রশ্ন, উত্তর এবং বিস্তারিত
            const id = item.id || '';
            const question = item.question || '';
            const shortAnswer = item.short_answer || '';
            const answer = item.answer || '';
            const details = item.details || '';
            const conclusion = item.conclusion || '';
            const medicalNote = item.medical_note || '';

            // ৬-৯. কোরআন ব্লকের প্রসেসিং (সিঙ্গেল অবজেক্ট বা একাধিক অবজেক্টের অ্যারে)
            let quranHtml = '';
            if (item.quran) {
                const quranItems = Array.isArray(item.quran) ? item.quran : [item.quran];
                quranHtml = quranItems.map(q => `
                    <div class="quran-section">
                        ${q.arabic ? `<div class="arabic">${q.arabic}</div>` : ''}
                        ${q.translation ? `<div>${q.translation}</div>` : ''}
                        ${q.reference ? `<span class="ref">সূত্র: ${formatReference(q.reference)}</span>` : ''}
                    </div>
                `).join('');
            }

            // ১০-১৩. হাদিস ব্লকের প্রসেসিং (সিঙ্গেল অবজেক্ট বা একাধিক অবজেক্টের অ্যারে)
            let hadithHtml = '';
            if (item.hadith) {
                const hadithItems = Array.isArray(item.hadith) ? item.hadith : [item.hadith];
                hadithHtml = hadithItems.map(h => `
                    <div class="hadith-section">
                        ${h.arabic ? `<div class="arabic">${h.arabic}</div>` : ''}
                        ${h.transliteration ? `<div class="trans-text"><i>${h.transliteration}</i></div>` : ''}
                        ${h.text ? `<div class="details-text" style="margin-top:0;">${h.text}</div>` : ''}
                        ${h.translation ? `<div>${h.translation}</div>` : ''}
                        ${h.reference ? `<span class="ref">সূত্র: ${formatReference(h.reference)}</span>` : ''}
                    </div>
                `).join('');
            }

            // ১৪-২১. বিভিন্ন প্রকার লিস্ট বা তালিকার প্রসেসিং
            const listsHtml = [
                { data: item.harmful_effects, label: 'ক্ষতিকর দিকসমূহ:', class: 'harmful label-red' },
                { data: item.forbidden_actions, label: 'নিষিদ্ধ কাজসমূহ:', class: 'harmful label-red' },
                { data: item.why_discouraged, label: 'অনুৎসাহিত করার কারণসমূহ:', class: 'harmful label-red' },
                { data: item.wrong_sources, label: 'ভুল বা বর্জনীয় উৎসসমূহ:', class: 'harmful label-red' },
                { data: item.important_points, label: 'গুরুত্বপূর্ণ পয়েন্ট:', class: '' },
                { data: item.important_topics, label: 'গুরুত্বপূর্ণ বিষয়সমূহ:', class: '' },
                { data: item.solution, label: 'সমাধান ও করণীয়:', class: 'solution label-blue' },
                { data: item.practical_steps, label: 'বাস্তবমুখী পদক্ষেপ বা আমল:', class: 'solution label-blue' },
                { data: item.correct_sources, label: 'সঠিক ও নির্ভরযোগ্য উৎসসমূহ:', class: 'solution label-blue' },
                { data: item.islamic_guidance, label: 'ইসলামিক নির্দেশনা বা পরামর্শ:', class: 'solution label-blue' }
            ].map(list => {
                if (list.data && Array.isArray(list.data) && list.data.length > 0) {
                    const cleanClass = list.class.split(' ')[0] || '';
                    const labelClass = list.class || '';
                    return `
                        <div class="points-label ${labelClass}">${list.label}</div>
                        <ul class="points-list ${cleanClass}">
                            ${list.data.map(li => `<li>${li}</li>`).join('')}
                        </ul>
                    `;
                }
                return '';
            }).join('');

            // প্রতিটি FAQ আইটেমের চূড়ান্ত HTML স্ট্রাকচার জেনারেশন
            return `
                <div class="faq-item">
                    <div class="faq-header">
                        <h3>${id}. ${question}</h3>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-content">
                        ${shortAnswer ? `<span class="short-ans">সারসংক্ষেপ: ${shortAnswer}</span>` : ''}
                        
                        ${answer || details ? `
                            <p class="details-text">
                                ${answer ? `<strong>উত্তর:</strong> ${answer}` : ''}
                                ${details ? `<br><br>${details}` : ''}
                            </p>
                        ` : ''}
                        
                        ${quranHtml}
                        ${hadithHtml}
                        ${listsHtml}

                        ${medicalNote ? `
                            <div class="hadith-section" style="border-right-color: #009688; background: #f0fdfa;">
                                <strong style="color: #00796b;">চিকিৎসাবিজ্ঞান ও স্বাস্থ্যগত তথ্য:</strong>
                                <p class="details-text" style="margin-top: 5px;">${medicalNote}</p>
                            </div>
                        ` : ''}

                        ${conclusion ? `<small class="conclusion">${conclusion}</small>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        // আকর্ডিয়ন চালুর লজিক
        document.querySelectorAll('.faq-header').forEach(header => {
            header.onclick = function() {
                this.parentElement.classList.toggle('active');
            };
        });
    }

    // সার্চিং ফিচার (প্রশ্ন, সারসংক্ষেপ ও মূল উত্তরের ভেতর খুঁজবে)
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allData.filter(item => 
            (item.question && item.question.toLowerCase().includes(term)) || 
            (item.short_answer && item.short_answer.toLowerCase().includes(term)) ||
            (item.answer && item.answer.toLowerCase().includes(term))
        );
        renderFAQ(filtered);
    });
});
