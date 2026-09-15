document.addEventListener('DOMContentLoaded', async () => {
  // DOM এলিমেন্টসমূহ
  const itemTypeBadge = document.getElementById('itemTypeBadge');
  const currentDateText = document.getElementById('currentDateText');
  const arabicText = document.getElementById('arabicText');
  const bengaliText = document.getElementById('bengaliText');
  const referenceText = document.getElementById('referenceText');
  
  const copyBtn = document.getElementById('copyBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const whatsappBtn = document.getElementById('whatsappBtn');
  const nativeShareBtn = document.getElementById('nativeShareBtn');

  // তারিখ প্রদর্শন
  const today = new Date();
  const formattedDate = today.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long'
  });
  if (currentDateText) currentDateText.innerText = formattedDate;

  try {
    // JSON ডাটা ফেচ করা
    // (যদি HTML ফাইল কোনো সাব-ফোল্ডারে থাকে তবে '../data/daily-inspiration.json' পাথ ব্যবহার করবেন)
    const response = await fetch('data/daily-inspiration.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const inspirationList = await response.json();

    if (!inspirationList || inspirationList.length === 0) return;

    // দিনের হিসেব বের করা (Day of the year)
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // ইনডেক্স নির্ধারণ
    const selectedIndex = dayOfYear % inspirationList.length;
    const currentItem = inspirationList[selectedIndex];

    // UI আপডেট করা
    if (itemTypeBadge) {
      const icon = currentItem.type === "কুরআনের আয়াত" ? "fa-book-open" : "fa-hands-praying";
      itemTypeBadge.innerHTML = `<i class="fa-solid ${icon}"></i> আজকের ${currentItem.type}`;
    }
    if (arabicText) arabicText.innerText = currentItem.arabic;
    if (bengaliText) bengaliText.innerText = `"${currentItem.bengali}"`;
    if (referenceText) referenceText.innerText = `— ${currentItem.reference}`;

    // শেয়ার মেসেজ
    const shareMessage = `${currentItem.type}:\n"${currentItem.bengali}"\n\nসূত্র: ${currentItem.reference}\n\n— ইসলামিক লাইট (Islamic Light)`;

    // ১. কপি বাটন
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(shareMessage);
          copyBtnText.innerText = "কপি হয়েছে!";
          copyBtn.style.color = "#004d40";
          setTimeout(() => {
            copyBtnText.innerText = "কপি";
            copyBtn.style.color = "";
          }, 2000);
        } catch (err) {
          alert("কপি করা সম্ভব হয়নি।");
        }
      });
    }

    // ২. হোয়াটসঅ্যাপ শেয়ার
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', () => {
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
        window.open(whatsappUrl, '_blank');
      });
    }

    // ৩. নেটিভ মোবাইল শেয়ার
    if (nativeShareBtn) {
      nativeShareBtn.addEventListener('click', async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: currentItem.type,
              text: shareMessage,
              url: window.location.href
            });
          } catch (err) {}
        } else {
          navigator.clipboard.writeText(shareMessage);
          alert("শেয়ার অপশন না থাকায় লেখাটি কপি করা হয়েছে।");
        }
      });
    }

  } catch (error) {
    console.error('JSON লোড করতে সমস্যা হয়েছে:', error);
    if (bengaliText) bengaliText.innerText = "আজকের আয়াত লোড করা যায়নি। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।";
  }
});
        
