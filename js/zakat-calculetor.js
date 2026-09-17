document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const silverPriceInput = document.getElementById('silverPrice');
  const nisabThresholdText = document.getElementById('nisabThresholdText');
  
  const cashInHand = document.getElementById('cashInHand');
  const goldValue = document.getElementById('goldValue');
  const businessStock = document.getElementById('businessStock');
  const receivableMoney = document.getElementById('receivableMoney');
  
  const debtsToPay = document.getElementById('debtsToPay');
  const unpaidBills = document.getElementById('unpaidBills');

  const calculateBtn = document.getElementById('calculateBtn');
  const resetBtn = document.getElementById('resetBtn');

  const resultCard = document.getElementById('resultCard');
  const resultStatus = document.getElementById('resultStatus');
  const totalAssetsText = document.getElementById('totalAssetsText');
  const totalDebtsText = document.getElementById('totalDebtsText');
  const netWorthText = document.getElementById('netWorthText');
  const finalZakatAmount = document.getElementById('finalZakatAmount');
  const zakatFinalBox = document.getElementById('zakatFinalBox');

  // রূপার নেসাব পরিমাণ = ৫২.৫ তোলা = প্রায় ৬১২.৩৬ গ্রাম
  const SILVER_NISAB_GRAMS = 612.36;
  const DEFAULT_SILVER_PRICE = 210; // ইনপুট ফাঁকা থাকলে ডিফল্ট দর

  // ১. বাংলা সংখ্যা ও কমা ফরম্যাটার (১,০০,০০০ / ৪৫,০০,০০০)
  function formatBengaliCurrency(number) {
    if (isNaN(number) || number === null) return '৳ ০';
    
    const rounded = Math.round(number);
    let str = rounded.toString();

    // ভারতীয়/বাংলাদেশী কমা ফরম্যাট (শেষের ৩টি, তারপর প্রতি ২টি পর পর কমা)
    let lastThree = str.substring(str.length - 3);
    let otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    let formattedEnglish = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    // ইংরেজি সংখ্যা থেকে বাংলা সংখ্যায় রূপান্তর
    const banglaDigits = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
      ',': ','
    };

    let formattedBengali = formattedEnglish.replace(/[0-9,]/g, char => banglaDigits[char] || char);
    return '৳ ' + formattedBengali;
  }

  // ২. ইনপুট থেকে নিরাপদ সংখ্যা নেওয়ার হেল্পার (ফাঁকা থাকলে ০ রিটার্ন করবে)
  function getNum(elem) {
    if (!elem) return 0;
    const val = parseFloat(elem.value);
    return isNaN(val) || val < 0 ? 0 : val;
  }

  // ৩. নেসাবের মোট মূল্য আপডেট করা (ফাঁকা থাকলে ডিফল্ট ২১০ টাকা নিবে)
  function updateNisabThreshold() {
    let perGramPrice = getNum(silverPriceInput);
    if (perGramPrice === 0) {
      perGramPrice = DEFAULT_SILVER_PRICE;
    }

    const nisabTotal = perGramPrice * SILVER_NISAB_GRAMS;
    if (nisabThresholdText) {
      nisabThresholdText.innerText = formatBengaliCurrency(nisabTotal);
    }
    return nisabTotal;
  }

  if (silverPriceInput) {
    silverPriceInput.addEventListener('input', updateNisabThreshold);
  }

  // ৪. জাকাত হিসাব ফাংশন
  function calculateZakat() {
    const nisabAmount = updateNisabThreshold();

    // যেকোনো ঘরে মান থাকলে যোগ হবে, বাকিগুলো ০ থাকবে
    const totalAssets = getNum(cashInHand) + getNum(goldValue) + getNum(businessStock) + getNum(receivableMoney);
    const totalDebts = getNum(debtsToPay) + getNum(unpaidBills);
    const netZakatable = totalAssets - totalDebts;

    // বিবরণ প্রদর্শন (কমা সহ)
    totalAssetsText.innerText = formatBengaliCurrency(totalAssets);
    totalDebtsText.innerText = formatBengaliCurrency(totalDebts);
    netWorthText.innerText = formatBengaliCurrency(netZakatable > 0 ? netZakatable : 0);

    resultCard.style.display = 'block';

    // নেসাব পরিমাণ পৌঁছালে ২.৫% জাকাত হিসেব হবে
    if (netZakatable >= nisabAmount && nisabAmount > 0) {
      const zakatAmount = netZakatable * 0.025; // ২.৫% জাকাত
      resultStatus.className = 'result-status eligible';
      resultStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> মাশাআল্লাহ! আপনার ওপর জাকাত ফরজ হয়েছে।';
      
      zakatFinalBox.style.display = 'block';
      finalZakatAmount.innerText = formatBengaliCurrency(zakatAmount);
    } else {
      resultStatus.className = 'result-status not-eligible';
      resultStatus.innerHTML = '<i class="fa-solid fa-circle-info"></i> আপনার সম্পদ নেসাব পরিমাণের কম হওয়ায় জাকাত ফরজ নয়।';
      
      zakatFinalBox.style.display = 'none';
    }

    // ফলাফলের দিকে স্মুথ স্ক্রোল
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ৫. রিসেট ফাংশন
  function resetAll() {
    const inputs = document.querySelectorAll('.calc-input');
    inputs.forEach(input => input.value = '');
    resultCard.style.display = 'none';
    updateNisabThreshold();
  }

  calculateBtn.addEventListener('click', calculateZakat);
  resetBtn.addEventListener('click', resetAll);

  // পেজ লোডের সময় নেসাব ইনিশিয়ালাইজ করা
  updateNisabThreshold();
});
